(()=>{"use strict";var e,t={"./examples/api__antialiasing.js":(e,t,n)=>{var o=n("./node_modules/three/build/three.module.js"),r=n("./node_modules/three/examples/jsm/webxr/VRButton.js"),i=n("./node_modules/three/examples/jsm/controls/OrbitControls.js"),a=n("./node_modules/three/examples/jsm/geometries/BoxLineGeometry.js"),s=n("./src/three-mesh-ui.js"),d=n("./examples/assets/fonts/msdf/roboto/regular.json");const l=n.p+"5a41f46a5020bc8f41ff554d0d890ad3.png",u=window.innerWidth,c=window.innerHeight;let p,h,m,f,w=!0;function g(e,t,n,r,i){const a=`\n  fontSupersampling: ${i}\n\n  Three-mesh-ui uses rotated-grid-super-sampling (RGSS) to smooth out the rendering of small characters on low res displays.\n\n  This is especially important in VR. However you can improve performance slightly by disabling it, especially if you only render big texts.`,u=new s.ZP.Block({width:1,height:.9,padding:.05,borderRadius:.05,justifyContent:"center",alignItems:"start",fontFamily:d,fontTexture:l,fontColor:new o.Ilk(16777215),backgroundOpacity:1,backgroundColor:new o.Ilk(0),fontSupersampling:i});return p.add(u),u.position.set(e,1.5,-4),u.rotation.set(t,n,r),u.add(new s.ZP.Text({content:a,fontKerning:"normal",fontSize:.045})),u}function b(){s.ZP.update(),w&&f.target.set(.3*Math.sin(Date.now()/3e3),.3*Math.cos(Date.now()/3e3)+1.5,-4),f.update(),m.render(p,h)}window.addEventListener("load",(function(){p=new o.xsS,p.background=new o.Ilk(5263440),h=new o.cPb(60,u/c,.1,500),h.position.set(0,1.5,0),m=new o.CP7({antialias:!0}),m.setPixelRatio(window.devicePixelRatio),m.setSize(u,c),m.xr.enabled=!0,document.body.appendChild(r.N.createButton(m)),document.body.appendChild(m.domElement),f=new i.z(h,m.domElement),f.addEventListener("start",(()=>w=!1));const e=new o.ejS(new a.d(6,6,12,10,10,20).translate(0,3,0),new o.nls({color:8421504}));p.add(e),g(.6,0,0,0,!0),g(-.6,0,0,0,!1),m.setAnimationLoop(b)})),window.addEventListener("resize",(function(){h.aspect=window.innerWidth/window.innerHeight,h.updateProjectionMatrix(),m.setSize(window.innerWidth,window.innerHeight)}))}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var i=n[e]={exports:{}};return t[e](i,i.exports,o),i.exports}o.m=t,e=[],o.O=(t,n,r,i)=>{if(!n){var a=1/0;for(u=0;u<e.length;u++){for(var[n,r,i]=e[u],s=!0,d=0;d<n.length;d++)(!1&i||a>=i)&&Object.keys(o.O).every((e=>o.O[e](n[d])))?n.splice(d--,1):(s=!1,i<a&&(a=i));if(s){e.splice(u--,1);var l=r();void 0!==l&&(t=l)}}return t}i=i||0;for(var u=e.length;u>0&&e[u-1][2]>i;u--)e[u]=e[u-1];e[u]=[n,r,i]},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.j="api__antialiasing",(()=>{var e;o.g.importScripts&&(e=o.g.location+"");var t=o.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=e})(),(()=>{var e={api__antialiasing:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var r,i,[a,s,d]=n,l=0;if(a.some((t=>0!==e[t]))){for(r in s)o.o(s,r)&&(o.m[r]=s[r]);if(d)var u=d(o)}for(t&&t(n);l<a.length;l++)i=a[l],o.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return o.O(u)},n=self.webpackChunkthree_mesh_ui=self.webpackChunkthree_mesh_ui||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var r=o.O(void 0,["chunk_imported-assets","chunk_three-mesh-ui","chunk_vendors"],(()=>o("./examples/api__antialiasing.js")));r=o.O(r)})();