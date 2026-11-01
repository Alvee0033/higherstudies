const text = value => value.replace(/<[^>]*>/g,' ').replace(/&#64;|&commat;/g,'@').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim();
const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function extractPublicContact(html, name, pageUrl) {
 const url=new URL(pageUrl);if(url.protocol!=='https:')return null;
 const headings=[...html.matchAll(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map(match=>normalize(text(match[1])));
 const expected=normalize(name);if(!expected||!headings.some(heading=>` ${heading} `.includes(` ${expected} `)))return null;
 const emails=[...new Set([...html.matchAll(/href\s*=\s*["']mailto:([^"'<>]+)["']/gi)].map(match=>{try{return decodeURIComponent(match[1].split('?')[0]).trim().toLowerCase();}catch{return '';}}).filter(email=>/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)&&! /^(info|privacy|support|webmaster|admin|office|press|contact|datenschutz)@/i.test(email)))];
 // Ambiguous directory pages never assign another person's address.
 if(emails.length!==1)return null;
 return {publicEmail:emails[0],officialProfileUrl:url.href,evidenceExcerpt:`Official profile heading: ${name}. Published public contact: ${emails[0]}.`,observedAt:new Date().toISOString()};
}
