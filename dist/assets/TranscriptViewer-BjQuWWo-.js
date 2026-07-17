import{c as i,r as h,j as e}from"./App-CjI4PwOS.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M11 14h10",key:"1w8e9d"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v1.344",key:"1e62lh"}],["path",{d:"m17 18 4-4-4-4",key:"z2g111"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113",key:"bjbb7m"}],["rect",{x:"8",y:"2",width:"8",height:"4",rx:"1",key:"ublpy"}]],T=i("clipboard-paste",g);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]],j=i("clock",y);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],L=i("copy",f);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],v=i("loader-circle",b);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]],S=i("rotate-ccw",w);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],k=i("search",N);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",key:"1q2vi4"}],["path",{d:"m10 15 5-3-5-3z",key:"1jp15x"}]],C=i("youtube",_),M=({isVisible:l,videoUrl:x,mode:a="transcript"})=>{const[p,d]=h.useState(0);return h.useEffect(()=>{let s;return l?(typeof dataLayer<"u"&&dataLayer.push({event:"processing_overlay_shown",video_url:x,timestamp:new Date().toISOString()}),s=setInterval(()=>{d(o=>o+1)},1e3)):d(0),()=>{s&&clearInterval(s)}},[l,x]),l?e.jsx("div",{className:"fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",children:e.jsxs("div",{className:"bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden",children:[e.jsxs("div",{className:"bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center",children:[e.jsxs("div",{className:"flex items-center justify-center space-x-2 mb-2",children:[e.jsx(C,{className:"w-6 h-6"}),e.jsx("h3",{className:"text-xl font-bold",children:"TranscriptFlow"})]}),e.jsx("p",{className:"text-blue-100",children:a==="transcript"?"Generating your transcript...":`Preparing your ${a.toUpperCase()} file...`})]}),e.jsxs("div",{className:"p-6 text-center",children:[e.jsxs("div",{className:"relative mx-auto w-16 h-16 mb-4",children:[e.jsx(v,{className:"w-16 h-16 text-blue-600 animate-spin"}),e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:e.jsx("div",{className:"w-8 h-8 bg-blue-600 rounded-full opacity-20 animate-pulse"})})]}),e.jsx("h4",{className:"text-lg font-semibold text-gray-900 dark:text-white mb-2",children:a==="transcript"?"Processing Video":`Creating ${a==="docx"?"Word document":"PDF document"}`}),e.jsxs("div",{className:"flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4",children:[e.jsx(j,{className:"w-4 h-4"}),e.jsxs("span",{children:[p,"s elapsed"]})]}),e.jsx("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:a==="transcript"?e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"• Fetching available captions"}),e.jsx("p",{children:"• Building timestamped transcript"}),e.jsx("p",{children:"• Preparing TXT and SRT downloads"})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"• Formatting the transcript"}),e.jsx("p",{children:"• Laying out pages and timestamps"}),e.jsx("p",{children:"• Your download starts automatically"})]})})]}),e.jsx("div",{className:"bg-gray-50 dark:bg-gray-800 px-6 py-3 text-center",children:e.jsxs("div",{className:"flex items-center justify-center space-x-4 text-xs text-gray-500",children:[e.jsx("span",{children:"🔒 Secure Processing"}),e.jsx("span",{children:"•"}),e.jsx("span",{children:"🌍 125+ Languages"})]})})]})}):null},P=({transcript:l,videoId:x})=>{const[a,p]=h.useState(""),d=h.useMemo(()=>(l||"").split(`
`),[l]),s=a.trim().toLowerCase(),o=s?d.filter(r=>r.toLowerCase().includes(s)):d,m=r=>{if(!s)return r;const c=[];let t=r,n=t.toLowerCase().indexOf(s),u=0;for(;n!==-1;)c.push(t.slice(0,n)),c.push(e.jsx("mark",{className:"bg-primary/40 text-inherit rounded px-0.5",children:t.slice(n,n+s.length)},u++)),t=t.slice(n+s.length),n=t.toLowerCase().indexOf(s);return c.push(t),c};return e.jsxs("div",{className:"glass p-4 sm:p-6 rounded-xl",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3 mb-4",children:[e.jsx("h4",{className:"text-lg font-semibold",children:"Transcript"}),e.jsxs("div",{className:"relative flex-1 min-w-[200px] max-w-xs ml-auto",children:[e.jsx(k,{className:"w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"}),e.jsx("input",{type:"text",value:a,onChange:r=>p(r.target.value),placeholder:"Search in transcript…",className:"input-modern w-full pl-9 pr-3 py-2 text-sm","aria-label":"Search in transcript"})]})]}),e.jsx("p",{className:"text-xs text-muted-foreground mb-3",children:s?`${o.length} matching line${o.length===1?"":"s"}`:"Tip: click a timestamp to jump to that moment on YouTube"}),e.jsx("div",{className:"bg-background/50 p-4 sm:p-6 rounded-lg min-h-[40vh] max-h-[75vh] overflow-y-auto",children:e.jsxs("div",{className:"text-[15px] leading-7 space-y-1.5 text-left",children:[o.length===0&&e.jsxs("p",{className:"text-muted-foreground",children:['No lines match "',a,'".']}),o.map((r,c)=>{const t=r.match(/^\[(\d+):(\d{2})\]\s?(.*)$/);if(!t)return e.jsx("div",{children:m(r)},c);const n=parseInt(t[1],10)*60+parseInt(t[2],10);return e.jsxs("div",{children:[e.jsxs("a",{href:`https://www.youtube.com/watch?v=${x}&t=${n}s`,target:"_blank",rel:"noopener noreferrer",className:"text-primary hover:underline font-mono text-sm",title:"Jump to this moment on YouTube",children:["[",t[1],":",t[2],"]"]})," ",m(t[3])]},c)})]})})]})};export{T as C,M as P,S as R,k as S,P as T,C as Y,L as a,j as b};
