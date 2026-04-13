export const metadata = {
  title: "Consumer Behaviour Research | EVAA",
  description: "Why 4 billion people don't buy the way the internet thinks they do."
};

export default function ConsumerBehaviourResearchPage() {
  return (
    <main className="pdf-page">
      <header className="pdf-page__header">
        <a className="pdf-page__back" href="/#research">
          Back to EVAA
        </a>
        <div className="pdf-page__copy">
          <p className="pdf-page__eyebrow">Consumer Behaviour</p>
          <h1>Why 4 billion people don&apos;t buy the way the internet thinks they do</h1>
        </div>
      </header>

      <section className="pdf-page__viewer">
        <iframe
          src="/pdf/consumer-behaviour-research.pdf"
          title="Consumer Behaviour Research PDF"
        />
      </section>
    </main>
  );
}
