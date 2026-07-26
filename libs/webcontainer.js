/**
 * Minified by jsDelivr using Terser v5.48.0.
 * Original file: /npm/@webcontainer/api@1.6.4/dist/connect.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
export function setupConnect(e={}){const t=new URL(window.location.href);if(!t.pathname.startsWith("/webcontainer/connect/"))throw new Error(`This function must be used on a '/webcontainer/connect' endpoint. Used in ${t.pathname}`);if(!window.opener)throw new Error("This page must have an opener. You must serve it with appropriate headers");const n=new URL(e.editorOrigin??"https://stackblitz.com");n.pathname=t.pathname;const o=document.createElement("iframe");o.style.display="none",window.addEventListener("message",e=>{if("close"===e.data)return void window.close();const t=findMessagePorts(e.data);e.source===window.opener?o.contentWindow.postMessage(e.data,"*",t):window.opener.postMessage(e.data,"*",t)}),o.src=n.toString(),document.body.appendChild(o)}const EMPTY_ARRAY=[];function findMessagePorts(e){if(!e||"object"!=typeof e)return EMPTY_ARRAY;const t=[];for(const n in e){const o=e[n];"[object MessagePort]"!==Object.prototype.toString.call(o)?t.push(...findMessagePorts(o)):t.push(o)}return t}
//# sourceMappingURL=/sm/49d9a4df4ae54459289ea60bf8f172ae21939e7230986c17d2f2ea09fb740fa5.map
