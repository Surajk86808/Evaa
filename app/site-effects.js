import * as THREE from "three";

const responses = [
  { keywords: ["hello", "hi", "hey"], response: "Hi! I'm EVAA's AI assistant. What would you like to know?" },
  { keywords: ["what", "evaa", "company"], response: "EVAA is an AI research and ventures company based in Singapore." },
  {
    keywords: ["research", "study", "studying"],
    response: "We research consumer behaviour in the Global South and health AI applications."
  },
  { keywords: ["contact", "email", "reach"], response: "Reach us at contact@evaa.enterprises" },
  {
    keywords: ["avatar", "ai", "agent"],
    response: "Our AI agents have faces and speak multiple languages including Hindi and Malay."
  }
];

const defaultResponse = "Interesting question. Reach us at contact@evaa.enterprises for more.";

export function initSite() {
  const nav = document.querySelector("[data-nav]");
  const hero = document.querySelector("[data-hero]");
  const menu = document.querySelector("[data-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuLinks = document.querySelectorAll("[data-menu-link]");
  const revealItems = document.querySelectorAll(".reveal-up");
  const heroHeadline = document.querySelector(".hero__headline");
  const heroSubline = document.querySelector(".hero__subline");
  const chatbotModal = document.querySelector("[data-chatbot]");
  const chatOpenButton = document.querySelector("[data-chat-open]");
  const chatCloseButton = document.querySelector("[data-chat-close]");
  const transcript = document.querySelector("[data-chat-transcript]");
  const chatForm = document.querySelector("[data-chat-form]");
  const chatInput = chatForm?.querySelector("input");
  const chatVideo = document.getElementById("chat-video");
  const chatVideoWrapper = document.getElementById("chat-video-wrapper");
  const avatarImage = document.getElementById("avatar-gif");
  const systemCanvas = document.getElementById("systemCanvas");
  const particleCanvas = document.getElementById("particleCanvas");
  const particleSection = document.querySelector("[data-particle-section]");
  const statsSection = document.querySelector("[data-stats]");
  const statNumbers = document.querySelectorAll(".stats-strip__number");
  const cleanups = [];

  let heroIntroStarted = false;

  const revealHeroWithoutGsap = () => {
    if (heroHeadline) {
      heroHeadline.style.opacity = "1";
      heroHeadline.style.transform = "translateX(0)";
    }

    if (heroSubline) {
      heroSubline.style.opacity = "1";
    }
  };

  const startHeroIntro = () => {
    if (heroIntroStarted) return;
    heroIntroStarted = true;

    if (window.gsap) {
      window.gsap.to(heroHeadline, {
        opacity: 1,
        x: 0,
        delay: 0.6,
        duration: 1,
        ease: "power3.out"
      });

      window.gsap.to(heroSubline, {
        opacity: 1,
        delay: 1,
        duration: 1,
        ease: "power3.out"
      });

      return;
    }

    revealHeroWithoutGsap();
  };

  if (window.gsap) {
    startHeroIntro();
  } else {
    const gsapPoll = window.setInterval(() => {
      if (window.gsap) {
        window.clearInterval(gsapPoll);
        startHeroIntro();
      }
    }, 100);

    const fallbackTimer = window.setTimeout(() => {
      window.clearInterval(gsapPoll);
      startHeroIntro();
    }, 1200);

    cleanups.push(() => window.clearInterval(gsapPoll));
    cleanups.push(() => window.clearTimeout(fallbackTimer));
  }

  const heroObserver = new IntersectionObserver(([entry]) => {
    nav?.classList.toggle("is-solid", !entry.isIntersecting);
  }, { threshold: 0.2 });

  if (hero) {
    heroObserver.observe(hero);
    cleanups.push(() => heroObserver.disconnect());
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));
  cleanups.push(() => revealObserver.disconnect());

  const toggleMenu = (isOpen) => {
    menu?.classList.toggle("is-open", isOpen);
    menuToggle?.classList.toggle("is-open", isOpen);
    menuToggle?.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  const updateChatLayout = () => {
    if (!chatbotModal || !transcript) return;
    const messageCount = transcript.children.length;
    const heavyChat = messageCount >= 4;
    const fullChat = messageCount >= 7;
    chatbotModal.classList.toggle("is-chat-heavy", heavyChat);
    chatbotModal.classList.toggle("is-chat-full", fullChat);
    chatVideoWrapper?.setAttribute("aria-hidden", fullChat ? "true" : "false");
  };

  const openChat = () => {
    chatbotModal?.classList.add("is-open");
    chatbotModal?.setAttribute("aria-hidden", "false");
    updateChatLayout();
    chatInput?.focus();

    if (!chatVideo) return;
    chatVideo.currentTime = 0;
    chatVideo.muted = false;
    chatVideo.loop = false;
    chatVideo.play().catch(() => {});
    chatVideo.onended = () => {
      chatVideo.muted = true;
      chatVideo.loop = true;
      chatVideo.currentTime = 0;
      chatVideo.play().catch(() => {});
    };
  };

  const closeChat = () => {
    chatbotModal?.classList.remove("is-open", "is-chat-heavy", "is-chat-full");
    chatbotModal?.setAttribute("aria-hidden", "true");
    if (!chatVideo) return;
    chatVideo.pause();
    chatVideo.muted = true;
    chatVideo.loop = false;
    chatVideo.currentTime = 0;
    chatVideo.onended = null;
  };

  const appendMessage = (text, type) => {
    if (!transcript) return;
    const message = document.createElement("div");
    message.className = `chatbot-message chatbot-message--${type}`;
    message.textContent = text;
    transcript.appendChild(message);
    while (transcript.children.length > 10) {
      const oldestMessage = transcript.firstElementChild;
      if (!oldestMessage) break;
      transcript.removeChild(oldestMessage);
    }
    updateChatLayout();
    transcript.scrollTop = transcript.scrollHeight;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = chatInput?.value.trim();
    if (!value) return;
    appendMessage(value, "user");
    chatInput.value = "";
    window.setTimeout(() => {
      const normalized = value.toLowerCase();
      const found = responses.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)));
      appendMessage(found ? found.response : defaultResponse, "ai");
    }, 280);
  };

  const handleDocumentKeydown = (event) => {
    if (event.key === "Escape") {
      closeChat();
      toggleMenu(false);
    }
  };

  const handleChatTriggerKeydown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openChat();
    }
  };

  const handleMenuToggle = () => toggleMenu(!menu?.classList.contains("is-open"));

  menuToggle?.addEventListener("click", handleMenuToggle);
  chatOpenButton?.addEventListener("click", openChat);
  chatCloseButton?.addEventListener("click", closeChat);
  chatOpenButton?.addEventListener("keydown", handleChatTriggerKeydown);
  chatForm?.addEventListener("submit", handleSubmit);
  document.addEventListener("keydown", handleDocumentKeydown);

  menuLinks.forEach((link) => {
    const closeMenu = () => toggleMenu(false);
    link.addEventListener("click", closeMenu);
    cleanups.push(() => link.removeEventListener("click", closeMenu));
  });

  chatVideo?.addEventListener("error", () => {
    chatVideo.style.opacity = "0";
  });

  avatarImage?.addEventListener("error", () => {
    avatarImage.style.opacity = "0";
  });

  cleanups.push(() => menuToggle?.removeEventListener("click", handleMenuToggle));
  cleanups.push(() => chatOpenButton?.removeEventListener("click", openChat));
  cleanups.push(() => chatCloseButton?.removeEventListener("click", closeChat));
  cleanups.push(() => chatOpenButton?.removeEventListener("keydown", handleChatTriggerKeydown));
  cleanups.push(() => chatForm?.removeEventListener("submit", handleSubmit));
  cleanups.push(() => document.removeEventListener("keydown", handleDocumentKeydown));

  initSystemCanvas(systemCanvas, cleanups);
  initParticleCanvas(particleCanvas, particleSection, cleanups);
  initStats(statsSection, statNumbers, cleanups);
  initTypingOverlay(cleanups);
  initHeroCanvas(cleanups);

  return () => {
    cleanups.reverse().forEach((cleanup) => cleanup());
  };
}

