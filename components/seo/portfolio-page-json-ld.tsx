import { siteConfig } from "@/lib/site-config";

export function PortfolioPageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${siteConfig.author.name} Portfolio`,
    description: siteConfig.description,
    url: siteConfig.url,
    mainEntity: {
      "@type": "Person",
      name: siteConfig.author.name,
      alternateName: siteConfig.author.alternateName,
      jobTitle: siteConfig.author.jobTitle,
      url: siteConfig.url,
      sameAs: [siteConfig.socials.github, siteConfig.socials.linkedin],
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