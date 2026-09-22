/* CREOVO MEDIA — dependency-free interaction modules. */
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
let paused = false;
const motionAllowed = () => !motionQuery.matches && !paused;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
function initReveals() {
  if (motionQuery.matches || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("motion-ready");
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }),
    { threshold: 0.07 },
  );
  $$(".reveal").forEach((el) => observer.observe(el));
  const counters = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target,
          target = Number(el.dataset.count),
          start = performance.now();
        const tick = (now) => {
          const progress = motionAllowed()
            ? Math.min((now - start) / 1300, 1)
            : 1;
          el.textContent = (target * (1 - Math.pow(1 - progress, 3))).toFixed(
            Number(el.dataset.decimals || 0),
          );
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counters.unobserve(el);
      }),
    { threshold: 0.5 },
  );
  $$("[data-count]").forEach((el) => counters.observe(el));
}
function initNavigation() {
  let queued = false;
  const navShell = $(".nav-shell"),
    heroTitle = $(".hero-title");
  const update = () => {
    queued = false;
    navShell.classList.toggle("scrolled", scrollY > 50);
    navShell.classList.toggle(
      "logo-visible",
      heroTitle.getBoundingClientRect().bottom <= 120,
    );
    const height = document.documentElement.scrollHeight - innerHeight;
    $(".reading-progress").style.transform =
      `scaleX(${height > 0 ? scrollY / height : 0})`;
    if (motionAllowed()) {
      const rect = $(".signal-break").getBoundingClientRect();
      $(".signal-break").style.setProperty(
        "--shift",
        `${Math.max(-90, Math.min(90, (innerHeight / 2 - rect.top) * 0.09))}px`,
      );
    }
  };
  addEventListener(
    "scroll",
    () => {
      if (!queued) {
        requestAnimationFrame(update);
        queued = true;
      }
    },
    { passive: true },
  );
  update();
  const menu = $("#mobile-menu"),
    toggle = $("#menu-toggle");
  toggle.addEventListener("click", () => {
    menu.showModal();
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  });
  $(".menu-close", menu).addEventListener("click", () => menu.close());
  menu.addEventListener("close", () => {
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
  $$("a", menu).forEach((link) =>
    link.addEventListener("click", () => menu.close()),
  );
  $$(".capability-index details").forEach((item) =>
    item.addEventListener("toggle", () => {
      if (item.open)
        $$(".capability-index details").forEach((other) => {
          if (other !== item) other.open = false;
        });
    }),
  );
}
function initPointer() {
  if (!matchMedia("(pointer:fine)").matches) return;
  $$(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (event) => {
      if (!motionAllowed()) return;
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(event.clientX - r.left - r.width / 2) * 0.12}px,${(event.clientY - r.top - r.height / 2) * 0.12}px)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });
  const cursor = $(".cursor-label");
  $$(".project-image").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      if (!motionAllowed()) return;
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursor.classList.add("active");
    });
    el.addEventListener("pointerleave", () =>
      cursor.classList.remove("active"),
    );
    el.addEventListener("click", () => cursor.classList.remove("active"));
  });
}
const projects = [
  {
    title: "Own your own lane.",
    label: "OFFBEAT / FASHION / 2026",
    body: [
      "A streetwear launch told through the people shaping the scene. Six distinctive perspectives, one shared invitation: make the look your own.",
      "The concept connects social-first outfit films, community styling challenges and shoppable editorial. Strategy, casting and production work as one continuous story.",
    ],
    result: "24.8M views · 8.2% engagement",
    service: "Social Media",
  },
  {
    title: "No filter. All feeling.",
    label: "STUDIO FORM / BEAUTY / 2026",
    body: [
      "A beauty story built around personal expression. Intimate portraits meet honest product routines, making confidence the central idea.",
      "A single creative platform carries through art direction, films and performance-ready social edits.",
    ],
    result: "12.4M views · 4.6× ROAS",
    service: "Branding",
  },
  {
    title: "Built for every screen.",
    label: "CREOVO / VIDEO CAMPAIGN / 2026",
    body: [
      "A brand launch designed as a complete visual system. One focused production creates a hero film, product stories and vertical social edits for every stage of the campaign.",
      "The concept connects planning, filming and post-production so every asset feels consistent while fitting the channel where it appears.",
    ],
    result: "18.6M views · 120K shares",
    service: "Video Production",
  },
];
const insights = [
  {
    title: "Attention is borrowed. Relevance is earned.",
    label: "CREOVO NOTES / CULTURE",
    body: [
      "A feed can deliver an impression. It cannot manufacture a reason to care. That difference should shape a brand’s first question: what are we contributing to the conversation?",
      "Start with a community, not a demographic. Learn its references, rituals and tensions. The strongest cultural ideas tend to begin with a specific observation rather than a broad claim about what everyone wants.",
      "Strong content interprets that context. Give each idea a clear intention, a useful format and room to feel native to the channel where people discover it.",
      "Measure what happened beyond the first view. Saves, considered responses, repeat visits and useful conversations can help explain whether the idea resonated. Choose the measures around the actual objective, not the other way around.",
      "Relevance is not a permanent position. It is a practice: observe, contribute, listen, evolve.",
    ],
  },
  {
    title: "Consistency turns content into a system.",
    label: "CREOVO NOTES / CONTENT",
    body: [
      "A strong content system gives every post, campaign and page a shared direction without making everything look identical.",
      "Start with a small set of themes connected to the brand strategy, then define the formats each channel needs.",
      "Plan production in batches so one clear idea can become video, imagery, design and copy without losing its purpose.",
      "Use publishing results to refine the next cycle. Repetition should build recognition while new angles keep the work useful.",
      "Consistency is the result of clear choices, a practical workflow and careful creative review.",
    ],
  },
  {
    title: "The interface is part of the story.",
    label: "CREOVO NOTES / DESIGN",
    body: [
      "A brand does not stop at its visual identity. It continues in the way a menu opens, a form responds and a page makes room for someone to think.",
      "Motion can create hierarchy. A slower reveal asks for attention; a quick response reassures someone that their action worked. Neither needs to become a performance.",
      "The most memorable interaction is often the one that makes an unfamiliar idea easy to understand. Make the next step clear, then use rhythm, type and imagery to give it character.",
      "Good digital craft includes the moments people rarely notice: readable text, keyboard access, a thoughtful mobile composition and a quieter experience for people who prefer less motion. Those details are the story too.",
    ],
  },
];
let audience = "Brand";
function setAudience(value) {
  audience = value;
  $$("[data-type]").forEach((el) =>
    el.setAttribute("aria-pressed", String(el.dataset.type === value)),
  );
}
function openEnquiry(trigger) {
  const detail = $("#content-dialog");
  if (detail.open) detail.close();
  setAudience(trigger?.dataset.audience || "Brand");
  if (trigger?.dataset.service) $("select").value = trigger.dataset.service;
  $("#enquiry-dialog").showModal();
}
function initDialogs() {
  const dialog = $("#content-dialog");
  function show(item, isProject) {
    $("#dialog-label").textContent = item.label;
    $("#dialog-title").textContent = item.title;
    $("#dialog-body").replaceChildren();
    item.body.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      $("#dialog-body").append(p);
    });
    if (isProject) {
      const p = document.createElement("p");
      p.className = "dialog-result";
      p.textContent = item.result;
      $("#dialog-body").append(p);
      const note = document.createElement("p");
      note.className = "sample-note";
      note.textContent =
        "Concept campaign. Results are illustrative, not verified client outcomes.";
      $("#dialog-body").append(note);
    }
    const cta = $("[data-enquiry]", dialog);
    cta.dataset.service = item.service || "Brand Strategy";
    dialog.showModal();
  }
  $$("[data-project]").forEach((el) =>
    el.addEventListener("click", () =>
      show(projects[el.dataset.project], true),
    ),
  );
  $$("[data-insight]").forEach((el) =>
    el.addEventListener("click", () =>
      show(insights[el.dataset.insight], false),
    ),
  );
  $$(".dialog-close").forEach((el) =>
    el.addEventListener("click", () => el.closest("dialog").close()),
  );
  $$("dialog:not(#mobile-menu)").forEach((el) =>
    el.addEventListener("click", (e) => {
      if (e.target !== el) return;
      const r = el.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        el.close();
    }),
  );
  $$("[data-enquiry],[data-service],[data-audience]").forEach((el) =>
    el.addEventListener("click", (event) => {
      event.preventDefault();
      openEnquiry(el);
    }),
  );
  $$("[data-type]").forEach((el) =>
    el.addEventListener("click", () => {
      setAudience(el.dataset.type);
      if (el.dataset.type === "Brand") $("select").value = "Brand Strategy";
    }),
  );
  $("#lead-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = $(".submit", form);
    const status = $("#form-status");
    const data = new FormData(form);
    data.append("enquiry_type", audience);
    data.append("_subject", `New Creovo Media ${audience} enquiry`);
    data.append("source_page", location.href);
    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    status.textContent = "Sending your enquiry…";
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      setAudience("Brand");
      status.textContent =
        "Thank you — your enquiry has been sent. Our team will contact you shortly.";
    } catch {
      status.textContent =
        "We couldn't send your enquiry. Please check your connection and try again.";
    } finally {
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
    }
  });
}
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
  const render = (now) => {
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
    }
    lastFrame = now;
    requestAnimationFrame(render);
  };
  const image = new Image();
  image.addEventListener("load", () => {
    imageWidth = image.naturalWidth;
    imageHeight = image.naturalHeight;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    ready = true;
    shell.classList.add("webgl-ready");
  });
  image.src = "assets/creovo-reactive-hero.png";
  new ResizeObserver(resize).observe(canvas);
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    shell.classList.remove("webgl-ready");
    ready = false;
  });
  requestAnimationFrame(render);
}

