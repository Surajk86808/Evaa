const responses = [
  {
    keywords: ["hello", "hi", "hey"],
    response: "Hi! I'm EVAA's AI assistant. What would you like to know?"
  },
  {
    keywords: ["what", "evaa", "company"],
    response: "EVAA is an AI research and ventures company based in Singapore."
  },
  {
    keywords: ["research", "study", "studying"],
    response:
      "We research consumer behaviour in the Global South and health AI applications."
  },
  {
    keywords: ["contact", "email", "reach"],
    response: "Reach us at contact@evaa.enterprises"
  },
  {
    keywords: ["avatar", "ai", "agent"],
    response:
      "Our AI agents have faces and speak multiple languages including Hindi and Malay."
  }
]

const defaultResponse =
  "Interesting question. Reach us at contact@evaa.enterprises for more."

const nav = document.querySelector("[data-nav]")
const hero = document.querySelector("[data-hero]")
const menu = document.querySelector("[data-menu]")
const menuToggle = document.querySelector("[data-menu-toggle]")
const menuLinks = document.querySelectorAll("[data-menu-link]")
const revealItems = document.querySelectorAll(".reveal-up")
const heroHeadline = document.querySelector(".hero__headline")
const heroSubline = document.querySelector(".hero__subline")
const chatbotModal = document.querySelector("[data-chatbot]")
const chatOpenButton = document.querySelector("[data-chat-open]")
const chatCloseButton = document.querySelector("[data-chat-close]")
const transcript = document.querySelector("[data-chat-transcript]")
const chatForm = document.querySelector("[data-chat-form]")
const chatInput = chatForm?.querySelector("input")
const chatVideo = document.getElementById("chat-video")
const chatVideoWrapper = document.getElementById("chat-video-wrapper")
const systemCanvas = document.getElementById("systemCanvas")
const particleCanvas = document.getElementById("particleCanvas")
const particleSection = document.querySelector("[data-particle-section]")
const statsSection = document.querySelector("[data-stats]")
const statNumbers = document.querySelectorAll(".stats-strip__number")

if (window.gsap) {
  gsap.to(heroHeadline, {
    opacity: 1,
    x: 0,
    delay: 0.6,
    duration: 1,
    ease: "power3.out"
  })

  gsap.to(heroSubline, {
    opacity: 1,
    delay: 1,
    duration: 1,
    ease: "power3.out"
  })
}

const heroObserver = new IntersectionObserver(
  ([entry]) => {
    nav?.classList.toggle("is-solid", !entry.isIntersecting)
  },
  { threshold: 0.2 }
)

if (hero) {
  heroObserver.observe(hero)
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible")
        revealObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
)

revealItems.forEach((item) => revealObserver.observe(item))

const toggleMenu = (isOpen) => {
  menu?.classList.toggle("is-open", isOpen)
  menuToggle?.classList.toggle("is-open", isOpen)
  menuToggle?.setAttribute("aria-expanded", String(isOpen))
  document.body.style.overflow = isOpen ? "hidden" : ""
}

menuToggle?.addEventListener("click", () => {
  const isOpen = !menu.classList.contains("is-open")
  toggleMenu(isOpen)
})

menuLinks.forEach((link) => {
  link.addEventListener("click", () => toggleMenu(false))
})

const openChat = () => {
  chatbotModal?.classList.add("is-open")
  chatbotModal?.setAttribute("aria-hidden", "false")
  onChatOpen()
  chatInput?.focus()
}

const closeChat = () => {
  chatbotModal?.classList.remove("is-open")
  chatbotModal?.setAttribute("aria-hidden", "true")
  onChatClose()
}

chatOpenButton?.addEventListener("click", openChat)
chatCloseButton?.addEventListener("click", closeChat)
chatOpenButton?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    openChat()
  }
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeChat()
    toggleMenu(false)
  }
})

