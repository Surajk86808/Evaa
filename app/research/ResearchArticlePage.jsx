const downloadIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3v11m0 0 4-4m-4 4-4-4M5 19h14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function renderSection(section) {
  if (section.type === "findings") {
    return (
      <section className="research-article-section" key={section.title}>
        <p className="research-article-section__label">{section.label}</p>
        <h2 className="research-article-section__title">{section.title}</h2>
        <div className="research-article-findings">
          {section.items.map((item) => (
            <article className="research-article-finding" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "list") {
    return (
      <section className="research-article-section" key={section.title}>
        <p className="research-article-section__label">{section.label}</p>
        <h2 className="research-article-section__title">{section.title}</h2>
        <div className="research-article-section__content">
          <ul className="research-article-section__list">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (section.type === "references") {
    return (
      <section className="research-article-section" key={section.title}>
        <p className="research-article-section__label">{section.label}</p>
        <h2 className="research-article-section__title">{section.title}</h2>
        <div className="research-article-section__content">
          <ol className="research-article-references">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className="research-article-section" key={section.title}>
      <p className="research-article-section__label">{section.label}</p>
      <h2 className="research-article-section__title">{section.title}</h2>
      <div className="research-article-section__content">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export default function ResearchArticlePage({ article }) {
  return (
    <main className="research-article-page">
      <header className="research-nav">
        <a href="/" className="research-nav__brand">
          EVAA
        </a>
        <a href="/#research" className="research-nav__back">
          Back to research
        </a>
      </header>

      <section className="research-article-hero">
        <div className="research-article-hero__inner">
          <div className="research-article-hero__content">
            <p className="research-article-hero__eyebrow">{article.category}</p>
            <h1 className="research-article-hero__title">{article.title}</h1>
            <p className="research-article-hero__subtitle">{article.subtitle}</p>
            <div className="research-article-hero__meta">
              {article.tags.map((tag) => (
                <span className="research-article-hero__tag" key={tag}>
                  {tag}
                </span>
              ))}
              <span className="research-article-hero__tag">{article.publicationDate}</span>
              <span className="research-article-hero__tag">{article.author}</span>
            </div>
          </div>

          <aside className="research-article-hero__fact" aria-label="Research highlight">
            <div className="research-article-hero__fact-value">{article.heroStat.value}</div>
            <div className="research-article-hero__fact-label">{article.heroStat.label}</div>
          </aside>
        </div>
      </section>

      <div className="research-article-shell">
        <div className="research-article-body">
          <article className="research-article-main">
            <section className="research-article-abstract">
              <p>{article.abstract}</p>
            </section>
            {article.sections.map(renderSection)}
          </article>

          <aside className="research-article-actions">
            <div className="research-article-actions__panel">
              <p className="research-article-actions__eyebrow">Research document</p>
              <a
                className="research-article-actions__button"
                href={article.pdfPath}
                target="_blank"
                rel="noreferrer"
              >
                {downloadIcon}
                <span>Open PDF</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
