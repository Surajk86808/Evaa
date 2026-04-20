import { notFound } from "next/navigation";
import "../research.css";
import ResearchArticlePage from "../ResearchArticlePage";
import { RESEARCH_DATA, RESEARCH_SLUGS } from "../researchData";

export function generateStaticParams() {
  return RESEARCH_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = RESEARCH_DATA[slug];

  if (!article) {
    return {
      title: "Research Not Found | EVAA"
    };
  }

  return {
    title: article.metaTitle,
    description: article.metaDescription
  };
}

export default async function ResearchDetailPage({ params }) {
  const { slug } = await params;
  const article = RESEARCH_DATA[slug];

  if (!article) {
    notFound();
  }

  return <ResearchArticlePage article={article} />;
}
