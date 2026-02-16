import { Helmet } from "react-helmet-async";

const SITE_URL = "https://whatajourney.lovable.app";
const DEFAULT_IMAGE = `${SITE_URL}/lovable-uploads/5d3e9ae0-c18d-4e9a-9d2b-95582494f6bd.png`;

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string;
}

const SEOHead = ({ title, description, path, image = DEFAULT_IMAGE }: SEOHeadProps) => {
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="What a Journey" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEOHead;
