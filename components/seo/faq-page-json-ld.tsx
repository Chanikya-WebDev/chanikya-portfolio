import { siteConfig } from "@/lib/site-config";

export function FaqPageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is Chanikya?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Chanikya (also searched as Jale Chanikya, J Chanikya, and Chanikya Jale) is a B.Tech Computer Science student and full-stack developer building modern web and AI-powered solutions.",
        },
      },
      {
        "@type": "Question",
        name: "What technologies does Chanikya use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "This portfolio highlights projects built with Next.js, TypeScript, Supabase, and modern cloud deployment workflows.",
        },
      },
      {
        "@type": "Question",
        name: "How can I contact Chanikya for projects or internships?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Use the contact section on ${siteConfig.url} to send a message for internships, collaborations, or project opportunities.`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}