function initTypingOverlay(cleanups) {
  const leftLines = [
    "ARTIFICIAL INTELLIGENCE",
    "RESEARCH & VENTURES",
    "EST. SINGAPORE 2024"
  ];

  const rightLines = [
    "NEURAL INTELLIGENCE",
    "AVATAR AGENTS",
    "HUMAN × MACHINE"
  ];

  let destroyed = false;
  const timeouts = new Set();
  const intervals = new Set();
  let leftEl = null;
  let rightEl = null;

  const scheduleTimeout = (fn, ms) => {
    const id = window.setTimeout(() => {
      timeouts.delete(id);
      fn();
    }, ms);
    timeouts.add(id);
    return id;
  };

  class TypeWriter {
    constructor(element, lines, options = {}) {
      this.el = element;
      this.lines = lines;
      this.speed = options.speed || 60;
      this.lineDelay = options.lineDelay || 400;
      this.startDelay = options.startDelay || 800;
      this.onComplete = options.onComplete || null;
      this.cursor = document.createElement("span");
      this.cursor.className = "type-cursor";
      this.cursor.textContent = "|";
    }

    async start() {
      await this.wait(this.startDelay);
      if (destroyed) return;

      for (let i = 0; i < this.lines.length; i += 1) {
        const lineEl = document.createElement("div");
        lineEl.className = "type-line";
        this.el.appendChild(lineEl);
        lineEl.appendChild(this.cursor);
        await this.typeLine(lineEl, this.lines[i]);
        if (destroyed) return;
        await this.wait(this.lineDelay);
        if (destroyed) return;
      }

      await this.wait(600);
      if (destroyed) return;
      this.cursor.style.animation = "none";
      this.cursor.style.opacity = "0";

      if (this.onComplete) {
        this.onComplete();
      }
    }

    typeLine(el, text) {
      return new Promise((resolve) => {
        let i = 0;
        const interval = window.setInterval(() => {
          if (destroyed) {
            window.clearInterval(interval);
            intervals.delete(interval);
            resolve();
            return;
          }

          const textNode = document.createTextNode(text[i]);
          el.insertBefore(textNode, this.cursor);
          i += 1;

          if (i >= text.length) {
            window.clearInterval(interval);
            intervals.delete(interval);
            resolve();
          }
        }, this.speed);

        intervals.add(interval);
      });
    }

    wait(ms) {
      return new Promise((resolve) => {
        scheduleTimeout(resolve, ms);
      });
    }
  }

  const scanLine = document.createElement("div");
  scanLine.className = "scan-line";
  document.body.appendChild(scanLine);

  const handleScanEnd = () => {
    scanLine.remove();
  };

  scanLine.addEventListener("animationend", handleScanEnd);

  scheduleTimeout(() => {
    leftEl = document.getElementById("type-left");
    rightEl = document.getElementById("type-right");

    if (!leftEl || !rightEl) {
      console.error("Type elements not found");
      return;
    }

    leftEl.textContent = "";
    rightEl.textContent = "";
    leftEl.style.opacity = "1";
    rightEl.style.opacity = "1";

    const leftTyper = new TypeWriter(leftEl, leftLines, {
      speed: 55,
      lineDelay: 350,
      startDelay: 1000,
      onComplete: () => {
        if (destroyed) return;

        const rightTyper = new TypeWriter(rightEl, rightLines, {
          speed: 55,
          lineDelay: 350,
          startDelay: 200,
          onComplete: () => {
            if (destroyed) return;
            document
              .querySelectorAll(".vertical-meta")
              .forEach((element) => element.classList.add("visible"));
          }
        });

        rightTyper.start();
      }
    });

    leftTyper.start();
  }, 500);

  cleanups.push(() => {
    destroyed = true;
    timeouts.forEach((id) => window.clearTimeout(id));
    intervals.forEach((id) => window.clearInterval(id));
    scanLine.removeEventListener("animationend", handleScanEnd);
    scanLine.remove();
    document
      .querySelectorAll(".vertical-meta")
      .forEach((element) => element.classList.remove("visible"));
    if (leftEl) {
      leftEl.textContent = "";
      leftEl.style.opacity = "";
    }
    if (rightEl) {
      rightEl.textContent = "";
      rightEl.style.opacity = "";
    }
  });
}

