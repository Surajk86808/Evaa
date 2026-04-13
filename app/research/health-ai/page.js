export const metadata = {
  title: "Health AI Research | EVAA",
  description: "Can an AI agent change how someone manages their health?"
};

export default function HealthAiResearchPage() {
  return (
    <main className="pdf-page">
      <header className="pdf-page__header">
        <a className="pdf-page__back" href="/#research">
          Back to EVAA
        </a>
        <div className="pdf-page__copy">
          <p className="pdf-page__eyebrow">Health AI</p>
          <h1>Can an AI agent change how someone manages their health?</h1>
        </div>
      </header>

      <section className="pdf-page__viewer">
        <iframe
          src="/pdf/health-ai-research.pdf"
          title="Health AI Research PDF"
        />
      </section>
    </main>
  );
}
