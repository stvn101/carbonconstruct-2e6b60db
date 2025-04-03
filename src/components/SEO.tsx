
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  keywords?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: Record<string, any>;
  twitterCardType?: "summary" | "summary_large_image" | "app" | "player";
  twitterSite?: string;
  twitterCreator?: string;
  ogLocale?: string;
}

const SEO = ({
  title = "CarbonConstruct - Sustainable Carbon Management for Construction",
  description = "Track, manage, and reduce your construction project's carbon footprint with CarbonConstruct. The first SaaS platform designed specifically for construction sustainability.",
  canonical = "",
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  type = "website",
  keywords = "sustainable construction, carbon footprint, construction management, green building, carbon tracking, sustainability",
  author = "CarbonConstruct",
  publishedDate,
  modifiedDate,
  noIndex = false,
  noFollow = false,
  structuredData,
  twitterCardType = "summary_large_image",
  twitterSite = "@CarbonConstruct",
  twitterCreator = "@CarbonConstruct",
  ogLocale = "en_US"
}: SEOProps) => {
  const siteUrl = window.location.origin;
  const siteTitle = "CarbonConstruct";
  const fullTitle = title !== siteTitle ? `${title} | ${siteTitle}` : title;
  const url = canonical ? `${siteUrl}${canonical}` : window.location.href;

  // Create default structured data if none provided
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": type === "website" ? "WebSite" : "WebPage",
    "name": fullTitle,
    "description": description,
    "url": url,
    "image": image,
    "publisher": {
      "@type": "Organization",
      "name": siteTitle,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/favicon.ico`
      }
    },
    ...(publishedDate && { "datePublished": publishedDate }),
    ...(modifiedDate && { "dateModified": modifiedDate })
  };

  const finalStructuredData = structuredData || defaultStructuredData;
  const robotsContent = `${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}, max-image-preview:large, max-snippet:-1, max-video-preview:-1`;

  // Track page view when component mounts or route changes
  useEffect(() => {
    // Facebook Pixel pageview tracking
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
    
    // Google Analytics pageview tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: fullTitle,
        page_location: url,
        page_path: window.location.pathname,
      });
    }
    
    // Log page view for debugging
    console.log(`Page viewed: ${fullTitle}`);
  }, [url, fullTitle]);

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Structured Data / JSON-LD for better SEO */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content={ogLocale} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:site" content={twitterSite} />

      {/* Additional SEO */}
      <meta name="robots" content={robotsContent} />
      <meta name="apple-mobile-web-app-title" content={siteTitle} />
      <meta name="application-name" content={siteTitle} />
      <meta name="msapplication-TileColor" content="#38a169" />
      <meta name="theme-color" content="#38a169" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
};

export default SEO;
