'use client';
import {useState} from 'react';
import {useApi} from './use-api';
import {api,workspace,type SavedRecord} from '@/lib/student-api';
export function useSaved(){
 const result=useApi<{data:SavedRecord[]}>(`${workspace}/saved`);const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 const has=(kind:SavedRecord['kind'],id:string)=>(result.data?.data??[]).some(item=>item.kind===kind&&item.id===id);
 const toggle=async(kind:SavedRecord['kind'],id:string)=>{if(busy)return;setBusy(true);setError('');try{await api(`${workspace}/saved/${kind}/${id}`,{method:has(kind,id)?'DELETE':'POST'});result.reload();}catch(e){setError(e instanceof Error?e.message:'Unable to save item');}finally{setBusy(false);}};
 return {...result,error:error||result.error,has,toggle,busy};
}
