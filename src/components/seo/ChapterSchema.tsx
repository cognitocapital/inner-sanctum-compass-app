import { Helmet } from "react-helmet-async";

interface ChapterSchemaProps {
  title: string;
  path: string;
  datePublished?: string;
}

const ChapterSchema = ({ title, path, datePublished = "2025-02-22" }: ChapterSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    author: { "@type": "Person", "name": "Michael Heron" },
    publisher: {
      "@type": "Organization",
      "name": "What a Journey",
      "logo": {
        "@type": "ImageObject",
        "url": "https://whatajourney.app/apple-touch-icon.png",
      },
    },
    datePublished,
    isPartOf: {
      "@type": "Book",
      name: "What a Journey",
      author: { "@type": "Person", "name": "Michael Heron" },
    },
    mainEntityOfPage: `https://whatajourney.app${path}`,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default ChapterSchema;