import {BadRequestException,Injectable,NotFoundException} from '@nestjs/common';
import {DatabaseService} from '../../database/database.service.js';
import {assertPublicCatalogueReleased} from '../catalog/public-catalogue-release.js';
const statuses=['Not Started','Preparing','Submitted','Interview','Waiting','Accepted','Rejected','Visa'];
export function validateApplication(input:Record<string,unknown>) {
 const allowed=['details','documents','universityName','program','department','applicationId','intake','deadline','submittedDate','interviewDate','country','status','progressPercent','checklist','isActiveFocus'];
 if(Object.keys(input).some(key=>!allowed.includes(key)))throw new BadRequestException('Unknown application field');
 for(const key of ['universityName','program','intake','country'])if(typeof input[key]!=='string'||!input[key].trim()||input[key].length>300)throw new BadRequestException(`${key} is required (max 300 characters)`);
 if(!statuses.includes(String(input.status)))throw new BadRequestException('Invalid application status');
 for(const [key,value] of Object.entries(input)){
  if(['progressPercent','checklist','isActiveFocus','details','documents'].includes(key))continue;
  if(typeof value!=='string'||value.length>1000)throw new BadRequestException(`Invalid ${key}`);
 }
 if(input.progressPercent!==undefined&&(typeof input.progressPercent!=='number'||input.progressPercent<0||input.progressPercent>100))throw new BadRequestException('Invalid progress');
 if(input.isActiveFocus!==undefined&&typeof input.isActiveFocus!=='boolean')throw new BadRequestException('Invalid focus');
 if(input.checklist!==undefined&&(!Array.isArray(input.checklist)||input.checklist.length>100||input.checklist.some(item=>!item||typeof item.task!=='string'||item.task.length>500||!['Completed','Pending'].includes(item.status)||Object.keys(item).some(key=>!['task','status','date'].includes(key)))))throw new BadRequestException('Invalid checklist');
 for(const key of ['details','documents']){const value=input[key];if(value!==undefined&&(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length>30||Object.entries(value).some(([key,item])=>!/^\w{1,50}$/.test(key)||typeof item!=='string'||item.length>5000)))throw new BadRequestException(`Invalid ${key}`);}
 return input;
}
@Injectable()
export class StudentWorkspaceService {
 constructor(private readonly db:DatabaseService){}
 async summary(userId:string){
  const [catalogue,counts,statuses,emails]=await Promise.all([
   this.db.query(`SELECT (SELECT count(*)::int FROM programme WHERE status='published') AS programmes,(SELECT count(*)::int FROM faculty_member WHERE status='published') AS faculty,(SELECT count(*)::int FROM institution WHERE status='published') AS institutions`),
   this.db.query(`SELECT (SELECT count(*)::int FROM student_application WHERE student_id=$1) AS applications,count(*) FILTER(WHERE sent_at IS NOT NULL)::int AS sent,count(*) FILTER(WHERE replied_at IS NOT NULL OR status IN ('positive_reply','negative_reply','interview'))::int AS replies FROM student_email_tracker WHERE student_id=$1`,[userId]),
   this.db.query(`SELECT payload->>'status' AS status,count(*)::int AS count FROM student_application WHERE student_id=$1 GROUP BY payload->>'status'`,[userId]),
   this.db.query(`SELECT e.id,e.professor_name,e.institution_name,e.subject,e.sent_at,e.follow_up_at,e.status,i.official_url AS institution_url FROM student_email_tracker e LEFT JOIN institution i ON lower(i.name)=lower(e.institution_name) WHERE e.student_id=$1 ORDER BY e.updated_at DESC LIMIT 10`,[userId])
  ]);return {data:{...catalogue[0],...counts[0],statuses,emails}};
 }
 async application(userId:string,id:string){const rows=await this.db.query(`SELECT payload||jsonb_build_object('id',id) AS data FROM student_application WHERE student_id=$1 AND id=$2`,[userId,id]);if(!rows[0])throw new NotFoundException();return rows[0];}
 async document(userId:string,kind:'profile'|'settings'){
  const rows=await this.db.query(`SELECT ${kind} AS data FROM student_workspace WHERE student_id=$1`,[userId]);return {data:rows[0]?.data??{}};
 }
 async saveDocument(userId:string,kind:'profile'|'settings',data:Record<string,unknown>){
  const strings=kind==='profile'?['fundingPref','targetIntake','fullName','phone','university','degree','cgpa','greScore','ieltsScore']:['name','phone','timezone'];
  const booleans=kind==='settings'?['emailAlerts','deadlineReminders','weeklyDigest','professorReplies']:[];
  for(const [key,value] of Object.entries(data)){
   if(strings.includes(key)){if(typeof value!=='string'||value.length>300)throw new BadRequestException(`Invalid ${key}`);}
   else if(booleans.includes(key)){if(typeof value!=='boolean')throw new BadRequestException(`Invalid ${key}`);}
   else if(kind==='profile'&&key==='countries'){if(!Array.isArray(value)||value.length>100||value.some(item=>typeof item!=='string'||item.length>100))throw new BadRequestException('Invalid countries');}
   else throw new BadRequestException(`Unknown ${kind} field: ${key}`);
  }
  const displayName=kind==='profile'?data.fullName:data.name;
  if(typeof displayName==='string'&&displayName.trim().length>=2&&displayName.trim().length<=100)await this.db.query('UPDATE student_user SET display_name=$2 WHERE id=$1',[userId,displayName.trim()]);
  const rows=await this.db.query(`INSERT INTO student_workspace(student_id,${kind}) VALUES($1,$2) ON CONFLICT(student_id) DO UPDATE SET ${kind}=student_workspace.${kind}||EXCLUDED.${kind},updated_at=now() RETURNING ${kind} AS data`,[userId,JSON.stringify(data)]);return rows[0];
 }
 async applications(userId:string){return {data:await this.db.query(`SELECT payload||jsonb_build_object('id',id) AS item FROM student_application WHERE student_id=$1 ORDER BY created_at DESC,id LIMIT 100`,[userId]).then(rows=>rows.map(row=>row.item))};}
 async saveApplication(userId:string,data:Record<string,unknown>,id?:string){
  if(id){const previous=await this.db.query(`SELECT payload FROM student_application WHERE student_id=$1 AND id=$2`,[userId,id]);if(!previous[0])throw new NotFoundException();data={...previous[0].payload,...data};}
  validateApplication(data);
  const rows=id?await this.db.query(`UPDATE student_application SET payload=$3,updated_at=now() WHERE student_id=$1 AND id=$2 RETURNING payload||jsonb_build_object('id',id) AS data`,[userId,id,JSON.stringify(data)]):await this.db.query(`INSERT INTO student_application(student_id,payload) VALUES($1,$2) RETURNING payload||jsonb_build_object('id',id) AS data`,[userId,JSON.stringify(data)]);return rows[0];
 }
 async removeApplication(userId:string,id:string){await this.db.query('DELETE FROM student_application WHERE student_id=$1 AND id=$2',[userId,id]);return {data:{success:true}};}
 async saved(userId:string){
  assertPublicCatalogueReleased();
  const data=await this.db.query(`SELECT s.kind,s.record_id AS id,s.created_at,CASE s.kind WHEN 'institutions' THEN to_jsonb(i) WHEN 'programmes' THEN to_jsonb(p)||jsonb_build_object('institution_name',pi.name,'institution_official_url',pi.official_url) ELSE to_jsonb(f)||jsonb_build_object('institution_name',fi.name,'institution_official_url',fi.official_url) END AS record FROM student_saved_item s LEFT JOIN institution i ON s.kind='institutions' AND i.id=s.record_id AND i.status='published' AND EXISTS(SELECT 1 FROM source_evidence e JOIN source so ON so.id=e.source_id WHERE e.id=i.evidence_id AND so.permission_status='approved') LEFT JOIN programme p ON s.kind='programmes' AND p.id=s.record_id AND p.status='published' AND EXISTS(SELECT 1 FROM source_evidence e JOIN source so ON so.id=e.source_id WHERE e.id=p.evidence_id AND so.permission_status='approved') LEFT JOIN institution pi ON pi.id=p.institution_id LEFT JOIN faculty_member f ON s.kind='faculty' AND f.id=s.record_id AND f.status='published' AND EXISTS(SELECT 1 FROM source_evidence e JOIN source so ON so.id=e.source_id WHERE e.id=f.evidence_id AND so.permission_status='approved') LEFT JOIN institution fi ON fi.id=f.institution_id WHERE s.student_id=$1 ORDER BY s.created_at DESC LIMIT 100`,[userId]);return {data:data.filter(row=>row.record)};
 }
 async saveItem(userId:string,kind:string,id:string,remove=false){
  const table=({institutions:'institution',programmes:'programme',faculty:'faculty_member'} as Record<string,string>)[kind];if(!table)throw new BadRequestException('Invalid saved item kind');
  if(remove)await this.db.query('DELETE FROM student_saved_item WHERE student_id=$1 AND kind=$2 AND record_id=$3',[userId,kind,id]);
  else {if(!(await this.db.query(`SELECT t.id FROM ${table} t JOIN source_evidence e ON e.id=t.evidence_id JOIN source so ON so.id=e.source_id WHERE t.id=$1 AND t.status='published' AND so.permission_status='approved'`,[id])).length)throw new NotFoundException();await this.db.query('INSERT INTO student_saved_item(student_id,kind,record_id) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[userId,kind,id]);}
  return {data:{success:true}};
 }
}
