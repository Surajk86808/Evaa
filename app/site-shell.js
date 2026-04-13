"use client";

import { useEffect } from "react";
import { initSite } from "./site-effects";

export default function HomePage() {
  useEffect(() => initSite(), []);

  return (
    <>
      <header className="navbar" data-nav>
        <a className="navbar__brand" href="#top">EVAA</a>
        <nav className="navbar__links">
          <a href="#research">Research</a>
          <a href="#ventures">Ventures</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="navbar__toggle" type="button" aria-label="Open menu" aria-expanded="false" data-menu-toggle>
          <span></span>
          <span></span>
        </button>
      </header>

      <div className="menu-overlay" data-menu>
        <nav className="menu-overlay__nav">
          <a href="#research" data-menu-link>Research</a>
          <a href="#ventures" data-menu-link>Ventures</a>
          <a href="#contact" data-menu-link>Contact</a>
        </nav>
      </div>

      <div id="type-left" className="type-block type-left"></div>
      <div id="type-right" className="type-block type-right"></div>
      <div className="vertical-meta meta-left">01 / INTELLIGENCE</div>
      <div className="vertical-meta meta-right">02 / HUMANITY</div>

      <main id="top">
        <section className="hero" data-hero>
          <div className="hero__background-text" aria-hidden="true">WE BUILD WHAT DOESN&apos;T EXIST YET.</div>
          <div className="hero__side-label" aria-hidden="true">EVAA ENTERPRISES</div>
          <div className="hero__meta hero__meta--left" aria-hidden="true">
            <p>AI RESEARCH AND VENTURES</p>
            <p>SINGAPORE · EST. 2024</p>
          </div>
          <div className="hero__meta hero__meta--right" aria-hidden="true">&copy;2024</div>
          <div className="hero__content hero__content--desktop">
            <h1 className="hero__headline">We build what doesn&apos;t exist yet.</h1>
            <p className="hero__subline">AI research and ventures. Singapore.</p>
          </div>
          <a className="hero__scroll" href="#ventures" aria-label="Scroll to ventures">
            <span>SCROLL</span>
            <span className="hero__scroll-line"></span>
          </a>
        </section>

        <section className="marquee-strip" aria-label="EVAA topics">
          <div className="marquee-strip__track">
            <span>AI RESEARCH · ENTERPRISE AUTOMATION · AVATAR AGENTS · GLOBAL SOUTH · CONVERSATIONAL AI · SINGAPORE · BEHAVIORAL INTELLIGENCE ·</span>
            <span>AI RESEARCH · ENTERPRISE AUTOMATION · AVATAR AGENTS · GLOBAL SOUTH · CONVERSATIONAL AI · SINGAPORE · BEHAVIORAL INTELLIGENCE ·</span>
          </div>
        </section>

        <section className="particle-section" data-particle-section>
          <canvas className="particle-section__canvas" id="particleCanvas"></canvas>
          <div className="particle-section__content reveal-up">
            <h2>ENTERPRISE AI</h2>
            <p>Rebuilt from the ground up.</p>
          </div>
        </section>

        <section className="stats-strip" data-stats>
          <div className="stats-strip__item"><div className="stats-strip__number" data-count="3">0</div><div className="stats-strip__label">Languages spoken by our agents</div></div>
          <div className="stats-strip__item"><div className="stats-strip__number" data-count="4" data-suffix="B+">0</div><div className="stats-strip__label">Underserved consumers we study</div></div>
          <div className="stats-strip__item"><div className="stats-strip__number" data-count="2">0</div><div className="stats-strip__label">Active research tracks</div></div>
          <div className="stats-strip__item"><div className="stats-strip__number" data-count="2024">0</div><div className="stats-strip__label">Founded in Singapore</div></div>
        </section>

        <section className="building" id="ventures">
          <div className="building__grid">
            <article className="feature-card reveal-up">
              <div className="feature-card__copy">
                <p className="section-tag">VENTURES</p>
                <h2>Enterprise AI. Rebuilt.</h2>
                <p>The best AI tools were made for developers. Enterprises got the leftovers. We&apos;re building the operating layer that was supposed to exist.</p>
              </div>
              <div className="systems-visual" aria-hidden="true"><canvas id="systemCanvas"></canvas></div>
            </article>

            <article className="feature-card reveal-up">
              <div className="feature-card__copy">
                <p className="section-tag">VENTURES</p>
                <h2>AI that looks like the people it talks to.</h2>
                <p>Our agents have faces. They speak Hindi, Malay, English and they remember what you said last time.</p>
              </div>
              <div className="avatar-grid" aria-label="Avatar placeholders">
                <div className="avatar-orb"><span>A1</span></div>
                <div className="avatar-orb"><span>A2</span></div>
                <div className="avatar-orb"><span>A3</span></div>
                <div className="avatar-orb"><span>A4</span></div>
                <div className="avatar-orb"><span>A5</span></div>
                <div className="avatar-orb"><span>A6</span></div>
              </div>
            </article>
          </div>
        </section>

        <section className="research" id="research">
          <div className="section-head reveal-up">
            <p className="section-tag">RESEARCH</p>
            <h2>What we&apos;re studying</h2>
          </div>
          <div className="research__grid">
            <article className="research-card reveal-up">
              <p className="research-card__tag">CONSUMER BEHAVIOUR</p>
              <h3>Why 4 billion people don&apos;t buy the way the internet thinks they do</h3>
              <p>Digital commerce assumes a buyer who reads product pages and compares prices. Most of the world buys through relationships.</p>
              <a href="#contact">Read the research -&gt;</a>
            </article>
            <article className="research-card reveal-up">
              <p className="research-card__tag">HEALTH AI</p>
              <h3>Can an AI agent change how someone manages their health?</h3>
              <p>Information alone doesn&apos;t change behaviour. Trust does. We&apos;re studying whether voice-based AI can close that gap.</p>
              <a href="#contact">Read the research -&gt;</a>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="footer__col"><p>EVAA Pte. Ltd.</p><p>Singapore · Est. 2024</p></div>
        <div className="footer__col footer__col--spacer" aria-hidden="true"></div>
        <div className="footer__col footer__col--right">
          <a className="footer__linkedin" href="#" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
              <path d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56A1.94 1.94 0 0 0 5.23 3a1.95 1.95 0 1 0 0 3.89 1.94 1.94 0 0 0 1.93-1.95ZM20 12.88c0-3.46-1.84-5.07-4.3-5.07a3.72 3.72 0 0 0-3.37 1.85V8.5H8.95c.04.77 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.13-.92.27-.68.9-1.38 1.96-1.38 1.38 0 1.93 1.04 1.93 2.57V20h3.37v-7.12Z" fill="currentColor" />
            </svg>
          </a>
          <a href="mailto:contact@evaa.enterprises">contact@evaa.enterprises</a>
        </div>
      </footer>

      <button
        id="chat-trigger"
        type="button"
        aria-label="Open chat"
        data-chat-open
        suppressHydrationWarning
      >
        <img src="/photos/avatar-loop.gif" alt="EVAA AI" id="avatar-gif" />
        <div id="trigger-pulse"></div>
      </button>

      <aside className="chatbot-modal" data-chatbot aria-hidden="true">
        <button className="chatbot-modal__close" type="button" aria-label="Close chat" data-chat-close>x</button>
        <div id="chat-video-wrapper">
          <video id="chat-video" src="/photos/chat-video.mp4" playsInline muted preload="auto"></video>
          <div id="video-vignette"></div>
          <div id="video-label">EVAA AI</div>
        </div>
        <div className="chatbot-modal__transcript" data-chat-transcript>
          <div className="chatbot-message chatbot-message--ai">Hi! I&apos;m EVAA&apos;s AI assistant. What would you like to know?</div>
        </div>
        <form className="chatbot-modal__input" data-chat-form>
          <input type="text" name="message" placeholder="Ask anything..." autoComplete="off" />
          <button type="submit" aria-label="Send message"><span>-&gt;</span></button>
        </form>
      </aside>
    </>
  );
}
