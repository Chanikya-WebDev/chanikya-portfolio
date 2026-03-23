# Chanikya Portfolio

High-performance portfolio built with Next.js App Router, Supabase, and Resend.

## Stack

- Next.js 16 App Router + TypeScript strict mode
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Tailwind CSS v4
- Resend for contact email delivery
- Structured data (Person, WebSite, ProfilePage, FAQPage, SoftwareApplication)
- Cloudflare Pages deployment target

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy environment template and fill values:

```bash
cp .env.example .env.local
```

3. Start dev server:

```bash
npm run dev
```

4. Run lint:

```bash
npm run lint
```

5. Optional: run production build:

```bash
npm run pages:build
```

## Environment Variables

- `NEXT_PUBLIC_SITE_URL`: Public canonical site URL.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon public key.
- `RESEND_API_KEY`: Resend API key.
- `CONTACT_TO_EMAIL`: Destination inbox for contact form submissions.
- `CONTACT_FROM_EMAIL`: Sender identity for Resend.

## Structured Data

The app includes JSON-LD structured data for SEO in:

- `Person` (site owner identity)
- `WebSite` (site-level metadata)
- `ProfilePage` (home page)
- `FAQPage` (home page)
- `SoftwareApplication` (regex game page)

## Cloudflare Pages Deployment

This project is set up for Cloudflare Pages deployment with the Next.js framework preset.

### Build Command (Cloudflare Pages)

Use the following build command in Cloudflare Pages:

```bash
npm run pages:build
```

### Cloudflare Pages Settings

- Framework preset: `Next.js`
- Build command: `npm run pages:build`
- Build output directory: leave default for the preset
- Node.js compatibility: 20+

### Runtime Notes

- Public home route (`app/page.tsx`) runs with `runtime = "edge"` for lower latency.
- Contact route (`app/api/contact/route.ts`) is edge-compatible and uses Resend SDK.
- Projects are read via `unstable_cache` (`lib/projects.ts`) with timed revalidation for fast repeat loads.
- Admin mutations use Server Actions and `revalidatePath("/")` to refresh visible content quickly.
