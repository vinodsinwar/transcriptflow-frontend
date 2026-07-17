import{c as s,r as i,j as e}from"./App-Bh8XKqqp.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]],x=s("clock",o);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],f=s("copy",p);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],b=s("file-text",h);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],u=s("loader-circle",m);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",key:"1q2vi4"}],["path",{d:"m10 15 5-3-5-3z",key:"1jp15x"}]],g=s("youtube",y),v=({isVisible:a,videoUrl:c,mode:t="transcript"})=>{const[l,n]=i.useState(0);return i.useEffect(()=>{let r;return a?(typeof dataLayer<"u"&&dataLayer.push({event:"processing_overlay_shown",video_url:c,timestamp:new Date().toISOString()}),r=setInterval(()=>{n(d=>d+1)},1e3)):n(0),()=>{r&&clearInterval(r)}},[a,c]),a?e.jsx("div",{className:"fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",children:e.jsxs("div",{className:"bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden",children:[e.jsxs("div",{className:"bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center",children:[e.jsxs("div",{className:"flex items-center justify-center space-x-2 mb-2",children:[e.jsx(g,{className:"w-6 h-6"}),e.jsx("h3",{className:"text-xl font-bold",children:"TranscriptFlow"})]}),e.jsx("p",{className:"text-blue-100",children:t==="transcript"?"Generating your transcript...":`Preparing your ${t.toUpperCase()} file...`})]}),e.jsxs("div",{className:"p-6 text-center",children:[e.jsxs("div",{className:"relative mx-auto w-16 h-16 mb-4",children:[e.jsx(u,{className:"w-16 h-16 text-blue-600 animate-spin"}),e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:e.jsx("div",{className:"w-8 h-8 bg-blue-600 rounded-full opacity-20 animate-pulse"})})]}),e.jsx("h4",{className:"text-lg font-semibold text-gray-900 dark:text-white mb-2",children:t==="transcript"?"Processing Video":`Creating ${t==="docx"?"Word document":"PDF document"}`}),e.jsxs("div",{className:"flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4",children:[e.jsx(x,{className:"w-4 h-4"}),e.jsxs("span",{children:[l,"s elapsed"]})]}),e.jsx("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:t==="transcript"?e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"• Fetching available captions"}),e.jsx("p",{children:"• Building timestamped transcript"}),e.jsx("p",{children:"• Preparing TXT and SRT downloads"})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"• Formatting the transcript"}),e.jsx("p",{children:"• Laying out pages and timestamps"}),e.jsx("p",{children:"• Your download starts automatically"})]})})]}),e.jsx("div",{className:"bg-gray-50 dark:bg-gray-800 px-6 py-3 text-center",children:e.jsxs("div",{className:"flex items-center justify-center space-x-4 text-xs text-gray-500",children:[e.jsx("span",{children:"🔒 Secure Processing"}),e.jsx("span",{children:"•"}),e.jsx("span",{children:"🌍 125+ Languages"})]})})]})}):null};export{x as C,b as F,v as P,g as Y,f as a};
