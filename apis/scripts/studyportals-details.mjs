const unwrap = value => value && typeof value === 'object' && 'func' in value ? value.func : value;
const date = value => {
 const raw=unwrap(value)?.parameters?.[0];
 return typeof raw==='string' && /^\d{4}-\d{2}-\d{2}T/.test(raw) && Number.isFinite(Date.parse(raw)) ? raw.slice(0,10) : null;
};
export function readProgrammeDetails(card) {
 const get = key => unwrap(card?.[key]);
 const duration=get('getDuration');
 const english=get('getEnglishRequirements');
 const exams=[['IELTS','getIELTS','canShowIELTS',0,9],['TOEFL iBT','getTOEFLInternet','canShowTOEFLInternet',0,120],['TOEFL paper','getTOEFLPaper','canShowTOEFLPaper',0,677],['PTE','getPTE','canShowPTE',0,90],['Duolingo','getDuolingo','canShowDuolingo',0,160]].flatMap(([type,key,show,min,max])=>{
  const raw=unwrap(english?.[key]);const score=Number(raw);
  return english?.[show]===true && raw!==null && raw!==undefined && raw!=='' && Number.isFinite(score) && score>=min && score<=max ? [{type,score}] : [];
 });
 const timings=get('getTimings');const intakes=(Array.isArray(timings)?timings:[]).slice(0,30).flatMap(entry=>{
  const timing=unwrap(entry),start=unwrap(timing?.getStartDate);
  const deadlines=unwrap(start?.getDeadlines);const all=Array.isArray(deadlines)&&deadlines.length?deadlines:[timing?.getDeadline];
  return all.filter(Boolean).map(value=>{const deadline=unwrap(value);return {startsOn:date(start?.getDate),deadlineOn:date(deadline?.getDate),applicantCategory:typeof deadline?.getType==='string'?deadline.getType:'not reported',startingAnytime:timing?.isStartingAnytime===true,applyingAnytime:timing?.isApplyingAnytime===true};});
 });
 const language=get('getLanguage');
 const summary=get('getSummary');
 return {
  duration: duration && Number.isFinite(Number(duration.getAmount)) && Number(duration.getAmount)>0 ? {amount:Number(duration.getAmount),unit:typeof duration.getPeriod==='string'?duration.getPeriod:null}:null,
  intakes,englishRequirements:exams,
  delivery:[['On campus','isOnCampus'],['Online','isOnline'],['Fully online','isFullyOnline'],['Blended','isBlended']].filter(([,key])=>get(key)===true).map(([label])=>label),
  attendance:[['Full-time','isFullTime'],['Part-time','isPartTime']].filter(([,key])=>get(key)===true).map(([label])=>label),
  language:typeof language==='string'?language:null,
  summary:typeof summary==='string'?summary.slice(0,6000):null,
  // A portal's scholarship advertisement does not establish programme funding eligibility.
 };
}
