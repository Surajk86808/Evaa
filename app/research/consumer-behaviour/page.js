export const metadata = {
  title: "Consumer Behaviour Research | EVAA",
  description: "Why 4 billion people don't buy the way the internet thinks they do."
};

import "../research.css";

export default function ConsumerBehaviourResearchPage() {
  return (
    <>
      <main style={styles.page}>
        <header className="research-nav" style={styles.nav}>
          <a href="/" style={styles.brand}>
            EVAA
          </a>
          <a href="/#research" style={styles.backLink}>
            ← RESEARCH
          </a>
        </header>

        <section className="research-hero" style={styles.hero}>
          <div className="research-hero-inner" style={styles.heroInner}>
            <div style={styles.heroCopy}>
              <p style={styles.eyebrow}>CONSUMER BEHAVIOUR</p>
              <h1 className="research-heading" style={styles.heading}>
                Why 4 billion people don&apos;t buy the way the internet thinks they do
              </h1>
              <div style={styles.divider}></div>
              <p style={styles.body}>
                Digital commerce was built for a buyer who reads product pages, compares
                prices, and checks reviews. But most of the world buys through
                relationships — trust, familiarity, and community. We are studying how AI
                can work with that reality, not against it.
              </p>
              <div className="research-cta-row" style={styles.ctaRow}>
                <a className="cta-link" href="/pdf/consumer-behaviour-research.pdf" target="_blank" rel="noreferrer" style={styles.primaryButton}>
                  VIEW PDF
                </a>
                <a className="cta-link" href="/" style={styles.secondaryButton}>
                  ← BACK TO EVAA
                </a>
              </div>
            </div>
            <div style={styles.heroVoid} aria-hidden="true"></div>
          </div>
        </section>

        <section className="research-pdf" style={styles.pdfSection}>
          <p style={styles.pdfLabel}>FULL RESEARCH DOCUMENT</p>
          <div className="research-iframe-shell" style={styles.iframeShell}>
            <iframe
              src="/pdf/consumer-behaviour-research.pdf"
              title="Consumer Behaviour Research PDF"
              style={styles.iframe}
            />
          </div>
        </section>
      </main>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000000",
    color: "#ffffff",
    fontFamily: '"DM Sans", sans-serif'
  },
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: "72px",
    padding: "0 48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.9)",
    backdropFilter: "blur(18px)"
  },
  brand: {
    color: "#ffffff",
    fontSize: "22px",
    letterSpacing: "6px",
    fontWeight: 300
  },
  backLink: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "12px",
    letterSpacing: "3px",
    textTransform: "uppercase"
  },
  hero: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    padding: "72px 80px 80px"
  },
  heroInner: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.15fr) minmax(180px, 0.85fr)",
    gap: "48px",
    alignItems: "center"
  },
  heroCopy: {
    maxWidth: "720px"
  },
  heroVoid: {
    minHeight: "320px"
  },
  eyebrow: {
    margin: "0 0 24px",
    fontSize: "11px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)"
  },
  heading: {
    margin: 0,
    fontFamily: '"Playfair Display", serif',
    fontSize: "clamp(42px,5vw,72px)",
    fontWeight: 300,
    lineHeight: 1.08,
    maxWidth: "720px"
  },
  divider: {
    width: "80px",
    height: "1px",
    margin: "40px 0",
    background: "rgba(255,255,255,0.1)"
  },
  body: {
    margin: 0,
    maxWidth: "560px",
    fontSize: "17px",
    lineHeight: 1.8,
    color: "rgba(255,255,255,0.6)"
  },
  ctaRow: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "40px"
  },
  primaryButton: {
    padding: "12px 28px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#ffffff",
    background: "transparent",
    fontSize: "12px",
    letterSpacing: "3px",
    textTransform: "uppercase"
  },
  secondaryButton: {
    padding: "12px 28px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "rgba(255,255,255,0.4)",
    background: "transparent",
    fontSize: "12px",
    letterSpacing: "3px",
    textTransform: "uppercase"
  },
  pdfSection: {
    padding: "0 80px 120px"
  },
  pdfLabel: {
    margin: "0 0 16px",
    fontSize: "11px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.25)"
  },
  iframeShell: {
    width: "100%",
    height: "80vh",
    overflow: "hidden",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#0a0a0a"
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "0"
  }
};
