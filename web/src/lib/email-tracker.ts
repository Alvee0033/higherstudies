import {placeholderAvatar,safeUrl} from './student-api';
import type {EmailRecord,EmailStatus} from '@/components/screens/email-tracker/email-tracker-types';
export interface TrackedEmail {id:string;professor_name:string;professor_title?:string;institution_name:string;institution_url?:string;academic_unit?:string;email:string;subject?:string;website?:string;status:string;sent_at?:string;follow_up_at?:string;replied_at?:string;notes:string;updated_at:string}
export function emailRecord(row:TrackedEmail):EmailRecord {
 const statuses:Record<string,EmailStatus>={draft:'Not Sent',sent:'No Response',waiting:'Waiting',positive_reply:'Positive Reply',negative_reply:'Negative Reply',interview:'Interview'};
 const date=(value?:string)=>value?new Date(value).toLocaleDateString('en-US'):'';
 const time=(value?:string)=>value?new Date(value).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}):'';
 return {id:row.id,professorName:row.professor_name,professorTitle:row.professor_title||'Title not recorded',avatar:placeholderAvatar,universityName:row.institution_name,universitySub:row.academic_unit||'',universityLogoType:'generic',universityUrl:safeUrl(row.institution_url),email:row.email,subject:row.subject,sentDate:date(row.sent_at),sentTime:time(row.sent_at),reminderDate:date(row.follow_up_at),reminderTime:time(row.follow_up_at),reminderOverdue:!!row.follow_up_at&&Date.parse(row.follow_up_at)<Date.now(),replyDate:date(row.replied_at),replyTime:time(row.replied_at),status:statuses[row.status]??'Not Sent',notes:row.notes,website:safeUrl(row.website),lastUpdated:{date:new Date(row.updated_at).toLocaleString(),author:'You'}};
}
export function emailPayload(row:EmailRecord){
 const iso=(date?:string,time?:string)=>{if(!date)return undefined;const value=new Date(`${date} ${time||'00:00'}`);if(Number.isNaN(value.getTime()))throw new Error('Enter a valid date and time');return value.toISOString();};
 const statuses:Record<EmailStatus,string>={'Not Sent':'draft','No Response':'sent','Waiting':'waiting','Reminder Due':'waiting','Positive Reply':'positive_reply','Negative Reply':'negative_reply','Interview':'interview'};
 return {professorName:row.professorName,professorTitle:row.professorTitle,email:row.email,institutionName:row.universityName,academicUnit:row.universitySub,website:safeUrl(row.website),subject:row.subject,notes:row.notes,status:statuses[row.status],sentAt:iso(row.sentDate,row.sentTime),followUpAt:iso(row.reminderDate,row.reminderTime),repliedAt:iso(row.replyDate,row.replyTime)};
}
