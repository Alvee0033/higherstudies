'use client';
import {createContext,useContext,useEffect,type ReactNode} from 'react';
import {useRouter} from 'next/navigation';
import {useApi} from '@/hooks/use-api';
import {api,type Identity} from '@/lib/student-api';
const Context=createContext<{user:Identity;refresh:()=>void}|null>(null);
export function StudentSession({children}:{children:ReactNode}) {
 const session=useApi<{data:Identity}>('/v1/student/auth/me');const router=useRouter();
 useEffect(()=>{
   if(session.error) {
     if (typeof window !== 'undefined') localStorage.removeItem('hs_student_token');
     router.replace('/login');
   }
 },[session.error,router]);
 if(!session.data)return <div className="p-8 text-sm text-slate-500" role="status">{session.error?'Please sign in to continue.':'Loading your account…'}</div>;
 return <Context.Provider value={{user:session.data.data,refresh:session.reload}}>{children}</Context.Provider>;
}
export function useStudent(){const value=useContext(Context);if(!value)throw new Error('Student session required');return value;}
export async function logout(){
  try {
    await api('/v1/student/auth/logout',{method:'POST'});
  } finally {
    if (typeof window !== 'undefined') localStorage.removeItem('hs_student_token');
    window.location.href = '/login';
  }
}
