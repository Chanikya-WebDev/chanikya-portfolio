"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-800/70 bg-zinc-950/65 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={resolveHref("#home")} className="font-mono text-sm tracking-widest text-zinc-100">
          CHANIKYA.DEV
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={resolveHref(item.href)}
              onClick={() => {
                if (item.href.startsWith("#")) {
                  setActiveSection(item.href.replace("#", ""));
                }
              }}
              className={`text-sm transition ${
                item.href.startsWith("#") && activeSection === item.href.replace("#", "")
                  ? "text-zinc-50"
                  : "text-zinc-300 hover:text-zinc-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-200"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {isOpen ? (
        <div id="mobile-nav" className="border-t border-zinc-800 bg-transparent px-4 pb-4 pt-2 md:hidden">
          <ul className="space-y-2">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={resolveHref(item.href)}
                  className="block rounded-md px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-900"
                  onClick={() => {
                    if (item.href.startsWith("#")) {
                      setActiveSection(item.href.replace("#", ""));
                    }
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