function initSystemCanvas(systemCanvas, cleanups) {
  if (!systemCanvas) return;
  const context = systemCanvas.getContext("2d");
  const dots = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const createDots = () => {
    dots.length = 0;
    const spacing = Math.max(28, Math.floor(width / 12));
    const cols = Math.max(6, Math.floor(width / spacing));
    const rows = Math.max(6, Math.floor(height / spacing));
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        dots.push({ x: ((x + 0.5) / cols) * width, y: ((y + 0.5) / rows) * height, pulse: Math.random() * Math.PI * 2 });
      }
    }
  };

  const resizeSystem = () => {
    const rect = systemCanvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const ratio = window.devicePixelRatio || 1;
    systemCanvas.width = width * ratio;
    systemCanvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    createDots();
  };

  const drawSystem = (time) => {
    context.clearRect(0, 0, width, height);
    dots.forEach((dot, index) => {
      const pulse = (Math.sin(time * 0.0016 + dot.pulse) + 1) * 0.5;
      for (let i = index + 1; i < dots.length; i += 1) {
        const other = dots[i];
        const distance = Math.hypot(dot.x - other.x, dot.y - other.y);
        if (distance < 90) {
          context.strokeStyle = `rgba(255,255,255,${(1 - distance / 90) * 0.18})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(dot.x, dot.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }

      context.fillStyle = `rgba(255,255,255,${0.4 + pulse * 0.55})`;
      context.beginPath();
      context.arc(dot.x, dot.y, 1.2 + pulse * 1.8, 0, Math.PI * 2);
      context.fill();
    });
    animationFrame = window.requestAnimationFrame(drawSystem);
  };

  resizeSystem();
  animationFrame = window.requestAnimationFrame(drawSystem);
  window.addEventListener("resize", resizeSystem);
  cleanups.push(() => window.removeEventListener("resize", resizeSystem));
  cleanups.push(() => window.cancelAnimationFrame(animationFrame));
}

function initParticleCanvas(particleCanvas, particleSection, cleanups) {
  if (!particleCanvas || !particleSection) return;
  const context = particleCanvas.getContext("2d");
  const particles = [];
  const pointer = { x: -9999, y: -9999, active: false };
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const createParticleGrid = () => {
    particles.length = 0;
    for (let y = 16; y < height; y += 32) {
      for (let x = 16; x < width; x += 32) particles.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
    }
  };

  const resizeParticles = () => {
    const rect = particleSection.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const ratio = window.devicePixelRatio || 1;
    particleCanvas.width = width * ratio;
    particleCanvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    createParticleGrid();
  };

  const updatePointer = (event) => {
    const rect = particleSection.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  };

  const clearPointer = () => {
    pointer.x = -9999;
    pointer.y = -9999;
    pointer.active = false;
  };

  const animateParticles = () => {
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      if (pointer.active) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 120 && distance > 0.001) {
          const force = (1 - distance / 120) * 4.2;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
      }

      particle.vx += (particle.ox - particle.x) * 0.08;
      particle.vy += (particle.oy - particle.y) * 0.08;
      particle.vx *= 0.75;
      particle.vy *= 0.75;
      particle.x += particle.vx;
      particle.y += particle.vy;

      const distanceToPointer = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
      let opacity = 0.2;
      let radius = 2;
      if (pointer.active && distanceToPointer < 80) {
        const proximity = 1 - distanceToPointer / 80;
        opacity = 0.2 + proximity * 0.8;
        radius = 2 + proximity;
      }

      context.fillStyle = `rgba(255,255,255,${Math.min(opacity, 1)})`;
      context.beginPath();
      context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      context.fill();
    });
    animationFrame = window.requestAnimationFrame(animateParticles);
  };

  resizeParticles();
  animateParticles();
  particleSection.addEventListener("mousemove", updatePointer);
  particleSection.addEventListener("mouseleave", clearPointer);
  window.addEventListener("resize", resizeParticles);
  cleanups.push(() => particleSection.removeEventListener("mousemove", updatePointer));
  cleanups.push(() => particleSection.removeEventListener("mouseleave", clearPointer));
  cleanups.push(() => window.removeEventListener("resize", resizeParticles));
  cleanups.push(() => window.cancelAnimationFrame(animationFrame));
}

function initStats(statsSection, statNumbers, cleanups) {
  if (!statsSection || !statNumbers.length) return;
  const animateCount = (element) => {
    const target = parseInt(element.dataset.count || "0", 10);
    const suffix = element.dataset.suffix || "";
    let current = 0;
    const step = target / 60;
    const timer = window.setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        window.clearInterval(timer);
      }
      element.textContent = `${Math.floor(current)}${suffix}`;
    }, 33);
    cleanups.push(() => window.clearInterval(timer));
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      statNumbers.forEach((element) => {
        if (!element.dataset.animated) {
          element.dataset.animated = "true";
          animateCount(element);
        }
      });
      statsObserver.disconnect();
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px"
  });

  statsObserver.observe(statsSection);
  cleanups.push(() => statsObserver.disconnect());
}

function initHeroCanvas(cleanups) {
  const heroSection = document.getElementById("hero");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.domElement.className = "hero-canvas";
  heroSection?.appendChild(renderer.domElement);

  const pointer = new THREE.Vector2(10, 10);
  let isMobile = window.innerWidth < 768;
  let isPortraitMobile = window.innerWidth < window.innerHeight;
  const updatePointer = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  const clearPointer = () => pointer.set(10, 10);
  window.addEventListener("pointermove", updatePointer);
  renderer.domElement.addEventListener("pointerleave", clearPointer);
  renderer.domElement.style.touchAction = "none";

  const makeMaskTarget = () =>
    new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { depthBuffer: false, stencilBuffer: false });
  let maskRead = makeMaskTarget();
  let maskWrite = makeMaskTarget();
  const maskScene = new THREE.Scene();
  const maskCamera = new THREE.Camera();
  const maskUniforms = {
    prevTexture: { value: maskRead.texture },
    pointer: { value: pointer },
    aspect: { value: window.innerWidth / window.innerHeight },
    deltaTime: { value: 0 },
    brushRadius: { value: 0.42 },
    fadeSpeed: { value: 0.42 }
  };

  if (isMobile) {
    maskUniforms.brushRadius.value = 0.5;
    maskUniforms.fadeSpeed.value = 0.22;
  }

  const maskMaterial = new THREE.ShaderMaterial({
    uniforms: maskUniforms,
    vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }",
    fragmentShader:
      "uniform sampler2D prevTexture; uniform vec2 pointer; uniform float aspect; uniform float deltaTime; uniform float brushRadius; uniform float fadeSpeed; varying vec2 vUv; void main(){ float prev=texture2D(prevTexture,vUv).r; float faded=max(prev-deltaTime*fadeSpeed,0.0); vec2 uv=(vUv-0.5)*2.0*vec2(aspect,1.0); vec2 mouse=pointer*vec2(aspect,1.0); float glow=1.0-smoothstep(brushRadius*0.15,brushRadius,distance(uv,mouse)); float mask=max(faded,glow); gl_FragColor=vec4(mask,mask,mask,1.0); }"
  });
  maskScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), maskMaterial));

  const textureLoader = new THREE.TextureLoader();
  const fitCover = (mesh, texture) => {
    const imgW = texture.image.width;
    const imgH = texture.image.height;
    const imgAspect = imgW / imgH;
    const viewAspect = window.innerWidth / window.innerHeight;
    const scale = Math.max(viewAspect / imgAspect, imgAspect / viewAspect);
    void scale;

    if (viewAspect > imgAspect) {
      mesh.scale.set(1, imgAspect / viewAspect, 1);
    } else {
      mesh.scale.set(viewAspect / imgAspect, 1, 1);
    }
  };

  let frame = 0;
  let disposed = false;
  let demoInterval = 0;
  const onTouchMove = (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    if (!touch) return;
    pointer.x = (touch.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    maskUniforms.pointer.value.x = pointer.x;
    maskUniforms.pointer.value.y = pointer.y;
  };
  const onTouchStart = (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    pointer.x = (touch.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    maskUniforms.pointer.value.x = pointer.x;
    maskUniforms.pointer.value.y = pointer.y;
  };
  const onTouchEnd = () => {};
  renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: false });
  renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: true });
  renderer.domElement.addEventListener("touchend", onTouchEnd, { passive: true });

  const getHeroSources = (portrait) => ({
    dottedSrc: portrait ? "/photos/dotted-mobile.png" : "/photos/dotted.png",
    realSrc: portrait ? "/photos/real-mobile.png" : "/photos/real.png",
    imageAspect: portrait ? 9 / 16 : 16 / 9
  });

  Promise.all([
    textureLoader.loadAsync(getHeroSources(isPortraitMobile).dottedSrc),
    textureLoader.loadAsync(getHeroSources(isPortraitMobile).realSrc)
  ]).then(async ([texDotted, texReal]) => {
    if (disposed) return;
    const prepareTexture = (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    };
    [texDotted, texReal].forEach(prepareTexture);
    let activeDottedTexture = texDotted;
    let activeRealTexture = texReal;
    let activeTextureMode = isPortraitMobile ? "portrait" : "landscape";

    const material = new THREE.ShaderMaterial({
      uniforms: {
        texDotted: { value: activeDottedTexture },
        texReal: { value: activeRealTexture },
        texMask: { value: maskRead.texture },
        uAspectCanvas: { value: window.innerWidth / window.innerHeight },
        uAspectImage: { value: getHeroSources(isPortraitMobile).imageAspect },
        uMobileZoom: { value: 1.0 },
        uMobileOffsetY: { value: 0.0 },
        dottedOffset: { value: new THREE.Vector2(0, 0) },
        realOffset: { value: new THREE.Vector2(0, isPortraitMobile ? 0 : 0.03) },
        dottedScale: { value: 1 },
        realScale: { value: 1 }
      },
      vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader:
        "uniform sampler2D texDotted; uniform sampler2D texReal; uniform sampler2D texMask; uniform vec2 dottedOffset; uniform vec2 realOffset; uniform float dottedScale; uniform float realScale; uniform float uAspectCanvas; uniform float uAspectImage; uniform float uMobileZoom; uniform float uMobileOffsetY; varying vec2 vUv; void main(){ vec2 uv=vUv; float canvasAspect=uAspectCanvas; float imageAspect=uAspectImage; vec2 scale=vec2(1.0); if(canvasAspect>imageAspect){ scale.y=imageAspect/canvasAspect; } else { scale.x=canvasAspect/imageAspect; } vec2 coveredUV=(uv-0.5)/scale+0.5; coveredUV=clamp(coveredUV,0.0,1.0); vec2 zoomedUV=(coveredUV-0.5)/uMobileZoom+0.5; zoomedUV.y+=uMobileOffsetY; bool outsideImage=zoomedUV.x<0.0||zoomedUV.x>1.0||zoomedUV.y<0.0||zoomedUV.y>1.0; vec2 dUv=(zoomedUV-0.5)/dottedScale+0.5+dottedOffset; vec2 rUv=(zoomedUV-0.5)/realScale+0.5+realOffset; bool outsideDotted=outsideImage||dUv.x<0.0||dUv.x>1.0||dUv.y<0.0||dUv.y>1.0; bool outsideReal=outsideImage||rUv.x<0.0||rUv.x>1.0||rUv.y<0.0||rUv.y>1.0; vec4 dotted=outsideDotted?vec4(0.0,0.0,0.0,1.0):texture2D(texDotted,dUv); vec4 real=outsideReal?vec4(0.0,0.0,0.0,1.0):texture2D(texReal,rUv); float mask=texture2D(texMask,vUv).r; float blend=smoothstep(0.15,0.65,mask); gl_FragColor=vec4(mix(dotted.rgb,real.rgb,blend),1.0); }"
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    fitCover(plane, activeDottedTexture);
    scene.add(plane);
    const clock = new THREE.Clock();

    const updateHeroTextureMode = async (portrait) => {
      const nextMode = portrait ? "portrait" : "landscape";
      const nextSources = getHeroSources(portrait);
      material.uniforms.uAspectImage.value = nextSources.imageAspect;
      material.uniforms.uMobileZoom.value = 1.0;
      material.uniforms.uMobileOffsetY.value = 0.0;
      material.uniforms.realOffset.value.set(0, portrait ? 0 : 0.03);
      material.uniforms.realScale.value = 1;

      if (nextMode === activeTextureMode) {
        fitCover(plane, activeDottedTexture);
        return;
      }

      const [nextDottedTexture, nextRealTexture] = await Promise.all([
        textureLoader.loadAsync(nextSources.dottedSrc),
        textureLoader.loadAsync(nextSources.realSrc)
      ]);

      if (disposed) {
        nextDottedTexture.dispose();
        nextRealTexture.dispose();
        return;
      }

      [nextDottedTexture, nextRealTexture].forEach(prepareTexture);
      activeDottedTexture.dispose();
      activeRealTexture.dispose();
      activeDottedTexture = nextDottedTexture;
      activeRealTexture = nextRealTexture;
      activeTextureMode = nextMode;
      material.uniforms.texDotted.value = activeDottedTexture;
      material.uniforms.texReal.value = activeRealTexture;
      fitCover(plane, activeDottedTexture);
    };

    if (isMobile) {
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
      if (!disposed) {
        let t = 0;
        demoInterval = window.setInterval(() => {
          t += 0.06;
          maskUniforms.pointer.value.x = Math.sin(t) * 0.5;
          maskUniforms.pointer.value.y = Math.cos(t * 0.7) * 0.3;
          if (t > Math.PI * 2.5) {
            window.clearInterval(demoInterval);
            demoInterval = 0;
            maskUniforms.pointer.value.set(10, 10);
          }
        }, 40);
      }
    }

    const handleResize = async () => {
      isMobile = window.innerWidth < 768;
      isPortraitMobile = window.innerWidth < window.innerHeight;
      renderer.setSize(window.innerWidth, window.innerHeight);
      maskRead.setSize(window.innerWidth, window.innerHeight);
      maskWrite.setSize(window.innerWidth, window.innerHeight);
      maskUniforms.aspect.value = window.innerWidth / window.innerHeight;
      maskUniforms.brushRadius.value = isMobile ? 0.5 : 0.42;
      maskUniforms.fadeSpeed.value = isMobile ? 0.22 : 0.42;
      material.uniforms.uAspectCanvas.value = window.innerWidth / window.innerHeight;
      await updateHeroTextureMode(isPortraitMobile);
    };

    window.addEventListener("resize", handleResize);
    cleanups.push(() => window.removeEventListener("resize", handleResize));

    const handleShaderDebugKeydown = (event) => {
      const uniforms = material.uniforms;

      if (event.key === "ArrowUp") uniforms.realOffset.value.y += 0.01;
      if (event.key === "ArrowDown") uniforms.realOffset.value.y -= 0.01;
      if (event.key === "ArrowLeft") uniforms.realOffset.value.x -= 0.01;
      if (event.key === "ArrowRight") uniforms.realOffset.value.x += 0.01;
      if (event.key === "+" || event.key === "=") uniforms.realScale.value += 0.05;
      if (event.key === "-") uniforms.realScale.value -= 0.05;
      if (event.key === "z") uniforms.uMobileZoom.value += 0.1;
      if (event.key === "x") uniforms.uMobileZoom.value -= 0.1;
      if (event.key === "u") uniforms.uMobileOffsetY.value += 0.01;
      if (event.key === "d") uniforms.uMobileOffsetY.value -= 0.01;

      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "+" ||
        event.key === "=" ||
        event.key === "-" ||
        event.key === "z" ||
        event.key === "x" ||
        event.key === "u" ||
        event.key === "d"
      ) {
        console.log(
          "offset:",
          {
            x: Number(uniforms.realOffset.value.x.toFixed(2)),
            y: Number(uniforms.realOffset.value.y.toFixed(2))
          },
          "scale:",
          Number(uniforms.realScale.value.toFixed(2)),
          "zoom:",
          Number(uniforms.uMobileZoom.value.toFixed(2)),
          "offsetY:",
          Number(uniforms.uMobileOffsetY.value.toFixed(2))
        );
      }
    };

    window.addEventListener("keydown", handleShaderDebugKeydown);
    cleanups.push(() =>
      window.removeEventListener("keydown", handleShaderDebugKeydown)
    );

    const renderLoop = () => {
      if (disposed) return;
      maskUniforms.deltaTime.value = clock.getDelta();
      maskUniforms.prevTexture.value = maskRead.texture;
      renderer.setRenderTarget(maskWrite);
      renderer.render(maskScene, maskCamera);
      renderer.setRenderTarget(null);
      [maskRead, maskWrite] = [maskWrite, maskRead];
      material.uniforms.texMask.value = maskRead.texture;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(renderLoop);
    };

    renderLoop();
    cleanups.push(() => {
      activeDottedTexture.dispose();
      activeRealTexture.dispose();
      material.dispose();
      plane.geometry.dispose();
      if (demoInterval) window.clearInterval(demoInterval);
    });
  });

  cleanups.push(() => {
    disposed = true;
    window.cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", updatePointer);
    renderer.domElement.removeEventListener("pointerleave", clearPointer);
    renderer.domElement.removeEventListener("touchmove", onTouchMove);
    renderer.domElement.removeEventListener("touchstart", onTouchStart);
    renderer.domElement.removeEventListener("touchend", onTouchEnd);
    if (demoInterval) window.clearInterval(demoInterval);
    maskRead.dispose();
    maskWrite.dispose();
    maskMaterial.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  });
}
