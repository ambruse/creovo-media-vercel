import { readFile,writeFile } from 'node:fs/promises';
const old=await readFile('public/app.js','utf8');
const core=old.slice(old.indexOf('function initWebGLHero()'),old.indexOf('function initViewfinder()'))
 .replace('    shell.classList.add("webgl-ready");','')
 .replace('      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);','      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);\n      shell.classList.add("webgl-ready");')
 .replace('  const render = (now) => {','  let visible=false, frame=0;\n  const wake=()=>{if(!frame&&visible&&!document.hidden&&motionAllowed())frame=requestAnimationFrame(render);};\n  const render = (now) => {\n    frame=0;\n    if(!visible||document.hidden||!motionAllowed())return;')
 .replaceAll('requestAnimationFrame(render);','frame=requestAnimationFrame(render);')
 .replace('frame=frame=requestAnimationFrame(render);','frame=requestAnimationFrame(render);')
 .replace('  frame=requestAnimationFrame(render);\n}',`  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;wake();}).observe(hero);
  document.addEventListener('visibilitychange',wake);
  document.addEventListener('creovo-motion',wake);
  motionQuery.addEventListener('change',wake);
}`);
const pre=`(() => { const motionQuery=matchMedia('(prefers-reduced-motion: reduce)'); let paused=motionQuery.matches; const motionAllowed=()=>!motionQuery.matches&&!paused; const $=s=>document.querySelector(s);\n`;
const controls=`
const hero=$('.hero'),shell=$('.media-viewfinder'),button=$('#motion-toggle');
if(!hero)return;
button?.addEventListener('click',()=>{paused=!paused;document.body.classList.toggle('paused',paused);button.textContent=paused?button.dataset.resume:button.dataset.pause;button.setAttribute('aria-pressed',String(paused));document.dispatchEvent(new CustomEvent('creovo-motion',{detail:{paused}}));});
hero.addEventListener('pointermove',e=>{if(!motionAllowed()||!matchMedia('(pointer:fine)').matches)return;const r=shell.getBoundingClientRect();hero.dispatchEvent(new CustomEvent('creovo-motion-input',{detail:{x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5,time:performance.now()}}));},{passive:true});
const tilt=$('#tilt-control');
if(tilt&&'DeviceOrientationEvent' in window&&matchMedia('(pointer:coarse)').matches){tilt.hidden=false;tilt.addEventListener('click',async()=>{try{if(typeof DeviceOrientationEvent.requestPermission==='function'&&await DeviceOrientationEvent.requestPermission()!=='granted')throw Error();let origin=null;window.addEventListener('deviceorientation',e=>{if(e.beta===null||e.gamma===null||!motionAllowed())return;origin??={b:e.beta,g:e.gamma};hero.dispatchEvent(new CustomEvent('creovo-motion-input',{detail:{x:Math.max(-.5,Math.min(.5,(e.gamma-origin.g)/45)),y:Math.max(-.5,Math.min(.5,(e.beta-origin.b)/45)),time:performance.now()}}));},{passive:true});tilt.textContent=tilt.dataset.active;tilt.disabled=true;}catch{tilt.textContent=tilt.dataset.unavailable;}});}
initWebGLHero();})();`;
await writeFile('public/hero.js',pre+core.replace('image.src = "assets/creovo-reactive-hero.png"','image.src = "/assets/creovo-reactive-hero.webp"')+controls);
