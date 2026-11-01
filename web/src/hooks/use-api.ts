'use client';
import {useCallback,useEffect,useState} from 'react';
import {api} from '@/lib/student-api';
export function useApi<T>(path:string|null) {
 const [state,setState]=useState<{data:T|null;error:string;loading:boolean}>({data:null,error:'',loading:true});
 const [revision,setRevision]=useState(0);
 const reload=useCallback(()=>setRevision(value=>value+1),[]);

 useEffect(()=>{
  if(!path)return;
  let active = true;
  const frame = requestAnimationFrame(() => { if (active) setState(prev => ({...prev, loading: true})); });

  api<T>(path)
    .then(data => {
      if (active) setState({data, error: '', loading: false});
    })
    .catch((error: Error) => {
      if (active) setState({data: null, error: error.message, loading: false});
    });

  return () => {
    active = false;
    cancelAnimationFrame(frame);
  };
 },[path,revision]);

 return {...state,reload};
}
