"use client";

import { useEffect, useRef, useState } from "react";
import { useView } from "./ViewContext";
import { SpinnerLoader } from "./SpinnerLoader";
import { CodeBlock } from "./CodeBlock";

const easing = "cubic-bezier(0.4, 0, 0.2, 1)";
// Aggressive decel near the end — smooth landing
const smoothEasing = "cubic-bezier(0.22, 1, 0.36, 1)";

type Experience = {
  title: string;
  period: string;
  description: string[];
};

const EXPERIENCES: Experience[] = [
  {
    title: "Développeur Full Stack — Acme Corp",
    period: "2024 - Présent",
    description: [
      "Conception et développement d'une plateforme SaaS multi-tenant.",
      "Migration progressive d'une architecture monolithique vers des microservices.",
      "Mise en place d'une CI/CD complète avec GitHub Actions et déploiements canary.",
      "Encadrement de 3 développeurs juniors et revues de code quotidiennes.",
    ],
  },
  {
    title: "Lead Frontend — Studio Pixel",
    period: "2022 - 2024",
    description: [
      "Refonte complète de l'application principale en Next.js et TypeScript.",
      "Création d'une bibliothèque de composants partagée utilisée sur 5 projets.",
      "Optimisation des performances : Lighthouse 100 sur les pages critiques.",
    ],
  },
  {
    title: "Développeur React — Helios Tech",
    period: "2020 - 2022",
    description: [
      "Développement d'un dashboard analytique en React + D3.js.",
      "Intégration de WebSockets pour les mises à jour temps réel.",
      "Réduction du bundle de 40% via code-splitting et lazy loading.",
      "Mise en place de tests E2E avec Cypress couvrant 80% des flows.",
      "Documentation technique et onboarding de l'équipe sur React Query.",
    ],
  },
  {
    title: "Freelance Web — Indépendant",
    period: "2018 - 2020",
    description: [
      "Conception de sites vitrines et e-commerce pour PME.",
      "Gestion complète du cycle projet : devis, design, dev, mise en ligne.",
    ],
  },
  {
    title: "Stage UI/UX — Design Lab",
    period: "2017 - 2018",
    description: [
      "Refonte de l'identité visuelle d'une application mobile B2B.",
      "Tests utilisateurs et itérations sur les wireframes.",
      "Création d'un design system documenté sous Figma.",
    ],
  },
];

const ITEM_STAGGER = 60;
const BASE_DELAY = 350;

// Used to estimate how many visual lines each description text will wrap to.
// Tune this if the available width or font-size changes.
const CHARS_PER_LINE = 52;
const LINE_HEIGHT_PX = 28;
const PANEL_PADDING_PX = 28;

const estimateLines = (text: string) =>
  Math.max(1, Math.ceil(text.length / CHARS_PER_LINE));

const computePanelHeight = (lines: string[]) => {
  const totalVisualLines = lines.reduce((sum, l) => sum + estimateLines(l), 0);
  return totalVisualLines * LINE_HEIGHT_PX + PANEL_PADDING_PX;
};

const ENTRY_TOTAL = BASE_DELAY + (EXPERIENCES.length - 1) * ITEM_STAGGER + 400;
const FIRST_WAVE_DELAY = 500; // ms after entry finishes
const MIN_INTERVAL = 350;
const MAX_INTERVAL = 700;

type ItemIcon = "spinner" | "diploma" | "job";

// Generate a partition of `total` items into waves of size 1-3,
// containing at most one wave of size 1.
function generateWaveSequence(total: number): number[] {
  // All valid partitions where at most one "1" is allowed
  const partitions: number[][] = [];

  const recurse = (remaining: number, current: number[], onesCount: number) => {
    if (remaining === 0) {
      partitions.push([...current]);
      return;
    }
    for (const size of [3, 2, 1]) {
      if (size > remaining) continue;
      const nextOnes = size === 1 ? onesCount + 1 : onesCount;
      if (nextOnes > 1) continue;
      current.push(size);
      recurse(remaining - size, current, nextOnes);
      current.pop();
    }
  };

  recurse(total, [], 0);

  // Pick one partition at random and shuffle its order
  const partition =
    partitions[Math.floor(Math.random() * partitions.length)] ?? [];
  return [...partition].sort(() => Math.random() - 0.5);
}

