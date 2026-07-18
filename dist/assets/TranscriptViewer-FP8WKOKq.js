import{c as o,r as m,j as t}from"./App-D2-S8mki.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M11 14h10",key:"1w8e9d"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v1.344",key:"1e62lh"}],["path",{d:"m17 18 4-4-4-4",key:"z2g111"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113",key:"bjbb7m"}],["rect",{x:"8",y:"2",width:"8",height:"4",rx:"1",key:"ublpy"}]],v=o("clipboard-paste",y);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],N=o("copy",g);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]],k=o("rotate-ccw",j);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],w=o("search",f),C=({transcript:l,videoId:p})=>{const[i,x]=m.useState(""),h=m.useMemo(()=>(l||"").split(`
`),[l]),a=i.trim().toLowerCase(),c=a?h.filter(s=>s.toLowerCase().includes(a)):h,d=s=>{if(!a)return s;const n=[];let e=s,r=e.toLowerCase().indexOf(a),u=0;for(;r!==-1;)n.push(e.slice(0,r)),n.push(t.jsx("mark",{className:"bg-primary/40 text-inherit rounded px-0.5",children:e.slice(r,r+a.length)},u++)),e=e.slice(r+a.length),r=e.toLowerCase().indexOf(a);return n.push(e),n};return t.jsxs("div",{className:"glass p-4 sm:p-6 rounded-xl",children:[t.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3 mb-4",children:[t.jsx("h4",{className:"text-lg font-semibold",children:"Transcript"}),t.jsxs("div",{className:"relative flex-1 min-w-[200px] max-w-xs ml-auto",children:[t.jsx(w,{className:"w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"}),t.jsx("input",{type:"text",value:i,onChange:s=>x(s.target.value),placeholder:"Search in transcript…",className:"input-modern w-full pl-9 pr-3 py-2 text-sm","aria-label":"Search in transcript"})]})]}),t.jsx("p",{className:"text-xs text-muted-foreground mb-3",children:a?`${c.length} matching line${c.length===1?"":"s"}`:"Tip: click a timestamp to jump to that moment on YouTube"}),t.jsx("div",{className:"bg-background/50 p-4 sm:p-6 rounded-lg min-h-[40vh] max-h-[75vh] overflow-y-auto",children:t.jsxs("div",{className:"text-[15px] leading-7 space-y-1.5 text-left",children:[c.length===0&&t.jsxs("p",{className:"text-muted-foreground",children:['No lines match "',i,'".']}),c.map((s,n)=>{const e=s.match(/^\[(\d+):(\d{2})\]\s?(.*)$/);if(!e)return t.jsx("div",{children:d(s)},n);const r=parseInt(e[1],10)*60+parseInt(e[2],10);return t.jsxs("div",{children:[t.jsxs("a",{href:`https://www.youtube.com/watch?v=${p}&t=${r}s`,target:"_blank",rel:"noopener noreferrer",className:"text-primary hover:underline font-mono text-sm",title:"Jump to this moment on YouTube",children:["[",e[1],":",e[2],"]"]})," ",d(e[3])]},n)})]})})]})};export{v as C,k as R,w as S,C as T,N as a};
