(() => { const motionQuery=matchMedia('(prefers-reduced-motion: reduce)'); let paused=motionQuery.matches; const motionAllowed=()=>!motionQuery.matches&&!paused; const $=s=>document.querySelector(s);
function initWebGLHero() {
  const canvas = $("#media-webgl"),
    hero = $(".hero"),
    shell = $(".media-viewfinder");
  if (!canvas || !hero || !shell) return;
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "high-performance",
  });
  if (!gl) return;

  const vertexSource = `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;
  const fragmentSource = `
    precision highp float;
    #define TRAIL_COUNT 7
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    uniform vec2 uImageSize;
    uniform vec2 uTrail[TRAIL_COUNT];
    uniform vec2 uTrailVelocity[TRAIL_COUNT];
    uniform float uTrailLife[TRAIL_COUNT];
    uniform float uRadius;
    uniform float uTime;

    vec2 coverUv(vec2 uv) {
      vec2 ratio = vec2(
        min((uResolution.x / uResolution.y) / (uImageSize.x / uImageSize.y), 1.0),
        min((uResolution.y / uResolution.x) / (uImageSize.y / uImageSize.x), 1.0)
      );
      return uv * ratio + (1.0 - ratio) * 0.5;
    }
    float random(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    void main() {
      vec2 directionalOffset = vec2(0.0);
      vec2 refractOffset = vec2(0.0);
      float influence = 0.0;
      float velocityEnergy = 0.0;
      for (int i = 0; i < TRAIL_COUNT; i++) {
        vec2 deltaPx = (vUv - uTrail[i]) * uResolution;
        float distancePx = length(deltaPx);
        float field = 1.0 - smoothstep(uRadius * 0.22, uRadius, distancePx);
        float life = uTrailLife[i];
        float energy = field * field * life;
        vec2 velocity = uTrailVelocity[i];
        float speed = min(length(velocity), 2.6);
        directionalOffset += velocity * energy * 0.0038;
        vec2 radial = deltaPx / max(distancePx, 1.0);
        refractOffset += radial * sin(field * 3.14159) * life * 0.0018;
        influence = max(influence, field * life);
        velocityEnergy = max(velocityEnergy, speed * field * life);
      }
      vec2 displaced = coverUv(vUv + directionalOffset + refractOffset);
      vec2 chroma = normalize(directionalOffset + vec2(0.00001)) * min(velocityEnergy, 1.0) * 0.00125;
      float red = texture2D(uTexture, displaced + chroma).r;
      float green = texture2D(uTexture, displaced).g;
      float blue = texture2D(uTexture, displaced - chroma).b;
      vec3 color = vec3(red, green, blue);

      vec2 texel = 1.0 / uImageSize;
      vec3 glow = texture2D(uTexture, displaced + vec2(texel.x * 3.0, 0.0)).rgb;
      glow += texture2D(uTexture, displaced - vec2(texel.x * 3.0, 0.0)).rgb;
      glow += texture2D(uTexture, displaced + vec2(0.0, texel.y * 3.0)).rgb;
      glow += texture2D(uTexture, displaced - vec2(0.0, texel.y * 3.0)).rgb;
      glow *= 0.25;
      float brightness = max(glow.r, max(glow.g, glow.b));
      color += glow * smoothstep(0.72, 1.0, brightness) * 0.16;

      float grain = random(gl_FragCoord.xy + floor(uTime * 18.0)) - 0.5;
      color += grain * 0.018;
      vec2 centered = vUv - 0.5;
      float vignette = smoothstep(0.86, 0.22, dot(centered, centered) * 1.55);
      color *= mix(0.68, 1.0, vignette);
      color *= 0.94 + influence * 0.035;
      gl_FragColor = vec4(color, 1.0);
    }
  `;
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("Creovo hero shader unavailable", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return;
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    resolution: gl.getUniformLocation(program, "uResolution"),
    imageSize: gl.getUniformLocation(program, "uImageSize"),
    trail: gl.getUniformLocation(program, "uTrail[0]"),
    velocity: gl.getUniformLocation(program, "uTrailVelocity[0]"),
    life: gl.getUniformLocation(program, "uTrailLife[0]"),
    radius: gl.getUniformLocation(program, "uRadius"),
    time: gl.getUniformLocation(program, "uTime"),
  };
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  let width = 1,
    height = 1,
    pointerRadius = 180,
    imageWidth = 1,
    imageHeight = 1,
    ready = false,
    lastInput = { x: 0.5, y: 0.5, time: performance.now() },
    lastTrailTime = 0,
    shaderTime = 0,
    lastFrame = performance.now();
  const trail = Array.from({ length: 7 }, () => ({ x: 0.5, y: 0.5, vx: 0, vy: 0, born: -1000 }));
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = innerWidth < 700 ? 1 : Math.min(devicePixelRatio || 1, 1.5);
    width = Math.max(1, Math.round(rect.width * dpr));
    height = Math.max(1, Math.round(rect.height * dpr));
    pointerRadius = Math.max(140, Math.min(220, Math.min(rect.width, rect.height) * 0.28)) * dpr;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };
  const addInput = (x, y, now) => {
    const px = Math.max(0, Math.min(1, x + 0.5));
    const py = Math.max(0, Math.min(1, 0.5 - y));
    const elapsed = Math.max((now - lastInput.time) / 1000, 0.016);
    const vx = Math.max(-2.6, Math.min(2.6, (px - lastInput.x) / elapsed));
    const vy = Math.max(-2.6, Math.min(2.6, (py - lastInput.y) / elapsed));
    if (now - lastTrailTime > 48) {
      trail.pop();
      trail.unshift({ x: px, y: py, vx, vy, born: now });
      lastTrailTime = now;
    } else {
      Object.assign(trail[0], { x: px, y: py, vx, vy, born: now });
    }
    lastInput = { x: px, y: py, time: now };
  };
  hero.addEventListener("creovo-motion-input", (event) => {
    if (motionAllowed()) addInput(event.detail.x, event.detail.y, event.detail.time);
  });
  let visible=false, frame=0;
  const wake=()=>{if(!frame&&visible&&!document.hidden&&motionAllowed())frame=requestAnimationFrame(render);};
  const render = (now) => {
    frame=0;
    if(!visible||document.hidden||!motionAllowed())return;
    resize();
    if (ready) {
      const moving = motionAllowed();
      if (moving) shaderTime += Math.min((now - lastFrame) / 1000, 0.05);
      const positions = new Float32Array(14);
      const velocities = new Float32Array(14);
      const lives = new Float32Array(7);
      trail.forEach((point, index) => {
        const life = moving ? Math.max(0, 1 - (now - point.born) / 620) : 0;
        positions[index * 2] = point.x;
        positions[index * 2 + 1] = point.y;
        velocities[index * 2] = point.vx;
        velocities[index * 2 + 1] = point.vy;
        lives[index] = life * life * (3 - 2 * life);
      });
      gl.uniform2f(uniforms.resolution, width, height);
      gl.uniform2f(uniforms.imageSize, imageWidth, imageHeight);
      gl.uniform2fv(uniforms.trail, positions);
      gl.uniform2fv(uniforms.velocity, velocities);
      gl.uniform1fv(uniforms.life, lives);
      gl.uniform1f(uniforms.radius, pointerRadius);
      gl.uniform1f(uniforms.time, shaderTime);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      shell.classList.add("webgl-ready");
    }
    lastFrame = now;
    frame=requestAnimationFrame(render);
  };
  const image = new Image();
  image.addEventListener("load", () => {
    imageWidth = image.naturalWidth;
    imageHeight = image.naturalHeight;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    ready = true;

  });
  image.src = "/assets/creovo-reactive-hero.webp";
  new ResizeObserver(resize).observe(canvas);
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    shell.classList.remove("webgl-ready");
    ready = false;
  });
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;wake();}).observe(hero);
  document.addEventListener('visibilitychange',wake);
  document.addEventListener('creovo-motion',wake);
  motionQuery.addEventListener('change',wake);
}


const hero=$('.hero'),shell=$('.media-viewfinder'),button=$('#motion-toggle');
if(!hero)return;
button?.addEventListener('click',()=>{paused=!paused;document.body.classList.toggle('paused',paused);button.textContent=paused?button.dataset.resume:button.dataset.pause;button.setAttribute('aria-pressed',String(paused));document.dispatchEvent(new CustomEvent('creovo-motion',{detail:{paused}}));});
hero.addEventListener('pointermove',e=>{if(!motionAllowed()||!matchMedia('(pointer:fine)').matches)return;const r=shell.getBoundingClientRect();hero.dispatchEvent(new CustomEvent('creovo-motion-input',{detail:{x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5,time:performance.now()}}));},{passive:true});
const tilt=$('#tilt-control');
if(tilt&&'DeviceOrientationEvent' in window&&matchMedia('(pointer:coarse)').matches){tilt.hidden=false;tilt.addEventListener('click',async()=>{try{if(typeof DeviceOrientationEvent.requestPermission==='function'&&await DeviceOrientationEvent.requestPermission()!=='granted')throw Error();let origin=null;window.addEventListener('deviceorientation',e=>{if(e.beta===null||e.gamma===null||!motionAllowed())return;origin??={b:e.beta,g:e.gamma};hero.dispatchEvent(new CustomEvent('creovo-motion-input',{detail:{x:Math.max(-.5,Math.min(.5,(e.gamma-origin.g)/45)),y:Math.max(-.5,Math.min(.5,(e.beta-origin.b)/45)),time:performance.now()}}));},{passive:true});tilt.textContent=tilt.dataset.active;tilt.disabled=true;}catch{tilt.textContent=tilt.dataset.unavailable;}});}
initWebGLHero();})();