// Pick the `count` bottom-most adjacent indices still in "spinner".
// Transformations always happen from bottom to top.
function pickIndices(items: ItemIcon[], count: number): number[] {
  const spinners: number[] = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i] === "spinner") spinners.push(i);
  }
  // Take the last `count` (bottom-most)
  return spinners.slice(-count);
}

function pickRandomIcon(): "diploma" | "job" {
  return Math.random() < 0.5 ? "diploma" : "job";
}

export function CVView() {
  const { view } = useView();
  const isOpen = view === "cv";

  const [icons, setIcons] = useState<ItemIcon[]>(() =>
    EXPERIENCES.map(() => "spinner"),
  );
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    () => new Set(),
  );
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const toggleSelected = (i: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  // Reset to all spinners whenever we close
  useEffect(() => {
    if (!isOpen) {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
      setIcons(EXPERIENCES.map(() => "spinner"));
      setSelectedIndices(new Set());
    }
  }, [isOpen]);

  // Orchestrate the waves while open, using a pre-computed sequence
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    const currentIcons = EXPERIENCES.map(() => "spinner") as ItemIcon[];
    const sequence = generateWaveSequence(EXPERIENCES.length);
    let waveIndex = 0;

    const scheduleNextWave = (delay: number) => {
      const t = setTimeout(() => {
        if (cancelled) return;
        if (waveIndex >= sequence.length) return;

        const waveSize = sequence[waveIndex];
        waveIndex += 1;

        const indices = pickIndices(currentIcons, waveSize);
        indices.forEach((idx) => {
          currentIcons[idx] = pickRandomIcon();
        });

        setIcons([...currentIcons]);

        if (waveIndex < sequence.length) {
          const next =
            MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
          scheduleNextWave(next);
        }
      }, delay);
      timersRef.current.push(t);
    };

    scheduleNextWave(ENTRY_TOTAL + FIRST_WAVE_DELAY);

    return () => {
      cancelled = true;
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, [isOpen]);

  return (
    <div
      className="fixed inset-0 z-20 overflow-y-auto pointer-events-none"
      style={{
        opacity: isOpen ? 1 : 0,
        transition: isOpen
          ? `opacity 250ms ${easing} 250ms`
          : `opacity 180ms ${easing}`,
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <div className="w-full max-w-md mx-auto px-4 pt-[180px] pb-[180px] flex flex-col gap-1">
        {EXPERIENCES.map((exp, i) => {
          const enterDelay = BASE_DELAY + i * ITEM_STAGGER;
          const exitDelay = (EXPERIENCES.length - 1 - i) * 30;
          const icon = icons[i];

          const isSelected = selectedIndices.has(i);
          // Estimate visual lines from char count, since CodeLine wraps long phrases.
          const panelHeight = computePanelHeight(exp.description);
          return (
            <div
              key={exp.title}
              className="flex flex-col"
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateY(0)" : "translateY(-12px)",
                filter: isOpen ? "blur(0px)" : "blur(4px)",
                transition: isOpen
                  ? `opacity 350ms ${easing} ${enterDelay}ms, transform 400ms ${easing} ${enterDelay}ms, filter 350ms ${easing} ${enterDelay}ms`
                  : `opacity 180ms ${easing} ${exitDelay}ms, transform 250ms ${easing} ${exitDelay}ms, filter 180ms ${easing} ${exitDelay}ms`,
              }}
            >
              <div
                onClick={() => toggleSelected(i)}
                className={`flex flex-col px-2 py-2 rounded-xl cursor-pointer pointer-events-auto ${
                  isSelected
                    ? "bg-neutrallight-200/50 dark:bg-buttondark-900/30"
                    : "hover:bg-neutrallight-200/50 dark:hover:bg-buttondark-900/30"
                }`}
                style={{
                  transition: `background-color 200ms ${easing}`,
                }}
                // Border commented out for testing
                // className+= " border-[0.5px] border-neutrallight-300 dark:border-borderdark-900"
              >
                <div className="flex items-center gap-3">
                  {/* Icon area — morphs from spinner to diploma/job */}
                  <div className="shrink-0 relative w-5 h-5 flex items-center justify-center">
                    {/* Spinner layer */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        opacity: icon === "spinner" ? 1 : 0,
                        transform: icon === "spinner" ? "scale(1)" : "scale(0)",
                        transition: `opacity 180ms ${easing}, transform 220ms ${easing}`,
                      }}
                    >
                      <SpinnerLoader size="sm" colorScheme="neutral" />
                    </div>

                    {/* Diploma layer */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        opacity: icon === "diploma" ? 1 : 0,
                        transform: icon === "diploma" ? "scale(1)" : "scale(0)",
                        transition:
                          icon === "diploma"
                            ? `opacity 220ms ${easing} 80ms, transform 280ms ${easing} 80ms`
                            : `opacity 180ms ${easing}, transform 220ms ${easing}`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/CorpIcon/diploma.svg"
                        alt="Formation"
                        className="w-4 h-4 custom-icon"
                      />
                    </div>

                    {/* Job layer */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        opacity: icon === "job" ? 1 : 0,
                        transform: icon === "job" ? "scale(1)" : "scale(0)",
                        transition:
                          icon === "job"
                            ? `opacity 220ms ${easing} 80ms, transform 280ms ${easing} 80ms`
                            : `opacity 180ms ${easing}, transform 220ms ${easing}`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/CorpIcon/job.svg"
                        alt="Expérience"
                        className="w-4 h-4 custom-icon"
                      />
                    </div>
                  </div>

                  {/* Title — center */}
                  <p className="flex-1 min-w-0 text-[14px] font-medium tracking-[-0.15px] text-neutrallight-900 dark:text-neutraldark-900 truncate">
                    {exp.title}
                  </p>

                  {/* Date — right */}
                  <span
                    className="shrink-0 text-[12px] font-medium tracking-[-0.1px] text-neutrallight-600 dark:text-neutraldark-600 tabular-nums"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {exp.period}
                  </span>

                  {/* Chevron down — far right */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/CorpIcon/chevron_down.svg"
                    alt=""
                    className="shrink-0 w-3.5 h-3.5 custom-icon opacity-60"
                    style={{
                      transform: isSelected ? "rotate(180deg)" : "rotate(0deg)",
                      transition: `transform 200ms ${easing}`,
                    }}
                  />
                </div>

                {/* Expansion panel — snippet wrapping the CodeBlock, inside the same clickable div */}
                <div
                  style={{
                    maxHeight: isSelected ? panelHeight + 24 : 0,
                    opacity: isSelected ? 1 : 0,
                    transition: isSelected
                      ? `max-height 480ms ${smoothEasing}, opacity 150ms ${smoothEasing}`
                      : `max-height 300ms ${easing} 80ms, opacity 200ms ${easing}`,
                  }}
                >
                  {/* Splitter between header and content — animates width from center */}
                  {/* <div className="mt-2 mb-2 -mx-2 h-[0.5px] flex justify-center">
                    <div
                      className="h-full bg-neutrallight-300 dark:bg-borderdark-900"
                      style={{
                        width: isSelected ? 448 : 0,
                        opacity: isSelected ? 1 : 0,
                        transition: isSelected
                          ? `width 320ms ${smoothEasing} 250ms, opacity 250ms ${smoothEasing} 250ms`
                          : `width 200ms ${easing}, opacity 150ms ${easing}`,
                      }}
                    />
                  </div> */}
                  <div className="px-2 pt-4 pb-3 overflow-hidden">
                    <CodeBlock
                      lines={exp.description}
                      startLineNumber={1}
                      hideStatusBar
                      hideActionButton
                      numberWidth={20}
                      cascade
                      cascadeVisible={isSelected}
                      cascadeBaseDelay={100}
                      cascadeStagger={45}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
