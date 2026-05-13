import type { Metadata } from "next";
import { SiteNavbar } from "@/components/navigation/site-navbar";
import { DeferredRegexGame } from "@/components/regex/deferred-regex-game";
import { RegexGameJsonLd } from "@/components/seo/regex-game-json-ld";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Regex Invaders",
  description: "Interactive full-screen regex game. Destroy falling strings with precise regex patterns.",
  keywords: [
    ...siteConfig.keywords,
    "regex game",
    "interactive regex game",
    "regex invaders",
    "learn regex game",
    "regex practice",
    "chanikya regex game",
    "jale chanikya regex",
    "j chanikya regex",
  ],
  alternates: {
    canonical: "/regex",
  },
};

export default function RegexPage() {
  return (
    <>
      <SiteNavbar />
      <main className="pt-16">
        <DeferredRegexGame />
      </main>
      <RegexGameJsonLd />
    </>
  );
}