function initViewfinder() {
  const hero = $(".hero"),
    viewfinder = $(".media-viewfinder"),
    tiltControl = $("#tilt-control");
  if (!hero || !viewfinder) return;
  const moveCamera = (x, y) => {
    viewfinder.style.setProperty("--focus-x", `${x * 34}px`);
    viewfinder.style.setProperty("--focus-y", `${y * 24}px`);
    hero.dispatchEvent(new CustomEvent("creovo-motion-input", {
      detail: { x, y, time: performance.now() },
    }));
  };
  hero.addEventListener("pointermove", (event) => {
    if (!motionAllowed() || matchMedia("(pointer: coarse)").matches) return;
    const bounds = viewfinder.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    moveCamera(x, y);
  }, { passive: true });
  if (tiltControl && matchMedia("(pointer: coarse)").matches && "DeviceOrientationEvent" in window) {
    let baselineBeta = null;
    const handleOrientation = (event) => {
      if (!motionAllowed() || !Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
      if (baselineBeta === null) baselineBeta = event.beta;
      const x = Math.max(-0.7, Math.min(0.7, event.gamma / 35));
      const y = Math.max(-0.7, Math.min(0.7, (event.beta - baselineBeta) / 28));
      moveCamera(x, y);
      tiltControl.textContent = "TILT ACTIVE";
      tiltControl.classList.add("active");
      tiltControl.setAttribute("aria-pressed", "true");
    };
    const activateTilt = () => window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    tiltControl.hidden = false;
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      tiltControl.addEventListener("click", async () => {
        try {
          if (await DeviceOrientationEvent.requestPermission() === "granted") activateTilt();
          else tiltControl.textContent = "TILT UNAVAILABLE";
        } catch {
          tiltControl.textContent = "TILT UNAVAILABLE";
        }
      }, { once: true });
    } else {
      activateTilt();
      tiltControl.textContent = "TILT ACTIVE";
      tiltControl.classList.add("active");
      tiltControl.setAttribute("aria-pressed", "true");
    }
  }
  $("#motion-toggle").addEventListener("click", (event) => {
    paused = !paused;
    document.body.classList.toggle("paused", paused);
    event.currentTarget.setAttribute("aria-pressed", String(paused));
    event.currentTarget.textContent = paused ? "RESUME MOTION" : "PAUSE MOTION";
    $(".cursor-label").classList.remove("active");
  });
}
/* Retained only for backwards compatibility with older markup. */
function initSignal() {
  const canvas = $("#signal");
  if (!canvas) return;
  const
    ctx = canvas.getContext("2d");
  if (!ctx) return;
  let width = 0,
    height = 0,
    dpr = 1,
    frame = 0,
    last = 0,
    time = 0,
    visible = true,
    targetX = 0,
    targetY = 0,
    x = 0,
    y = 0;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    width = r.width;
    height = r.height;
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const mobile = width < 700,
      cx = width * (mobile ? 0.67 : 0.72) + x * 25,
      cy = height * (mobile ? 0.3 : 0.44) + y * 20,
      scale = Math.min(width * (mobile ? 0.44 : 0.31), height * 0.45);
    const rotate = time * 0.085,
      lines = mobile ? 32 : 52,
      points = mobile ? 100 : 150;
    ctx.lineWidth = 0.65;
    for (let ring = 0; ring < lines; ring++) {
      const v = (ring / lines) * Math.PI * 2;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const u = (i / points) * Math.PI * 2,
          major = 1 + 0.13 * Math.cos(3 * u + time * 0.15),
          minor = 0.3 + 0.05 * Math.sin(2 * u),
          px = (major + minor * Math.cos(v)) * Math.cos(u),
          py = (major + minor * Math.cos(v)) * Math.sin(u),
          pz = minor * Math.sin(v),
          xr = px * Math.cos(rotate) - py * Math.sin(rotate),
          yr = px * Math.sin(rotate) + py * Math.cos(rotate),
          tilt = 0.85 + x * 0.12,
          yt = yr * Math.cos(tilt) - pz * Math.sin(tilt),
          zt = yr * Math.sin(tilt) + pz * Math.cos(tilt),
          skew = -0.5,
          xx = xr * Math.cos(skew) - yt * Math.sin(skew),
          yy = xr * Math.sin(skew) + yt * Math.cos(skew),
          perspective = 2.8 / (2.8 + zt),
          sx = cx + xx * scale * perspective,
          sy = cy + yy * scale * perspective;
        i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
      }
      ctx.strokeStyle = `rgba(184,225,105,${0.16 + (ring / lines) * 0.35})`;
      ctx.stroke();
    }
    ctx.fillStyle = "#b9e965";
    for (let i = 0; i < 18; i++) {
      const a = i * 2.399 + time * 0.04,
        r = scale * (1.2 + (i % 4) * 0.14);
      ctx.globalAlpha = 0.2 + (i % 3) * 0.15;
      ctx.fillRect(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.75, 1.4, 1.4);
    }
    ctx.globalAlpha = 1;
  }
  function loop(now) {
    frame = 0;
    if (!visible || document.hidden || !motionAllowed()) return;
    if (now - last > 32) {
      time += Math.min((now - last) / 1000, 0.05);
      last = now;
      x += (targetX - x) * 0.035;
      y += (targetY - y) * 0.035;
      draw();
    }
    frame = requestAnimationFrame(loop);
  }
  function resume() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (motionAllowed() && visible && !document.hidden) {
      last = performance.now();
      frame = requestAnimationFrame(loop);
    } else draw();
  }
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    resume();
  }).observe(canvas);
  $(".hero").addEventListener(
    "pointermove",
    (e) => {
      const r = canvas.getBoundingClientRect();
      targetX = (e.clientX - r.left) / width - 0.5;
      targetY = (e.clientY - r.top) / height - 0.5;
    },
    { passive: true },
  );
  document.addEventListener("visibilitychange", resume);
  motionQuery.addEventListener("change", () => {
    resume();
  });
  $("#motion-toggle").addEventListener("click", (event) => {
    paused = !paused;
    document.body.classList.toggle("paused", paused);
    event.currentTarget.setAttribute("aria-pressed", String(paused));
    event.currentTarget.textContent = paused
      ? "RESUME MOTION"
      : "PAUSE MOTION";
    $(".cursor-label").classList.remove("active");
    resume();
  });
  resize();
  resume();
}
initReveals();
initNavigation();
initPointer();
initDialogs();
initWebGLHero();
initViewfinder();
