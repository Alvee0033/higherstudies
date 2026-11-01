import {BadRequestException} from '@nestjs/common';
import type {PoolClient} from 'pg';
export async function publishFacultyContact(client:PoolClient,payload:Record<string,unknown>,evidenceId:string) {
 const get=(key:string)=>typeof payload[key]==='string'?(payload[key] as string).trim():'';
 const email=get('publicEmail'),profile=get('officialProfileUrl');
 const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!uuid.test(get('existingFacultyId'))||!uuid.test(get('institutionId'))||!get('name'))throw new BadRequestException('Invalid faculty contact identity or email');
 let url:URL;try{url=new URL(profile);}catch{throw new BadRequestException('Invalid official profile URL');}
 if(url.protocol!=='https:'||url.username||url.password)throw new BadRequestException('Official profile must be HTTPS');
 const updated=await client.query<{id:string}>(`UPDATE faculty_member SET public_email=$1,official_profile_url=$2,public_email_evidence_id=$3,public_email_verified_at=now(),updated_at=now() WHERE id=$4 AND institution_id=$5 AND lower(name)=lower($6) RETURNING id`,[email,url.href,evidenceId,get('existingFacultyId'),get('institutionId'),get('name')]);
 if(!updated.rows[0])throw new BadRequestException('Contact no longer matches faculty identity');
 return updated.rows[0].id;
}
