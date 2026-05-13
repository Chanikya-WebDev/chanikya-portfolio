import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { PersonJsonLd } from "@/components/seo/person-json-ld";
import { WebsiteJsonLd } from "@/components/seo/website-json-ld";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/profile.jpg",
    apple: "/profile.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: "/profile.jpg",
        width: 400,
        height: 400,
        alt: `${siteConfig.name} portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/profile.jpg"],
    creator: siteConfig.socials.x,
  },
  other: {
    "google-site-verification": "nxv4vOA0gaQn4KzMPfZkoFVVkgn45XHDetrjozTDfc4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("dark", "h-full", "antialiased", "font-sans", inter.variable)}
    >
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XRPRTW6QQK"
          strategy="lazyOnload"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XRPRTW6QQK', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground transition-colors duration-200">
        <PersonJsonLd />
        <WebsiteJsonLd />
        {children}
      </body>
    </html>
  );
}
