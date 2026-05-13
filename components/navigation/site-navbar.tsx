"use client";

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { textVariants } from "@/components/ui/typography";
import { mobileMenu, motionStyle, navbarReveal, revealItem, subtleLift, subtlePress } from "@/lib/motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "/regex", label: "Game" },
  { href: "#contact", label: "Contact" },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sectionIds = navLinks
      .filter((item) => item.href.startsWith("#"))
      .map((item) => item.href.replace("#", ""))
      .filter((id) => id !== "home");
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((value): value is HTMLElement => Boolean(value));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
          document.body.dataset.activeSection = visible.target.id;
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));

    const handleScroll = () => {
      if (window.scrollY < 80) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      delete document.body.dataset.activeSection;
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const hash = window.location.hash.replace("#", "");
    if (!hash) {
      return;
    }

    const target = document.getElementById(hash);
    if (!target) {
      return;
    }

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [pathname]);

  function resolveHref(href: string) {
    if (!href.startsWith("#")) {
      return href;
    }

    if (pathname === "/") {
      return href;
    }

    return `/${href}`;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.header
        initial={shouldReduceMotion ? false : "hidden"}
        animate={shouldReduceMotion ? undefined : "visible"}
        variants={navbarReveal}
        style={motionStyle}
        className="fixed inset-x-0 top-0 z-40 border-b border-zinc-800/70 bg-zinc-950/72 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl"
      >
        <a
          href="#home"
          className="absolute -top-20 left-4 z-50 rounded bg-zinc-900 px-3 py-2 text-sm text-white transition-all focus:top-4 focus:outline-none"
        >
          Skip to content
        </a>
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href={resolveHref("/")}
            aria-label="Go to homepage"
            className={cn(textVariants({ role: "metadata" }), "font-mono tracking-widest text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950")}
          >
            <m.span
              whileHover={shouldReduceMotion ? undefined : subtleLift}
              className="inline-block text-lg sm:text-xl md:text-2xl font-semibold"
              style={motionStyle}
            >
              CHANIKYA
            </m.span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={resolveHref(item.href)}
                prefetch={item.href === "/regex" ? false : undefined}
                aria-current={
                  item.href.startsWith("#")
                    ? activeSection === item.href.replace("#", "")
                      ? "page"
                      : undefined
                    : pathname === item.href
                      ? "page"
                      : undefined
                }
                onClick={() => {
                  if (item.href.startsWith("#")) {
                    setActiveSection(item.href.replace("#", ""));
                  }
                }}
                className={cn(textVariants({ role: "label" }), `transition-colors ${
                  (item.href.startsWith("#") && activeSection === item.href.replace("#", "")) || pathname === item.href
                    ? "text-zinc-50"
                    : "text-zinc-300 hover:text-zinc-50"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950`)}
              >
                <m.span
                  whileHover={shouldReduceMotion ? undefined : subtleLift}
                  className="inline-block"
                  style={motionStyle}
                >
                  {item.label}
                </m.span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <m.button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              whileHover={shouldReduceMotion ? undefined : subtleLift}
              whileTap={shouldReduceMotion ? undefined : subtlePress}
              style={motionStyle}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </m.button>
          </div>
        </nav>

        <AnimatePresence initial={false}>
          {isOpen ? (
            <m.div
              id="mobile-nav"
              initial={shouldReduceMotion ? undefined : "hidden"}
              animate={shouldReduceMotion ? undefined : "visible"}
              exit={shouldReduceMotion ? undefined : "exit"}
              variants={mobileMenu}
              style={motionStyle}
              className="border-t border-zinc-800 bg-zinc-950/88 px-4 py-4 shadow-[0_16px_48px_rgba(0,0,0,0.45)] md:hidden"
            >
              <ul className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-2">
                {navLinks.map((item) => (
                  <m.li key={item.href} variants={revealItem} style={motionStyle}>
                    <Link
                      href={resolveHref(item.href)}
                      prefetch={item.href === "/regex" ? false : undefined}
                      aria-current={
                        item.href.startsWith("#")
                          ? activeSection === item.href.replace("#", "")
                            ? "page"
                            : undefined
                          : pathname === item.href
                            ? "page"
                            : undefined
                      }
                      className={cn(textVariants({ role: "label" }), "block rounded-md px-4 py-3 text-zinc-200 transition-colors hover:bg-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900")}
                      onClick={() => {
                        if (item.href.startsWith("#")) {
                          setActiveSection(item.href.replace("#", ""));
                        }
                        setIsOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  </m.li>
                ))}
              </ul>
            </m.div>
          ) : null}
        </AnimatePresence>
      </m.header>
    </LazyMotion>
  );
}
