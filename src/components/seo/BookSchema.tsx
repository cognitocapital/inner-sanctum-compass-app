import { Helmet } from "react-helmet-async";

const BookSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "What a Journey",
    author: {
      "@type": "Person",
      name: "Michael Heron",
    },
    description:
      "An intimate account of recovering from a traumatic brain injury, finding new strength, and embracing life's unwritten chapters.",
    genre: ["Autobiography", "Health & Wellness"],
    numberOfPages: 21,
    inLanguage: "en",
    url: "https://whatajourney.lovable.app",
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default BookSchema;