const appendMessage = (text, type) => {
  if (!transcript) {
    return
  }

  const message = document.createElement("div")
  message.className = `chatbot-message chatbot-message--${type}`
  message.textContent = text
  transcript.appendChild(message)

  while (transcript.children.length > 10) {
    transcript.removeChild(transcript.firstElementChild)
  }

  updateChatLayout()
  transcript.scrollTop = transcript.scrollHeight
}

const matchResponse = (value) => {
  const normalized = value.toLowerCase()
  const found = responses.find((entry) =>
    entry.keywords.some((keyword) => normalized.includes(keyword))
  )
  return found ? found.response : defaultResponse
}

function onChatOpen() {
  updateChatLayout()

  if (!chatVideo) {
    return
  }

  chatVideo.currentTime = 0
  chatVideo.muted = false
  chatVideo.loop = false
  chatVideo.play().catch(() => {})

  chatVideo.onended = () => {
    chatVideo.muted = true
    chatVideo.loop = true
    chatVideo.currentTime = 0
    chatVideo.play().catch(() => {})
  }
}

function onChatClose() {
  chatbotModal?.classList.remove("is-chat-heavy", "is-chat-full")

  if (!chatVideo) {
    return
  }

  chatVideo.pause()
  chatVideo.muted = true
  chatVideo.loop = false
  chatVideo.currentTime = 0
  chatVideo.onended = null
}

function updateChatLayout() {
  if (!chatbotModal || !transcript) {
    return
  }

  const messageCount = transcript.children.length
  const heavyChat = messageCount >= 4
  const fullChat = messageCount >= 7

  chatbotModal.classList.toggle("is-chat-heavy", heavyChat)
  chatbotModal.classList.toggle("is-chat-full", fullChat)

  if (chatVideoWrapper) {
    chatVideoWrapper.setAttribute("aria-hidden", fullChat ? "true" : "false")
  }
}

chatForm?.addEventListener("submit", (event) => {
  event.preventDefault()

  const value = chatInput?.value.trim()
  if (!value) {
    return
  }

  appendMessage(value, "user")
  chatInput.value = ""

  window.setTimeout(() => {
    appendMessage(matchResponse(value), "ai")
  }, 280)
})

chatVideo?.addEventListener("error", () => {
  chatVideo.style.opacity = "0"
})

const avatarImage = document.getElementById("avatar-gif")
avatarImage?.addEventListener("error", () => {
  avatarImage.style.opacity = "0"
})

if (systemCanvas) {
  const context = systemCanvas.getContext("2d")
  const dots = []
  let width = 0
  let height = 0
  let animationFrame = 0

  const createDots = () => {
    dots.length = 0
    const spacing = Math.max(28, Math.floor(width / 12))
    const cols = Math.max(6, Math.floor(width / spacing))
    const rows = Math.max(6, Math.floor(height / spacing))

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        dots.push({
          x: ((x + 0.5) / cols) * width,
          y: ((y + 0.5) / rows) * height,
          pulse: Math.random() * Math.PI * 2
        })
      }
    }
  }

  const resizeSystem = () => {
    const rect = systemCanvas.getBoundingClientRect()
    width = rect.width
    height = rect.height
    const ratio = window.devicePixelRatio || 1

    systemCanvas.width = width * ratio
    systemCanvas.height = height * ratio
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    createDots()
  }

  const drawSystem = (time) => {
    context.clearRect(0, 0, width, height)

    dots.forEach((dot, index) => {
      const pulse = (Math.sin(time * 0.0016 + dot.pulse) + 1) * 0.5

      for (let i = index + 1; i < dots.length; i += 1) {
        const other = dots[i]
        const dx = dot.x - other.x
        const dy = dot.y - other.y
        const distance = Math.hypot(dx, dy)

        if (distance < 90) {
          const alpha = (1 - distance / 90) * 0.18
          context.strokeStyle = `rgba(255,255,255,${alpha})`
          context.lineWidth = 1
          context.beginPath()
          context.moveTo(dot.x, dot.y)
          context.lineTo(other.x, other.y)
          context.stroke()
        }
      }

      context.fillStyle = `rgba(255,255,255,${0.4 + pulse * 0.55})`
      context.beginPath()
      context.arc(dot.x, dot.y, 1.2 + pulse * 1.8, 0, Math.PI * 2)
      context.fill()
    })

    animationFrame = window.requestAnimationFrame(drawSystem)
  }

  resizeSystem()
  animationFrame = window.requestAnimationFrame(drawSystem)
  window.addEventListener("resize", resizeSystem)

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(animationFrame)
    window.removeEventListener("resize", resizeSystem)
  })
}

