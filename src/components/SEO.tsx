
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
}

const SEO = ({
  title = "CarbonConstruct - Sustainable Carbon Management for Construction",
  description = "Track, manage, and reduce your construction project's carbon footprint with CarbonConstruct. The first SaaS platform designed specifically for construction sustainability.",
  canonical = "",
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  type = "website"
}: SEOProps) => {
  const siteUrl = window.location.origin;
  const siteTitle = "CarbonConstruct";
  const fullTitle = title !== siteTitle ? `${title} | ${siteTitle}` : title;
  const url = canonical ? `${siteUrl}${canonical}` : window.location.href;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="CarbonConstruct" />
    </Helmet>
  );
};

export default SEO;
