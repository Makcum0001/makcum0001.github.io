import{r as A,_ as v,C as S,a as k,E as Y,o as Ce,F as J,g as Ee,b as y,d as ke,i as X,c as Q,e as Z,v as ee,L as Re,f as B}from"./index-C8JhwY2K.js";const te="@firebase/installations",N="0.6.19";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ne=1e4,ae=`w:${N}`,ie="FIS_v2",Pe="https://firebaseinstallations.googleapis.com/v1",_e=3600*1e3,De="installations",Fe="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $e={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},w=new Y(De,Fe,$e);function re(e){return e instanceof J&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function se({projectId:e}){return`${Pe}/projects/${e}/installations`}function oe(e){return{token:e.token,requestStatus:2,expiresIn:Me(e.expiresIn),creationTime:Date.now()}}async function ce(e,t){const a=(await t.json()).error;return w.create("request-failed",{requestName:e,serverCode:a.code,serverMessage:a.message,serverStatus:a.status})}function le({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function Oe(e,{refreshToken:t}){const n=le(e);return n.append("Authorization",Ne(t)),n}async function ue(e){const t=await e();return t.status>=500&&t.status<600?e():t}function Me(e){return Number(e.replace("s","000"))}function Ne(e){return`${ie} ${e}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Le({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const a=se(e),i=le(e),r=t.getImmediate({optional:!0});if(r){const l=await r.getHeartbeatsHeader();l&&i.append("x-firebase-client",l)}const o={fid:n,authVersion:ie,appId:e.appId,sdkVersion:ae},s={method:"POST",headers:i,body:JSON.stringify(o)},c=await ue(()=>fetch(a,s));if(c.ok){const l=await c.json();return{fid:l.fid||n,registrationStatus:2,refreshToken:l.refreshToken,authToken:oe(l.authToken)}}else throw await ce("Create Installation",c)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function de(e){return new Promise(t=>{setTimeout(t,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xe(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qe=/^[cdef][\w-]{21}$/,F="";function je(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const n=Be(e);return qe.test(n)?n:F}catch{return F}}function Be(e){return xe(e).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function R(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fe=new Map;function pe(e,t){const n=R(e);ge(n,t),Ue(n,t)}function ge(e,t){const n=fe.get(e);if(n)for(const a of n)a(t)}function Ue(e,t){const n=Ve();n&&n.postMessage({key:e,fid:t}),Ge()}let m=null;function Ve(){return!m&&"BroadcastChannel"in self&&(m=new BroadcastChannel("[Firebase] FID Change"),m.onmessage=e=>{ge(e.data.key,e.data.fid)}),m}function Ge(){fe.size===0&&m&&(m.close(),m=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ze="firebase-installations-database",He=1,I="firebase-installations-store";let _=null;function L(){return _||(_=Ce(ze,He,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(I)}}})),_}async function C(e,t){const n=R(e),i=(await L()).transaction(I,"readwrite"),r=i.objectStore(I),o=await r.get(n);return await r.put(t,n),await i.done,(!o||o.fid!==t.fid)&&pe(e,t.fid),t}async function he(e){const t=R(e),a=(await L()).transaction(I,"readwrite");await a.objectStore(I).delete(t),await a.done}async function P(e,t){const n=R(e),i=(await L()).transaction(I,"readwrite"),r=i.objectStore(I),o=await r.get(n),s=t(o);return s===void 0?await r.delete(n):await r.put(s,n),await i.done,s&&(!o||o.fid!==s.fid)&&pe(e,s.fid),s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function x(e){let t;const n=await P(e.appConfig,a=>{const i=Ke(a),r=We(e,i);return t=r.registrationPromise,r.installationEntry});return n.fid===F?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function Ke(e){const t=e||{fid:je(),registrationStatus:0};return me(t)}function We(e,t){if(t.registrationStatus===0){if(!navigator.onLine){const i=Promise.reject(w.create("app-offline"));return{installationEntry:t,registrationPromise:i}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},a=Ye(e,n);return{installationEntry:n,registrationPromise:a}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:Je(e)}:{installationEntry:t}}async function Ye(e,t){try{const n=await Le(e,t);return C(e.appConfig,n)}catch(n){throw re(n)&&n.customData.serverCode===409?await he(e.appConfig):await C(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function Je(e){let t=await U(e.appConfig);for(;t.registrationStatus===1;)await de(100),t=await U(e.appConfig);if(t.registrationStatus===0){const{installationEntry:n,registrationPromise:a}=await x(e);return a||n}return t}function U(e){return P(e,t=>{if(!t)throw w.create("installation-not-found");return me(t)})}function me(e){return Xe(e)?{fid:e.fid,registrationStatus:0}:e}function Xe(e){return e.registrationStatus===1&&e.registrationTime+ne<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qe({appConfig:e,heartbeatServiceProvider:t},n){const a=Ze(e,n),i=Oe(e,n),r=t.getImmediate({optional:!0});if(r){const l=await r.getHeartbeatsHeader();l&&i.append("x-firebase-client",l)}const o={installation:{sdkVersion:ae,appId:e.appId}},s={method:"POST",headers:i,body:JSON.stringify(o)},c=await ue(()=>fetch(a,s));if(c.ok){const l=await c.json();return oe(l)}else throw await ce("Generate Auth Token",c)}function Ze(e,{fid:t}){return`${se(e)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function q(e,t=!1){let n;const a=await P(e.appConfig,r=>{if(!we(r))throw w.create("not-registered");const o=r.authToken;if(!t&&nt(o))return r;if(o.requestStatus===1)return n=et(e,t),r;{if(!navigator.onLine)throw w.create("app-offline");const s=it(r);return n=tt(e,s),s}});return n?await n:a.authToken}async function et(e,t){let n=await V(e.appConfig);for(;n.authToken.requestStatus===1;)await de(100),n=await V(e.appConfig);const a=n.authToken;return a.requestStatus===0?q(e,t):a}function V(e){return P(e,t=>{if(!we(t))throw w.create("not-registered");const n=t.authToken;return rt(n)?{...t,authToken:{requestStatus:0}}:t})}async function tt(e,t){try{const n=await Qe(e,t),a={...t,authToken:n};return await C(e.appConfig,a),n}catch(n){if(re(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await he(e.appConfig);else{const a={...t,authToken:{requestStatus:0}};await C(e.appConfig,a)}throw n}}function we(e){return e!==void 0&&e.registrationStatus===2}function nt(e){return e.requestStatus===2&&!at(e)}function at(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+_e}function it(e){const t={requestStatus:1,requestTime:Date.now()};return{...e,authToken:t}}function rt(e){return e.requestStatus===1&&e.requestTime+ne<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function st(e){const t=e,{installationEntry:n,registrationPromise:a}=await x(t);return a?a.catch(console.error):q(t).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ot(e,t=!1){const n=e;return await ct(n),(await q(n,t)).token}async function ct(e){const{registrationPromise:t}=await x(e);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lt(e){if(!e||!e.options)throw D("App Configuration");if(!e.name)throw D("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw D(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function D(e){return w.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ie="installations",ut="installations-internal",dt=e=>{const t=e.getProvider("app").getImmediate(),n=lt(t),a=k(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:a,_delete:()=>Promise.resolve()}},ft=e=>{const t=e.getProvider("app").getImmediate(),n=k(t,Ie).getImmediate();return{getId:()=>st(n),getToken:i=>ot(n,i)}};function pt(){v(new S(Ie,dt,"PUBLIC")),v(new S(ut,ft,"PRIVATE"))}pt();A(te,N);A(te,N,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const E="analytics",gt="firebase_id",ht="origin",mt=60*1e3,wt="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",j="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const u=new Re("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const It={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},d=new Y("analytics","Analytics",It);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yt(e){if(!e.startsWith(j)){const t=d.create("invalid-gtag-resource",{gtagURL:e});return u.warn(t.message),""}return e}function ye(e){return Promise.all(e.map(t=>t.catch(n=>n)))}function bt(e,t){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(e,t)),n}function Tt(e,t){const n=bt("firebase-js-sdk-policy",{createScriptURL:yt}),a=document.createElement("script"),i=`${j}?l=${e}&id=${t}`;a.src=n?n?.createScriptURL(i):i,a.async=!0,document.head.appendChild(a)}function At(e){let t=[];return Array.isArray(window[e])?t=window[e]:window[e]=t,t}async function vt(e,t,n,a,i,r){const o=a[i];try{if(o)await t[o];else{const c=(await ye(n)).find(l=>l.measurementId===i);c&&await t[c.appId]}}catch(s){u.error(s)}e("config",i,r)}async function St(e,t,n,a,i){try{let r=[];if(i&&i.send_to){let o=i.send_to;Array.isArray(o)||(o=[o]);const s=await ye(n);for(const c of o){const l=s.find(b=>b.measurementId===c),f=l&&t[l.appId];if(f)r.push(f);else{r=[];break}}}r.length===0&&(r=Object.values(t)),await Promise.all(r),e("event",a,i||{})}catch(r){u.error(r)}}function Ct(e,t,n,a){async function i(r,...o){try{if(r==="event"){const[s,c]=o;await St(e,t,n,s,c)}else if(r==="config"){const[s,c]=o;await vt(e,t,n,a,s,c)}else if(r==="consent"){const[s,c]=o;e("consent",s,c)}else if(r==="get"){const[s,c,l]=o;e("get",s,c,l)}else if(r==="set"){const[s]=o;e("set",s)}else e(r,...o)}catch(s){u.error(s)}}return i}function Et(e,t,n,a,i){let r=function(...o){window[a].push(arguments)};return window[i]&&typeof window[i]=="function"&&(r=window[i]),window[i]=Ct(r,e,t,n),{gtagCore:r,wrappedGtag:window[i]}}function kt(e){const t=window.document.getElementsByTagName("script");for(const n of Object.values(t))if(n.src&&n.src.includes(j)&&n.src.includes(e))return n;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rt=30,Pt=1e3;class _t{constructor(t={},n=Pt){this.throttleMetadata=t,this.intervalMillis=n}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,n){this.throttleMetadata[t]=n}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const be=new _t;function Dt(e){return new Headers({Accept:"application/json","x-goog-api-key":e})}async function Ft(e){const{appId:t,apiKey:n}=e,a={method:"GET",headers:Dt(n)},i=wt.replace("{app-id}",t),r=await fetch(i,a);if(r.status!==200&&r.status!==304){let o="";try{const s=await r.json();s.error?.message&&(o=s.error.message)}catch{}throw d.create("config-fetch-failed",{httpStatus:r.status,responseMessage:o})}return r.json()}async function $t(e,t=be,n){const{appId:a,apiKey:i,measurementId:r}=e.options;if(!a)throw d.create("no-app-id");if(!i){if(r)return{measurementId:r,appId:a};throw d.create("no-api-key")}const o=t.getThrottleMetadata(a)||{backoffCount:0,throttleEndTimeMillis:Date.now()},s=new Nt;return setTimeout(async()=>{s.abort()},mt),Te({appId:a,apiKey:i,measurementId:r},o,s,t)}async function Te(e,{throttleEndTimeMillis:t,backoffCount:n},a,i=be){const{appId:r,measurementId:o}=e;try{await Ot(a,t)}catch(s){if(o)return u.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${s?.message}]`),{appId:r,measurementId:o};throw s}try{const s=await Ft(e);return i.deleteThrottleMetadata(r),s}catch(s){const c=s;if(!Mt(c)){if(i.deleteThrottleMetadata(r),o)return u.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${c?.message}]`),{appId:r,measurementId:o};throw s}const l=Number(c?.customData?.httpStatus)===503?B(n,i.intervalMillis,Rt):B(n,i.intervalMillis),f={throttleEndTimeMillis:Date.now()+l,backoffCount:n+1};return i.setThrottleMetadata(r,f),u.debug(`Calling attemptFetch again in ${l} millis`),Te(e,f,a,i)}}function Ot(e,t){return new Promise((n,a)=>{const i=Math.max(t-Date.now(),0),r=setTimeout(n,i);e.addEventListener(()=>{clearTimeout(r),a(d.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function Mt(e){if(!(e instanceof J)||!e.customData)return!1;const t=Number(e.customData.httpStatus);return t===429||t===500||t===503||t===504}class Nt{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $;async function Lt(e,t,n,a,i){if(i&&i.global){e("event",n,a);return}else{const r=await t,o={...a,send_to:r};e("event",n,o)}}async function xt(e,t,n,a){if(a&&a.global)return e("set",{screen_name:n}),Promise.resolve();{const i=await t;e("config",i,{update:!0,screen_name:n})}}async function qt(e,t,n,a){if(a&&a.global)return e("set",{user_id:n}),Promise.resolve();{const i=await t;e("config",i,{update:!0,user_id:n})}}async function jt(e,t,n,a){if(a&&a.global){const i={};for(const r of Object.keys(n))i[`user_properties.${r}`]=n[r];return e("set",i),Promise.resolve()}else{const i=await t;e("config",i,{update:!0,user_properties:n})}}async function Bt(e,t){const n=await t;return new Promise((a,i)=>{e("get",n,"client_id",r=>{r||i(d.create("no-client-id")),a(r)})})}async function Ut(e,t){const n=await e;window[`ga-disable-${n}`]=!t}let O;function Ae(e){O=e}function ve(e){$=e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vt(){if(Z())try{await ee()}catch(e){return u.warn(d.create("indexeddb-unavailable",{errorInfo:e?.toString()}).message),!1}else return u.warn(d.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function Gt(e,t,n,a,i,r,o){const s=$t(e);s.then(h=>{n[h.measurementId]=h.appId,e.options.measurementId&&h.measurementId!==e.options.measurementId&&u.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${h.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(h=>u.error(h)),t.push(s);const c=Vt().then(h=>{if(h)return a.getId()}),[l,f]=await Promise.all([s,c]);kt(r)||Tt(r,l.measurementId),O&&(i("consent","default",O),Ae(void 0)),i("js",new Date);const b=o?.config??{};return b[ht]="firebase",b.update=!0,f!=null&&(b[gt]=f),i("config",l.measurementId,b),$&&(i("set",$),ve(void 0)),l.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(t){this.app=t}_delete(){return delete p[this.app.options.appId],Promise.resolve()}}let p={},G=[];const z={};let T="dataLayer",Se="gtag",H,g,M=!1;function Qt(e){if(M)throw d.create("already-initialized");e.dataLayerName&&(T=e.dataLayerName),e.gtagName&&(Se=e.gtagName)}function Ht(){const e=[];if(X()&&e.push("This is a browser extension environment."),Q()||e.push("Cookies are not available."),e.length>0){const t=e.map((a,i)=>`(${i+1}) ${a}`).join(" "),n=d.create("invalid-analytics-context",{errorInfo:t});u.warn(n.message)}}function Kt(e,t,n){Ht();const a=e.options.appId;if(!a)throw d.create("no-app-id");if(!e.options.apiKey)if(e.options.measurementId)u.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw d.create("no-api-key");if(p[a]!=null)throw d.create("already-exists",{id:a});if(!M){At(T);const{wrappedGtag:r,gtagCore:o}=Et(p,G,z,T,Se);g=r,H=o,M=!0}return p[a]=Gt(e,G,z,t,H,T,n),new zt(e)}function Zt(e=Ee()){e=y(e);const t=k(e,E);return t.isInitialized()?t.getImmediate():Wt(e)}function Wt(e,t={}){const n=k(e,E);if(n.isInitialized()){const i=n.getImmediate();if(ke(t,n.getOptions()))return i;throw d.create("already-initialized")}return n.initialize({options:t})}async function en(){if(X()||!Q()||!Z())return!1;try{return await ee()}catch{return!1}}function tn(e,t,n){e=y(e),xt(g,p[e.app.options.appId],t,n).catch(a=>u.error(a))}async function nn(e){return e=y(e),Bt(g,p[e.app.options.appId])}function an(e,t,n){e=y(e),qt(g,p[e.app.options.appId],t,n).catch(a=>u.error(a))}function rn(e,t,n){e=y(e),jt(g,p[e.app.options.appId],t,n).catch(a=>u.error(a))}function sn(e,t){e=y(e),Ut(p[e.app.options.appId],t).catch(n=>u.error(n))}function on(e){g?g("set",e):ve(e)}function Yt(e,t,n,a){e=y(e),Lt(g,p[e.app.options.appId],t,n,a).catch(i=>u.error(i))}function cn(e){g?g("consent","update",e):Ae(e)}const K="@firebase/analytics",W="0.10.18";function Jt(){v(new S(E,(t,{options:n})=>{const a=t.getProvider("app").getImmediate(),i=t.getProvider("installations-internal").getImmediate();return Kt(a,i,n)},"PUBLIC")),v(new S("analytics-internal",e,"PRIVATE")),A(K,W),A(K,W,"esm2020");function e(t){try{const n=t.getProvider(E).getImmediate();return{logEvent:(a,i,r)=>Yt(n,a,i,r)}}catch(n){throw d.create("interop-component-reg-failed",{reason:n})}}}Jt();export{Zt as getAnalytics,nn as getGoogleAnalyticsClientId,Wt as initializeAnalytics,en as isSupported,Yt as logEvent,sn as setAnalyticsCollectionEnabled,cn as setConsent,tn as setCurrentScreen,on as setDefaultEventParameters,an as setUserId,rn as setUserProperties,Qt as settings};