if (particleCanvas && particleSection) {
  const context = particleCanvas.getContext("2d")
  const particles = []
  const pointer = {
    x: -9999,
    y: -9999,
    active: false
  }
  let width = 0
  let height = 0
  let ratio = 1
  let animationFrame = 0

  const createParticleGrid = () => {
    particles.length = 0

    for (let y = 16; y < height; y += 32) {
      for (let x = 16; x < width; x += 32) {
        particles.push({
          ox: x,
          oy: y,
          x,
          y,
          vx: 0,
          vy: 0
        })
      }
    }
  }

  const resizeParticles = () => {
    const rect = particleSection.getBoundingClientRect()
    width = rect.width
    height = rect.height
    ratio = window.devicePixelRatio || 1
    particleCanvas.width = width * ratio
    particleCanvas.height = height * ratio
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    createParticleGrid()
  }

  const updatePointer = (event) => {
    const rect = particleSection.getBoundingClientRect()
    pointer.x = event.clientX - rect.left
    pointer.y = event.clientY - rect.top
    pointer.active = true
  }

  const clearPointer = () => {
    pointer.x = -9999
    pointer.y = -9999
    pointer.active = false
  }

  const animateParticles = () => {
    context.clearRect(0, 0, width, height)

    particles.forEach((particle) => {
      if (pointer.active) {
        const dx = particle.x - pointer.x
        const dy = particle.y - pointer.y
        const distance = Math.hypot(dx, dy)

        if (distance < 120 && distance > 0.001) {
          const force = (1 - distance / 120) * 4.2
          particle.vx += (dx / distance) * force
          particle.vy += (dy / distance) * force
        }
      }

      particle.vx += (particle.ox - particle.x) * 0.08
      particle.vy += (particle.oy - particle.y) * 0.08
      particle.vx *= 0.75
      particle.vy *= 0.75
      particle.x += particle.vx
      particle.y += particle.vy

      const distanceToPointer = Math.hypot(particle.x - pointer.x, particle.y - pointer.y)
      let opacity = 0.2
      let radius = 2

      if (pointer.active && distanceToPointer < 80) {
        const proximity = 1 - distanceToPointer / 80
        opacity = 0.2 + proximity * 0.8
        radius = 2 + proximity
      }

      context.fillStyle = `rgba(255,255,255,${Math.min(opacity, 1)})`
      context.beginPath()
      context.arc(particle.x, particle.y, radius, 0, Math.PI * 2)
      context.fill()
    })

    animationFrame = window.requestAnimationFrame(animateParticles)
  }

  resizeParticles()
  animateParticles()

  particleSection.addEventListener("mousemove", updatePointer)
  particleSection.addEventListener("mouseleave", clearPointer)
  window.addEventListener("resize", resizeParticles)
  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(animationFrame)
    window.removeEventListener("resize", resizeParticles)
  })
}

if (statsSection && statNumbers.length) {
  const animateCount = (element) => {
    const target = Number(element.dataset.count || 0)
    const suffix = element.dataset.suffix || ""
    const duration = 2000
    const startTime = performance.now()

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = Math.round(target * eased)
      element.textContent = `${value}${suffix}`

      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }

  const statsObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        return
      }

      statNumbers.forEach((element) => {
        if (!element.dataset.animated) {
          element.dataset.animated = "true"
          animateCount(element)
        }
      })

      statsObserver.unobserve(statsSection)
    },
    { threshold: 0.35 }
  )

  statsObserver.observe(statsSection)
}
