import { siteConfig } from "@/lib/site-config";

export function RegexGameJsonLd() {
  const pageUrl = `${siteConfig.url}/regex`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Regex Invaders",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: pageUrl,
    description:
      "Interactive regex game where players destroy falling strings using precise regular expression patterns.",
    creator: {
      "@type": "Person",
      name: siteConfig.author.name,
      alternateName: siteConfig.author.alternateName,
      url: siteConfig.url,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Regex Invaders",
          item: pageUrl,
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}