export function getApiBase(): string {
  if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    const configured = process.env.NEXT_PUBLIC_API_URL;
    if (configured) {
      try {
        const u = new URL(configured);
        if ((currentHost === 'localhost' || currentHost === '127.0.0.1') && (u.hostname === 'localhost' || u.hostname === '127.0.0.1')) {
          u.hostname = currentHost;
          return u.origin;
        }
        return configured.replace(/\/$/, '');
      } catch {
        return configured.replace(/\/$/, '');
      }
    }
    return `http://${currentHost}:4100`;
  }
  return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100').replace(/\/$/, '');
}

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100').replace(/\/$/, '');
export class ApiError extends Error { constructor(message:string, public status:number) { super(message); } }
export async function api<T>(path:string, options:RequestInit = {}):Promise<T> {
  const headers = new Headers(options.headers);
  if(options.body) headers.set('Content-Type','application/json');

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('hs_student_token');
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  if(options.method && !['GET','HEAD'].includes(options.method) && path.startsWith('/v1/student/') && !/\/auth\/(login|register)$/.test(path)) {
    try {
      const csrf = await api<{data:{token:string}}>('/v1/student/auth/csrf');
      if (csrf?.data?.token) headers.set('X-CSRF-Token',csrf.data.token);
    } catch {}
  }
  const baseUrl = getApiBase();
  const response = await fetch(`${baseUrl}${path}`,{...options,headers,credentials:'include',cache:'no-store'});
  const result = await response.json().catch(()=>null);
  if(!response.ok) throw new ApiError(Array.isArray(result?.message)?result.message.join('. '):result?.message || `Request failed (${response.status})`,response.status);
  if (typeof window !== 'undefined' && result?.data?.token) {
    localStorage.setItem('hs_student_token', result.data.token);
  }
  return result as T;
}
export interface Identity {id:string;email:string;displayName:string}
export interface Page<T> {data:T[];page:{total?:number;nextCursor:string|null}}
export interface CatalogueRecord {
 id:string;name?:string;title?:string;institution_id?:string;institution_name?:string;country_code?:string;city?:string;
 official_url?:string;institution_official_url?:string;official_profile_url?:string;public_email?:string;public_email_source_url?:string;verified_at?:string;
 degree?:string;academic_unit?:string;research_topics?:string[];research_metadata?:{hIndex?:number;worksCount?:number;citedByCount?:number;[key:string]:unknown};
 orcid_id?:string;profile_source_url?:string;created_at?:string;next_deadline?:string;language?:string;
 tuition?:{amount?:number;currency?:string;period?:string;unit?:string}[];source_details?:Record<string,unknown>;requirements?:{type:string;value_number?:number;state:string}[];
 funding?:unknown[];
 programme_count?:number;faculty_count?:number;
 evidence_url?:string;source_name?:string;application_status?:string;admission_note?:string;
}
export interface SavedRecord {kind:'institutions'|'programmes'|'faculty';id:string;record:CatalogueRecord}
export const workspace = '/v1/student/workspace';
export function countryName(code?:string) { if(!code)return 'Not reported'; try{return new Intl.DisplayNames(['en'],{type:'region'}).of(code)||code;}catch{return code;} }
export function safeUrl(value?:string) {try{const url=new URL(value||'');return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password?url.href:undefined;}catch{return undefined;} }
export const placeholderAvatar = '/images/avatar-placeholder.svg';
export function exportCsv(name:string,rows:Record<string,unknown>[]) {
 const keys=Array.from(new Set(rows.flatMap(Object.keys)));
 const cell=(v:unknown)=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
 const blob=new Blob([keys.map(cell).join(',')+'\r\n'+rows.map(row=>keys.map(key=>cell(row[key])).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
 const href=URL.createObjectURL(blob); const anchor=document.createElement('a');anchor.href=href;anchor.download=name;anchor.click();URL.revokeObjectURL(href);
}
