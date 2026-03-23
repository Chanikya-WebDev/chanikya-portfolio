import type { Project } from "@/lib/types";
import { siteConfig } from "@/lib/site-config";

type ProjectsItemListJsonLdProps = {
  projects: Project[];
};

export function ProjectsItemListJsonLd({ projects }: ProjectsItemListJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        url: project.demo_url || project.github_url || siteConfig.url,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
