"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Terminal, ShieldAlert, Zap, Play, RotateCcw, BookOpen } from "lucide-react";
import { textVariants } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type GameState = "start" | "playing" | "gameover";

interface Target {
  id: number;
  text: string;
  x: number;
  y: number;
}

const DICTIONARY = [
  // IPs
  "192.168.1.100",
  "10.0.0.1",
  "172.16.0.5",
  "192.168.0.50",
  // Emails
  "admin@archlinux.org",
  "user@gmail.com",
  "dev@example.com",
  "contact@test.io",
  // Hex Colors
  "#ff0022",
  "#1a2b3c",
  "#a1b2c3",
  "#ff00ff",
  // HTML
  "<div>",
  "</span>",
  "<section>",
  "</p>",
  // CLI Commands
  "sudo pacman -Syu",
  "rm -rf /",
  "git commit -m",
  "npm install",
];

const BANNED_PATTERNS = [".*", ".+"];
const SPAWN_INTERVAL = 3000;
const PHYSICS_INTERVAL = 50;
const MAX_LIVES = 3;
const BREACH_Y = 95;
const FALL_SPEED = 0.18;
const MAX_ACTIVE_TARGETS = 6;
const PERSONAL_BEST_KEY = "regex-invaders-personal-best";

export function RegexGame() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [showRules, setShowRules] = useState(false);
  const [personalBest, setPersonalBest] = useState<number>(() => {
    if (typeof window === "undefined") {
      return 0;
    }

    const stored = window.localStorage.getItem(PERSONAL_BEST_KEY);
    const parsed = Number(stored ?? "0");
    return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
  });
  const [globalBest, setGlobalBest] = useState<number | null>(null);
  const [globalEnabled, setGlobalEnabled] = useState(false);
  const targetIdRef = useRef(1);

  useEffect(() => {
    let cancelled = false;

    async function loadGlobalBest() {
      try {
        const response = await fetch("/api/regex-score", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          enabled?: boolean;
          globalBest?: number | null;
        };

        if (cancelled) {
          return;
        }

        setGlobalEnabled(Boolean(payload.enabled));
        setGlobalBest(typeof payload.globalBest === "number" ? payload.globalBest : null);
      } catch {
        // Optional endpoint, safe to ignore.
      }
    }

    loadGlobalBest();
    return () => {
      cancelled = true;
    };
  }, []);

  // Spawn targets at regular intervals
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawner = setInterval(() => {
      setTargets((prev) => {
        if (prev.length >= MAX_ACTIVE_TARGETS) return prev;
        const newTarget: Target = {
          id: targetIdRef.current++,
          text: DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)],
          x: 10 + Math.random() * 80,
          y: -5,
        };
        return [...prev, newTarget];
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(spawner);
  }, [gameState]);

  // Physics loop: move targets down
  useEffect(() => {
    if (gameState !== "playing") return;

    const physics = setInterval(() => {
      setTargets((prev) => {
        let breached = 0;
        const remaining: Target[] = [];

        for (const item of prev) {
          const nextY = item.y + FALL_SPEED;
          if (nextY >= BREACH_Y) {
            breached += 1;
            continue;
          }
          remaining.push({ ...item, y: nextY });
        }

        if (breached > 0) {
          setLives((l) => {
            const newLives = Math.max(0, l - breached);
            if (newLives === 0) {
              setGameState("gameover");
            }
            return newLives;
          });
        }
        return remaining;
      });
    }, PHYSICS_INTERVAL);

    return () => clearInterval(physics);
  }, [gameState]);

  const trimmedInput = input.trim();
  const isBanned = BANNED_PATTERNS.includes(trimmedInput);
  const regex = useMemo(() => {
    if (gameState !== "playing" || trimmedInput === "" || isBanned) {
      return null;
    }
    try {
      return new RegExp(`^${trimmedInput}$`);
    } catch {
      return null;
    }
  }, [gameState, isBanned, trimmedInput]);

  const syntaxError = gameState === "playing" && trimmedInput !== "" && !isBanned && !regex;

  const highlightedIds = useMemo(() => {
    if (!regex) {
      return new Set<number>();
    }
    const ids = new Set<number>();
    for (const target of targets) {
      if (regex.test(target.text)) {
        ids.add(target.id);
      }
    }
    return ids;
  }, [regex, targets]);

  async function updateGlobalBest(nextScore: number) {
    try {
      const response = await fetch("/api/regex-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score: nextScore }),
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as {
        enabled?: boolean;
        globalBest?: number | null;
      };

      setGlobalEnabled(Boolean(payload.enabled));
      if (typeof payload.globalBest === "number") {
        setGlobalBest(payload.globalBest);
      }
    } catch {
      // Optional endpoint, ignore errors.
    }
  }

  const handleFire = () => {
    if (gameState !== "playing") return;
    if (!trimmedInput) return;

    if (isBanned) {
      setError("Too broad! Banned Regex.");
      return;
    }

    if (!regex) {
      setError("Syntax Error");
      return;
    }

    const killCount = highlightedIds.size;
    if (killCount > 0) {
      const multiplier = killCount > 1 ? 1 + (killCount - 1) * 0.25 : 1;
      const points = Math.round(100 * killCount * multiplier);
      setScore((s) => s + points);
      setTargets((prev) => prev.filter((target) => !regex.test(target.text)));
    }

    setInput("");
    setError(null);
  };

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setLives(MAX_LIVES);
    setInput("");
    setError(null);
    setTargets([]);
  };

  const resetGame = () => {
    if (score > personalBest) {
      setPersonalBest(score);
      try {
        window.localStorage.setItem(PERSONAL_BEST_KEY, String(score));
      } catch {
        // Ignore localStorage failures.
      }
    }

    void updateGlobalBest(score);

    setGameState("start");
    setScore(0);
    setLives(MAX_LIVES);
    setInput("");
    setError(null);
    setTargets([]);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col bg-slate-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Terminal className="h-5 w-5 text-cyan-400" />
            <div>
              <p className={cn(textVariants({ role: "label" }), "font-mono tracking-widest text-cyan-400")}>
                REGEX INVADERS
              </p>
              <p className={cn(textVariants({ role: "metadata" }), "text-slate-400")}>Defend against falling strings</p>
            </div>
          </div>
          <button
            onClick={() => setShowRules(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            title="View game rules"
            aria-label="View game rules"
          >
            <BookOpen className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* HUD - Game stats */}
      {gameState !== "start" && (
        <div className="border-b border-slate-800 bg-slate-900/30 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className={cn(textVariants({ role: "label" }), "text-zinc-100")}>{score}</span>
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <ShieldAlert
                  key={i}
                  className={`h-4 w-4 transition-colors ${
                    i < lives ? "text-red-400" : "text-slate-700"
                  }`}
                />
              ))}
            </div>
            <div className={cn(textVariants({ role: "label" }), "text-slate-300")}>Personal Best: {personalBest}</div>
            <div className={cn(textVariants({ role: "label" }), "text-slate-300")}>
              Global Best: {globalEnabled ? (globalBest ?? 0) : "Unavailable"}
            </div>
          </div>
        </div>
      )}

      {/* Game Container */}
      {gameState === "start" && (
        <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
          <div className="max-w-xl text-center">
            <h1 className={cn(textVariants({ role: "hero-title" }), "mb-4 text-cyan-400")}>
              REGEX INVADERS
            </h1>
            <p className={cn(textVariants({ role: "body" }), "mb-6 text-zinc-300")}>
              Type regex patterns to destroy falling strings. Match the entire
              string with precision. Defend against breaches!
            </p>
            <button
              onClick={startGame}
              className={cn(textVariants({ role: "label" }), "inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-4 text-white transition hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950")}
            >
              <Play className="h-4 w-4" />
              Start Game
            </button>
          </div>
        </div>
      )}

      {gameState === "playing" && (
        <>
          {/* Game Arena */}
          <div className="relative flex-1 overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900">
            {/* Grid background */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(0deg, #04f 1px, transparent 1px), linear-gradient(90deg, #04f 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />
            </div>

            {/* Targets */}
            {targets.map((target) => (
              <div
                key={target.id}
                className={`absolute transition-all ${
                  highlightedIds.has(target.id)
                    ? "scale-105 text-red-400"
                    : "text-zinc-300"
                }`}
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className={cn(
                    textVariants({ role: "label" }),
                    `whitespace-nowrap rounded border px-4 py-2 font-mono ${
                    highlightedIds.has(target.id)
                      ? "border-red-500/50 bg-red-950/40 shadow-lg shadow-red-500/20"
                      : "border-slate-700 bg-slate-900/50 shadow-sm"
                    }`,
                  )}
                >
                  {target.text}
                </div>
              </div>
            ))}

            {/* Breach line warning */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-900/50 to-red-900/50" />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-800 bg-slate-900/95 px-4 py-4 sm:px-6">
            <div className="mx-auto max-w-2xl space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                <span className={cn(textVariants({ role: "label" }), "font-mono text-slate-500")}>/</span>
                <span className={cn(textVariants({ role: "label" }), "font-mono text-slate-500")}>^</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFire();
                    }
                  }}
                  placeholder="Type regex pattern..."
                  className={cn(
                    textVariants({ role: "body" }),
                    "min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-800 px-4 py-2 font-mono text-zinc-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30",
                  )}
                  autoFocus
                />
                <span className={cn(textVariants({ role: "label" }), "font-mono text-slate-500")}>$</span>
                <span className={cn(textVariants({ role: "label" }), "font-mono text-slate-500")}>/</span>
              </div>

              {error ? (
                <div className={cn(textVariants({ role: "metadata" }), "text-red-400")}>
                  {error}
                </div>
              ) : null}

              {syntaxError ? (
                <div className={cn(textVariants({ role: "metadata" }), "text-red-400")}>Syntax Error</div>
              ) : null}

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handleFire}
                  className={cn(textVariants({ role: "label" }), "rounded-md bg-cyan-600 px-4 py-2 text-white transition hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900")}
                >
                  Fire
                </button>
                <div className={cn(textVariants({ role: "label" }), "text-slate-400")}>
                  {highlightedIds.size > 0
                    ? `${highlightedIds.size} target${
                        highlightedIds.size > 1 ? "s" : ""
                      } highlighted`
                    : "Enter to fire"}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {gameState === "gameover" && (
        <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
          <div className="text-center">
            <h2 className={cn(textVariants({ role: "section-title" }), "mb-4 text-red-400")}>GAME OVER</h2>
            <p className={cn(textVariants({ role: "body" }), "mb-2 text-zinc-300")}>Final Score</p>
            <p className={cn(textVariants({ role: "hero-title" }), "mb-8 text-amber-400")}>{score}</p>
            <button
              onClick={resetGame}
              className={cn(textVariants({ role: "label" }), "inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-4 text-white transition hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950")}
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRules && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowRules(false)}
          role="presentation"
        >
          <section
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 text-zinc-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Game rules"
          >
            <h2 className={cn(textVariants({ role: "section-title" }), "mb-4 text-cyan-400")}>How to Play</h2>
            
            <div className={cn(textVariants({ role: "body" }), "space-y-4")}>
              <div>
                <h3 className={cn(textVariants({ role: "label" }), "mb-2 text-zinc-200")}>📍 Objective</h3>
                <p className="text-slate-300">Type regex patterns to destroy falling strings before they reach the bottom.</p>
              </div>

              <div>
                <h3 className={cn(textVariants({ role: "label" }), "mb-2 text-zinc-200")}>📋 Example Regex Patterns</h3>
                <ul className={cn(textVariants({ role: "body" }), "space-y-2 font-mono text-slate-300")}>
                  <li><code className="rounded bg-slate-800 px-2 py-2">\d+\.\d+\.\d+\.\d+</code> - Matches IP addresses</li>
                  <li><code className="rounded bg-slate-800 px-2 py-2">.*@gmail\.com</code> - Matches Gmail addresses</li>
                  <li><code className="rounded bg-slate-800 px-2 py-2">#[0-9a-f]{'{'}{6}{'}'}</code> - Matches hex colors</li>
                  <li><code className="rounded bg-slate-800 px-2 py-2">&lt;.*&gt;</code> - Matches HTML tags</li>
                </ul>
              </div>

              <div>
                <h3 className={cn(textVariants({ role: "label" }), "mb-2 text-zinc-200")}>⚠️ Banned Patterns</h3>
                <p className="text-slate-300">Patterns like <code className="rounded bg-red-950 px-2 py-2">.*</code> and <code className="rounded bg-red-950 px-2 py-2">.+</code> are blocked. Be precise.</p>
              </div>

              <div>
                <h3 className={cn(textVariants({ role: "label" }), "mb-2 text-zinc-200")}>🎯 Scoring</h3>
                <p className="text-slate-300">Destroy 1 target = 100 points. Multi-kills get a 1.25x bonus per extra target.</p>
              </div>

              <div>
                <h3 className={cn(textVariants({ role: "label" }), "mb-2 text-zinc-200")}>❤️ Lives</h3>
                <p className="text-slate-300">You start with 3 lives. Lose all to trigger Game Over.</p>
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className={cn(textVariants({ role: "label" }), "mt-6 w-full rounded-lg bg-zinc-100 px-4 py-2 text-zinc-900 transition hover:bg-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900")}
            >
              Close
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
