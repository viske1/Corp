"use client";

import { useEffect, useRef, useState } from "react";
import { useView } from "./ViewContext";
import { SpinnerLoader } from "./SpinnerLoader";
import { CodeBlock } from "./CodeBlock";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { CustomBadge } from "./CustomBadge";

const easing = "cubic-bezier(0.4, 0, 0.2, 1)";
// Aggressive decel near the end — smooth landing
const smoothEasing = "cubic-bezier(0.22, 1, 0.36, 1)";

type Experience = {
  title: string;
  period: string;
  description: string[];
  badges?: string[];
};

type Folder = {
  name: string;
  items: Experience[];
};

const FOLDERS: Folder[] = [
  {
    name: "Expériences professionnelles",
    items: [
      {
        title: "Product designer — Djtal System",
        period: "2023 - 2026",
        description: [
          "Développement front-end, conception et évolution d'interfaces d'une application métier (Vue 3, Tailwind), du prototypage à la mise en production.",
          "Cohérence UI, réutilisabilité des composants et gestion de la performance.",
        ],
        badges: ["Vue 3", "Front-end", "AI - Claude", "UI/UX", "Figma"],
      },
      {
        title: "Alternance UI / UX — Djtal System",
        period: "2022 - 2023",
        description: [
          "Conception de prototypage, maquettes d'une application métier. Développement site vitrine.",
          "Développement application mobile (React Native) pour la gestion de ressources humaines.",
        ],
        badges: ["Figma", "React Native", "UI/UX"],
      },
      {
        title: "Stage — Bubo, Paris",
        period: "2021 - 4 mois",
        description: [
          "UI design : création de charte graphique, logo, wireframes et maquettes.",
          "Développement : implémentation web front en HTML, CSS et JS, et back en Python.",
        ],
        badges: ["UI Design", "HTML", "CSS", "JavaScript", "Python"],
      },
    ],
  },
  {
    name: "Formations",
    items: [
      {
        title: "Licence chef de projet Digital",
        period: "2020 - 2023",
        description: ["Digital Campus, Lyon."],
      },
      {
        title: "DUT Information",
        period: "2017 - 2019",
        description: ["IUT Lyon 1, Bourg-en-Bresse."],
      },
    ],
  },
];

// Flatten folders into a single list of experiences (preserving order)
const EXPERIENCES: Experience[] = FOLDERS.flatMap((f) => f.items);

const ITEM_STAGGER = 60;
const BASE_DELAY = 350;

// Used to estimate how many visual lines each description text will wrap to.
// Tune this if the available width or font-size changes.
const CHARS_PER_LINE = 44;
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

// Persist the resolved icons across CV open/close cycles
// so the "loading" simulation only runs the first time.
let cachedResolvedIcons: ItemIcon[] | null = null;

export function CVView() {
  const { view } = useView();
  const isOpen = view === "cv";

  const [icons, setIcons] = useState<ItemIcon[]>(
    () => cachedResolvedIcons ?? EXPERIENCES.map(() => "spinner"),
  );
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    () => new Set(),
  );
  // Expanded item state: tracks which item is open + its slot rect (anchor)
  const [expanded, setExpanded] = useState<{
    index: number;
    anchor: { top: number; left: number; width: number; height: number };
  } | null>(null);
  // Drives the entry/exit animation
  const [expandedActive, setExpandedActive] = useState(false);
  const itemSlotRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [openFolders, setOpenFolders] = useState<Set<number>>(
    () => new Set(FOLDERS.map((_, i) => i)),
  );
  // Measured height of the expanded text content (so we know how much to grow the card)
  const [expandedTextHeight, setExpandedTextHeight] = useState(0);
  const expandedTextRef = useRef<HTMLDivElement | null>(null);
  // Per-folder hover indicator state
  const [hoverState, setHoverState] = useState<
    Record<
      number,
      { top: number; left: number; width: number; height: number } | null
    >
  >({});
  const [hoverVisible, setHoverVisible] = useState<Record<number, boolean>>({});
  const [hoverAnimate, setHoverAnimate] = useState<Record<number, boolean>>({});
  const folderRefs = useRef<Record<number, HTMLDivElement | null>>({});
  // Block hover indicator until the entry cascade has finished.
  const [cascadeReady, setCascadeReady] = useState(false);
  // Track the latest mouse position so we can resolve hover on the element
  // currently under the cursor as soon as the cascade finishes.
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  const updateHover = (folderIdx: number, target: HTMLElement) => {
    if (!cascadeReady) return;
    const container = folderRefs.current[folderIdx];
    if (!container) return;
    const cBox = container.getBoundingClientRect();
    const tBox = target.getBoundingClientRect();
    const wasVisible = hoverVisible[folderIdx] ?? false;
    setHoverAnimate((prev) => ({ ...prev, [folderIdx]: wasVisible }));
    setHoverState((prev) => ({
      ...prev,
      [folderIdx]: {
        top: tBox.top - cBox.top,
        left: tBox.left - cBox.left,
        width: tBox.width,
        height: tBox.height,
      },
    }));
    setHoverVisible((prev) => ({ ...prev, [folderIdx]: true }));
  };

  const clearHover = (folderIdx: number) => {
    setHoverVisible((prev) => ({ ...prev, [folderIdx]: false }));
  };

  const toggleFolder = (i: number) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const toggleSelected = (i: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const expandItem = (i: number) => {
    const slotEl = itemSlotRefs.current[i];
    if (!slotEl) return;
    const rect = slotEl.getBoundingClientRect();
    // First, set expanded with the anchor and ensure expandedActive is false
    setExpandedActive(false);
    setExpanded({
      index: i,
      anchor: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
    });
    // Then on the next paint, activate the animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setExpandedActive(true));
      });
    });
  };

  const [isCollapsing, setIsCollapsing] = useState(false);

  const collapseItem = () => {
    setExpandedActive(false);
    setIsCollapsing(true);
    setTimeout(() => {
      setExpanded(null);
      setExpandedTextHeight(0);
      setIsCollapsing(false);
    }, 500);
  };

  // Bump on each navigation — used as a key to re-trigger the content fade
  const [navTick, setNavTick] = useState(0);

  const navigateExpanded = (direction: 1 | -1) => {
    setExpanded((prev) => {
      if (!prev) return prev;
      const nextIndex =
        (prev.index + direction + EXPERIENCES.length) % EXPERIENCES.length;
      const slotEl = itemSlotRefs.current[nextIndex];
      // Anchor stays correct: use the new slot's rect so the close animation
      // (and the hidden slot placeholder) line up with the new item.
      const rect = slotEl?.getBoundingClientRect();
      const nextAnchor = rect
        ? {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }
        : prev.anchor;
      return { index: nextIndex, anchor: nextAnchor };
    });
    // Reset measured height so the new content can grow/shrink the card
    setExpandedTextHeight(0);
    setNavTick((t) => t + 1);
  };

  // Measure the expanded text height with ResizeObserver
  useEffect(() => {
    if (!expanded) return;
    const el = expandedTextRef.current;
    if (!el) return;
    const update = () => setExpandedTextHeight(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [expanded]);

  // Keyboard navigation while an item is expanded
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        navigateExpanded(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateExpanded(-1);
      } else if (e.key === "Escape") {
        collapseItem();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  // Reset to all spinners whenever we close
  useEffect(() => {
    if (!isOpen) {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
      // Only reset to spinners if the loading sequence has never completed.
      // Once cached, the icons stay resolved for subsequent visits.
      setIcons(cachedResolvedIcons ?? EXPERIENCES.map(() => "spinner"));
      setSelectedIndices(new Set());
      setOpenFolders(new Set(FOLDERS.map((_, i) => i)));
      setCascadeReady(false);
    }
  }, [isOpen]);

  // Track mouse position while the CV view is open
  useEffect(() => {
    if (!isOpen) return;
    const onMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isOpen]);

  // Enable hover indicator once the entry cascade has fully finished
  useEffect(() => {
    if (!isOpen) return;
    const totalRows = FOLDERS.reduce((s, f) => s + 1 + f.items.length, 0);
    const lastRowDelay = BASE_DELAY + (totalRows - 1) * ITEM_STAGGER;
    // Match the longest per-row transition (transform 400ms) + small buffer
    const totalCascadeMs = lastRowDelay + 400 + 50;
    const t = setTimeout(() => {
      setCascadeReady(true);
      // If the cursor is already over an item/header, resolve hover now
      // (the user may not move the mouse to retrigger onMouseEnter).
      const pos = mousePosRef.current;
      if (!pos) return;
      const el = document.elementFromPoint(pos.x, pos.y) as HTMLElement | null;
      if (!el) return;
      // Walk up to find a registered slot or folder container
      let node: HTMLElement | null = el;
      while (node) {
        // Match an item slot
        const slotEntry = Object.entries(itemSlotRefs.current).find(
          ([, ref]) => ref === node,
        );
        if (slotEntry) {
          const i = Number(slotEntry[0]);
          // Find which folder this item belongs to
          let folderIdx = 0;
          let count = 0;
          for (let f = 0; f < FOLDERS.length; f++) {
            if (i < count + FOLDERS[f].items.length) {
              folderIdx = f;
              break;
            }
            count += FOLDERS[f].items.length;
          }
          const folderEl = folderRefs.current[folderIdx];
          if (folderEl) {
            const cBox = folderEl.getBoundingClientRect();
            const tBox = node.getBoundingClientRect();
            setHoverAnimate((prev) => ({ ...prev, [folderIdx]: false }));
            setHoverState((prev) => ({
              ...prev,
              [folderIdx]: {
                top: tBox.top - cBox.top,
                left: tBox.left - cBox.left,
                width: tBox.width,
                height: tBox.height,
              },
            }));
            setHoverVisible((prev) => ({ ...prev, [folderIdx]: true }));
          }
          return;
        }
        // Match a folder header (button inside a folder container)
        const folderEntry = Object.entries(folderRefs.current).find(
          ([, ref]) => ref && node && ref.contains(node) && node.tagName === "BUTTON",
        );
        if (folderEntry) {
          const folderIdx = Number(folderEntry[0]);
          const folderEl = folderRefs.current[folderIdx];
          if (folderEl) {
            const cBox = folderEl.getBoundingClientRect();
            const tBox = node.getBoundingClientRect();
            setHoverAnimate((prev) => ({ ...prev, [folderIdx]: false }));
            setHoverState((prev) => ({
              ...prev,
              [folderIdx]: {
                top: tBox.top - cBox.top,
                left: tBox.left - cBox.left,
                width: tBox.width,
                height: tBox.height,
              },
            }));
            setHoverVisible((prev) => ({ ...prev, [folderIdx]: true }));
          }
          return;
        }
        node = node.parentElement;
      }
    }, totalCascadeMs);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Orchestrate the waves while open, using a pre-computed sequence
  useEffect(() => {
    if (!isOpen) return;
    // Loading already simulated on a previous visit — skip the waves
    if (cachedResolvedIcons) return;

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
        } else {
          // Sequence finished — cache the final icons so subsequent
          // visits skip the loading simulation.
          cachedResolvedIcons = [...currentIcons];
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
    <>
      {/* Theme switcher — centered at the same vertical position as the Header pill.
          Rendered at the top of CVView (sibling of the main overlay) so the overlay's
          fade/blur doesn't affect it. */}
      <div
        className="fixed top-0 left-0 right-0 flex justify-center pointer-events-none"
        style={{
          transform: "translateY(84px)",
          padding: "4px 0",
          zIndex: 60,
        }}
      >
        <div
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "scale(1)" : "scale(0.6)",
            transition: isOpen
              ? `opacity 280ms ${easing} 700ms, transform 320ms ${easing} 700ms`
              : `opacity 180ms ${easing}, transform 220ms ${easing}`,
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          <ThemeSwitcher />
        </div>
      </div>

      <div
        className={`fixed inset-0 z-20 flex items-center justify-center ${
          isOpen
            ? "overflow-y-auto pointer-events-auto"
            : "overflow-hidden pointer-events-none"
        }`}
        style={{
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          transition: isOpen
            ? `opacity 250ms ${easing} 250ms, visibility 0ms`
            : `opacity 180ms ${easing}, visibility 0ms 180ms`,
        }}
      >
        <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col gap-2">
          {FOLDERS.map((folder, folderIdx) => {
            const folderOpen = openFolders.has(folderIdx);
            // Compute the global index of the first item in this folder
            const itemsBeforeFolder = FOLDERS.slice(0, folderIdx).reduce(
              (sum, f) => sum + f.items.length,
              0,
            );
            // Row index of this folder in the unified cascade
            // (each previous folder counts for 1 header + its items)
            const folderRowIndex = FOLDERS.slice(0, folderIdx).reduce(
              (sum, f) => sum + 1 + f.items.length,
              0,
            );
            const folderEnterDelay = BASE_DELAY + folderRowIndex * ITEM_STAGGER;
            const folderExitDelay =
              (FOLDERS.reduce((s, f) => s + 1 + f.items.length, 0) -
                1 -
                folderRowIndex) *
              30;

            // Approximate the folder panel height when open.
            // Must match the inner panel's maxHeight expression: (computePanelHeight + 24).
            const folderContentHeight =
              folder.items.reduce((sum, item, idx) => {
                const i = itemsBeforeFolder + idx;
                const itemHeight = 44; // py-2 + content height
                const panelExtra = selectedIndices.has(i)
                  ? computePanelHeight(item.description) + 24
                  : 0;
                return sum + itemHeight + panelExtra + 4; // 4 = gap-1
              }, 0) + 8; // +8 cushion for pt-1 of inner container + sub-pixel rounding

            const hRect = hoverState[folderIdx];
            const hVisible = hoverVisible[folderIdx] ?? false;
            const hAnimate = hoverAnimate[folderIdx] ?? false;

            return (
              <div
                key={folder.name}
                className="flex flex-col relative"
                ref={(el) => {
                  folderRefs.current[folderIdx] = el;
                }}
                onMouseLeave={() => clearHover(folderIdx)}
              >
                {/* Sliding hover indicator */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute rounded-xl bg-neutrallight-200/50 dark:bg-buttondark-900/40"
                  style={{
                    top: hRect?.top ?? 0,
                    left: hRect?.left ?? 0,
                    width: hRect?.width ?? 0,
                    height: hRect?.height ?? 0,
                    opacity: hVisible && hRect ? 1 : 0,
                    transition: hAnimate
                      ? "all 120ms ease-out"
                      : "opacity 100ms ease-out",
                  }}
                />

                {/* Folder header */}
                <button
                  type="button"
                  onClick={() => toggleFolder(folderIdx)}
                  onMouseEnter={(e) => updateHover(folderIdx, e.currentTarget)}
                  className="relative flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl cursor-pointer pointer-events-auto transition-colors duration-150"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateY(0)" : "translateY(-12px)",
                    filter: isOpen ? "blur(0px)" : "blur(4px)",
                    transition: isOpen
                      ? `opacity 100ms ${easing} ${folderEnterDelay}ms, transform 400ms ${easing} ${folderEnterDelay}ms, filter 100ms ${easing} ${folderEnterDelay}ms, background-color 150ms ease-out`
                      : `opacity 180ms ${easing} ${folderExitDelay}ms, transform 250ms ${easing} ${folderExitDelay}ms, filter 180ms ${easing} ${folderExitDelay}ms`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/CorpIcon/chevron_down.svg"
                    alt=""
                    className="shrink-0 w-3.5 h-3.5 custom-icon opacity-60"
                    style={{
                      transform: folderOpen ? "rotate(0deg)" : "rotate(-90deg)",
                      transition: `transform 200ms ${easing}`,
                    }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/CorpIcon/folder.svg"
                    alt=""
                    className="shrink-0 w-4 h-4 custom-icon opacity-60"
                  />
                  <span className="flex-1 min-w-0 text-[14px] font-medium tracking-[-0.15px] text-neutrallight-900 dark:text-neutraldark-900 truncate text-left">
                    {folder.name}
                  </span>
                  <span
                    className="ml-auto text-[11px] tabular-nums text-neutrallight-500 dark:text-neutraldark-500"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {folder.items.length}
                  </span>
                </button>

                {/* Folder content — children with tree lines */}
                <div
                  className="overflow-hidden relative"
                  style={{
                    maxHeight: folderOpen ? folderContentHeight : 0,
                    opacity: folderOpen ? 1 : 0,
                    transition: folderOpen
                      ? `max-height 480ms ${smoothEasing}, opacity 200ms ${smoothEasing}`
                      : `max-height 320ms ${easing} 60ms, opacity 180ms ${easing}`,
                  }}
                >
                  <div className="flex flex-col gap-1 pl-6 pt-1 relative">
                    {/* Vertical tree line on the left — animated in one go */}
                    <div
                      aria-hidden
                      className="absolute w-px bg-neutrallight-400 dark:bg-borderdark-800 rounded-full pointer-events-none"
                      style={{
                        left: 14,
                        top: 0,
                        bottom: 24,
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen
                          ? "translateY(0)"
                          : "translateY(-12px)",
                        filter: isOpen ? "blur(0px)" : "blur(4px)",
                        transition: isOpen
                          ? `opacity 100ms ${easing} ${BASE_DELAY + (folderRowIndex + 1) * ITEM_STAGGER}ms, transform 400ms ${easing} ${BASE_DELAY + (folderRowIndex + 1) * ITEM_STAGGER}ms, filter 100ms ${easing} ${BASE_DELAY + (folderRowIndex + 1) * ITEM_STAGGER}ms`
                          : `opacity 180ms ${easing}, transform 250ms ${easing}, filter 180ms ${easing}`,
                      }}
                    />
                    {folder.items.map((exp, localIdx) => {
                      const i = itemsBeforeFolder + localIdx;
                      // Unified cascade index: header of this folder + previous rows + local index
                      const rowIndex = folderRowIndex + 1 + localIdx;
                      const totalRows = FOLDERS.reduce(
                        (s, f) => s + 1 + f.items.length,
                        0,
                      );
                      const enterDelay = BASE_DELAY + rowIndex * ITEM_STAGGER;
                      const exitDelay = (totalRows - 1 - rowIndex) * 30;
                      const icon = icons[i];
                      const isSelected = selectedIndices.has(i);
                      const isLast = localIdx === folder.items.length - 1;
                      // Estimate visual lines from char count, since CodeLine wraps long phrases.
                      const panelHeight = computePanelHeight(exp.description);
                      return (
                        <div
                          key={exp.title}
                          className="flex flex-col relative"
                          style={{
                            opacity: isOpen ? 1 : 0,
                            transform: isOpen
                              ? "translateY(0)"
                              : "translateY(-12px)",
                            filter: isOpen ? "blur(0px)" : "blur(4px)",
                            transition: isOpen
                              ? `opacity 100ms ${easing} ${enterDelay}ms, transform 400ms ${easing} ${enterDelay}ms, filter 100ms ${easing} ${enterDelay}ms`
                              : `opacity 180ms ${easing} ${exitDelay}ms, transform 250ms ${easing} ${exitDelay}ms, filter 180ms ${easing} ${exitDelay}ms`,
                          }}
                        >
                          {/* Tree branch — sibling of the slot so it doesn't fade with it */}
                          <svg
                            width="12"
                            height="14"
                            viewBox="-0.5 -0.5 12 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute text-neutrallight-300 dark:text-borderdark-900 pointer-events-none translate-x-[-0.5px]"
                            style={{
                              left: -10,
                              top: 5,
                            }}
                            aria-hidden
                          >
                            <path
                              d="M0.5 0.5V6.5C0.5 9.81371 3.18629 12.5 6.5 12.5H10.5"
                              stroke="#2e3037"
                              className="stroke-neutrallight-400 dark:stroke-[#2e3037]"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeDasharray={20}
                              strokeDashoffset={isOpen ? 0 : 20}
                              style={{
                                transition: isOpen
                                  ? `stroke-dashoffset 600ms ${smoothEasing} ${enterDelay + 250 + localIdx * 120}ms`
                                  : `stroke-dashoffset 200ms ${easing} ${exitDelay}ms`,
                              }}
                            />
                          </svg>
                          <div
                            ref={(el) => {
                              itemSlotRefs.current[i] = el;
                            }}
                            onClick={() => expandItem(i)}
                            onMouseEnter={(e) =>
                              updateHover(folderIdx, e.currentTarget)
                            }
                            className={`relative flex flex-col py-2 pr-2 pl-8 -ml-6 rounded-xl cursor-pointer pointer-events-auto ${
                              isSelected
                                ? "bg-neutrallight-200/50 dark:bg-buttondark-900/30"
                                : ""
                            }`}
                            style={{
                              opacity: expanded?.index === i ? 0 : 1,
                              transform:
                                expanded?.index === i
                                  ? "scale(0.96)"
                                  : "scale(1)",
                              transition:
                                expanded?.index === i || isCollapsing
                                  ? `background-color 200ms ${easing}, opacity 0ms, transform 0ms`
                                  : `background-color 200ms ${easing}, opacity 500ms ${smoothEasing}, transform 500ms ${smoothEasing}`,
                              pointerEvents:
                                expanded?.index === i ? "none" : "auto",
                            }}
                          >
                            <div className="flex items-center gap-3">
                              {/* Spacer to preserve original layout where the SVG branch used to be */}
                              <span
                                aria-hidden
                                className="shrink-0 -ml-4 -mr-0.5"
                                style={{ width: 12, height: 14 }}
                              />
                              {/* Icon area — morphs from spinner to diploma/job */}
                              <div className="shrink-0 relative w-5 h-5 flex items-center justify-center">
                                {/* Spinner layer */}
                                <div
                                  className="absolute inset-0 flex items-center justify-center"
                                  style={{
                                    opacity: icon === "spinner" ? 1 : 0,
                                    transform:
                                      icon === "spinner"
                                        ? "scale(1)"
                                        : "scale(0)",
                                    transition: `opacity 180ms ${easing}, transform 220ms ${easing}`,
                                  }}
                                >
                                  <SpinnerLoader
                                    size="sm"
                                    colorScheme="neutral"
                                  />
                                </div>

                                {/* Diploma layer */}
                                <div
                                  className="absolute inset-0 flex items-center justify-center rounded-md bg-primarylight-900/10 dark:bg-primarydark-900/10"
                                  style={{
                                    opacity: icon === "diploma" ? 1 : 0,
                                    transform:
                                      icon === "diploma"
                                        ? "scale(1)"
                                        : "scale(0)",
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
                                    className="w-4 h-4"
                                  />
                                </div>

                                {/* Job layer */}
                                <div
                                  className="absolute inset-0 flex items-center justify-center rounded-md bg-main-300 dark:bg-main-100"
                                  style={{
                                    opacity: icon === "job" ? 1 : 0,
                                    transform:
                                      icon === "job" ? "scale(1)" : "scale(0)",
                                    transition:
                                      icon === "job"
                                        ? `opacity 220ms ${easing} 80ms, transform 280ms ${easing} 80ms`
                                        : `opacity 180ms ${easing}, transform 220ms ${easing}`,
                                  }}
                                >
                                  <span
                                    aria-label="Expérience"
                                    className="w-4 h-4 svg-main"
                                    style={{
                                      ["--svg-mask" as string]:
                                        "url(/CorpIcon/job.svg)",
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Title — center */}
                              <p className="flex-1 min-w-0 text-[14px] font-medium tracking-[-0.15px] text-neutrallight-600 dark:text-neutraldark-600 truncate">
                                {exp.title}
                              </p>

                              {/* Date — right */}
                              <span
                                className="shrink-0 text-[12px] font-medium tracking-[-0.1px] text-neutrallight-500 dark:text-neutraldark-500 tabular-nums"
                                style={{
                                  fontFamily: "var(--font-jetbrains-mono)",
                                }}
                              >
                                {exp.period}
                              </span>

                              {/* Chevron down — far right */}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              {/* <img
                              src="/CorpIcon/chevron_down.svg"
                              alt=""
                              className="shrink-0 w-3.5 h-3.5 custom-icon opacity-60"
                              style={{
                                transform: isSelected
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                transition: `transform 200ms ${easing}`,
                              }}
                            /> */}
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
              </div>
            );
          })}
        </div>

        {/* Backdrop + expanded item (uses original slot rect as anchor) */}
        {expanded &&
          (() => {
            const exp = EXPERIENCES[expanded.index];
            // Center vertically in the viewport based on the expanded card's final height
            const cardFinalHeight =
              expanded.anchor.height + expandedTextHeight + 40;
            const TARGET_TOP =
              typeof window !== "undefined"
                ? Math.max(80, (window.innerHeight - cardFinalHeight) / 2)
                : 280;
            const cardLeft = expanded.anchor.left - 50; // matches the card's expanded left
            const cardWidth = expanded.anchor.width + 100;
            return (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-30 pointer-events-auto bg-white/60 dark:bg-black/45"
                  onClick={collapseItem}
                  style={{
                    backdropFilter: "blur(1px)",
                    WebkitBackdropFilter: "blur(1px)",
                    opacity: expandedActive ? 1 : 0,
                    transition: `opacity 500ms ${smoothEasing}`,
                  }}
                />

                {/* Navigation toolbar — vertical, on the right side of the card, vertically centered */}
                <div
                  className="fixed z-50 flex flex-col gap-2 pointer-events-auto"
                  style={{
                    top: TARGET_TOP + cardFinalHeight / 2,
                    left: cardLeft + cardWidth + 24,
                    transform: "translateY(-50%)",
                  }}
                >
                  <div
                    aria-label="Précédent"
                    onClick={() => navigateExpanded(-1)}
                    className="flex items-center gap-1 cursor-pointer"
                    style={{
                      opacity: expandedActive ? 1 : 0,
                      transform: expandedActive
                        ? "translateY(0)"
                        : "translateY(5px)",
                      filter: expandedActive ? "blur(0px)" : "blur(4px)",
                      transition: expandedActive
                        ? `opacity 700ms ${smoothEasing} 500ms, transform 700ms ${smoothEasing} 500ms, filter 700ms ${smoothEasing} 500ms`
                        : `opacity 250ms ${smoothEasing}, transform 300ms ${smoothEasing}, filter 250ms ${smoothEasing}`,
                      pointerEvents: expandedActive ? "auto" : "none",
                    }}
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-md bg-neutrallight-200 dark:bg-buttondark-900/40 backdrop-blur-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/CorpIcon/arrow_upward.svg"
                        alt=""
                        className="w-3.5 h-3.5 custom-icon opacity-40"
                      />
                    </span>
                    <span className="text-[11px] font-semibold tracking-[-0.1px] text-neutrallight-600/70 dark:text-neutraldark-600/70">
                      Précédent
                    </span>
                  </div>
                  <div
                    aria-label="Suivant"
                    onClick={() => navigateExpanded(1)}
                    className="flex items-center gap-1 cursor-pointer"
                    style={{
                      opacity: expandedActive ? 1 : 0,
                      transform: expandedActive
                        ? "translateY(0)"
                        : "translateY(5px)",
                      filter: expandedActive ? "blur(0px)" : "blur(4px)",
                      transition: expandedActive
                        ? `opacity 700ms ${smoothEasing} 600ms, transform 700ms ${smoothEasing} 600ms, filter 700ms ${smoothEasing} 600ms`
                        : `opacity 250ms ${smoothEasing}, transform 300ms ${smoothEasing}, filter 250ms ${smoothEasing}`,
                      pointerEvents: expandedActive ? "auto" : "none",
                    }}
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-md bg-neutrallight-200 dark:bg-buttondark-900/40 backdrop-blur-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/CorpIcon/arrow_downward.svg"
                        alt=""
                        className="w-3.5 h-3.5 custom-icon opacity-40"
                      />
                    </span>
                    <span className="text-[11px] font-semibold tracking-[-0.1px] text-neutrallight-600/70 dark:text-neutraldark-600/70">
                      Suivant
                    </span>
                  </div>
                </div>
                {/* Outer ring — soft bg + border that frames the card with padding */}
                {(() => {
                  const RING_PAD = 12;
                  return (
                    <div
                      className={`fixed z-40 pointer-events-none rounded-[41px] border ${
                        expandedActive
                          ? "bg-neutrallight-200 dark:bg-buttondark-900/50 border-neutrallight-300 dark:border-borderdark-900 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18)] dark:shadow-none"
                          : "bg-transparent border-transparent shadow-none"
                      }`}
                      style={{
                        top:
                          (expandedActive ? TARGET_TOP : expanded.anchor.top) -
                          RING_PAD,
                        left:
                          (expandedActive
                            ? expanded.anchor.left - 50
                            : expanded.anchor.left) - RING_PAD,
                        width:
                          (expandedActive
                            ? expanded.anchor.width + 100
                            : expanded.anchor.width) +
                          RING_PAD * 2,
                        height:
                          (expandedActive
                            ? expanded.anchor.height + expandedTextHeight + 22
                            : expanded.anchor.height) +
                          RING_PAD * 2,
                        opacity: expandedActive ? 1 : 0,
                        transform: expandedActive ? "scale(1)" : "scale(0.92)",
                        transformOrigin: "center center",
                        backdropFilter: expandedActive
                          ? "blur(12px)"
                          : "blur(0px)",
                        WebkitBackdropFilter: expandedActive
                          ? "blur(12px)"
                          : "blur(0px)",
                        transition: expandedActive
                          ? `top 500ms ${smoothEasing}, left 500ms ${smoothEasing}, width 500ms ${smoothEasing}, height 500ms ${smoothEasing}, background-color 400ms ${smoothEasing} 100ms, border-color 400ms ${smoothEasing} 100ms, opacity 400ms ${smoothEasing} 100ms, transform 500ms ${smoothEasing} 100ms, backdrop-filter 400ms ${smoothEasing} 100ms, -webkit-backdrop-filter 400ms ${smoothEasing} 100ms`
                          : `top 500ms ${smoothEasing}, left 500ms ${smoothEasing}, width 500ms ${smoothEasing}, height 500ms ${smoothEasing}, background-color 200ms ${smoothEasing}, border-color 200ms ${smoothEasing}, opacity 220ms ${smoothEasing}, transform 260ms ${smoothEasing}, backdrop-filter 200ms ${smoothEasing}, -webkit-backdrop-filter 200ms ${smoothEasing}`,
                      }}
                    />
                  );
                })()}

                {/* Expanded card — mirrors the original slot, animates only its position */}
                <div
                  className={`fixed z-40 rounded-4xl overflow-hidden ${
                    expandedActive
                      ? "bg-neutrallight-100 dark:bg-background/80"
                      : "bg-transparent shadow-none"
                  }`}
                  style={{
                    top: expandedActive ? TARGET_TOP : expanded.anchor.top,
                    left: expandedActive
                      ? expanded.anchor.left - 50
                      : expanded.anchor.left,
                    width: expandedActive
                      ? expanded.anchor.width + 100
                      : expanded.anchor.width,
                    height: expandedActive
                      ? expanded.anchor.height + expandedTextHeight + 22
                      : expanded.anchor.height,
                    transition: expandedActive
                      ? `top 500ms ${smoothEasing}, left 500ms ${smoothEasing}, width 500ms ${smoothEasing}, height 500ms ${smoothEasing}, background-color 500ms ${smoothEasing}`
                      : `top 500ms ${smoothEasing}, left 500ms ${smoothEasing}, width 500ms ${smoothEasing}, height 500ms ${smoothEasing}, background-color 500ms ${smoothEasing} 50ms`,
                  }}
                >
                  {/* Original slot content — exactly mirrors the list item */}
                  <div
                    className="flex flex-col"
                    style={{
                      paddingLeft: expandedActive ? 20 : 32,
                      paddingRight: expandedActive ? 20 : 8,
                      paddingTop: expandedActive ? 20 : 8,
                      paddingBottom: expandedActive ? 20 : 8,
                      transition: `padding 500ms ${smoothEasing}`,
                    }}
                  >
                    <div
                      key={`header-${navTick}`}
                      className="flex items-center gap-3"
                      style={{
                        animation: `cvNavFadeIn 320ms ${smoothEasing} both`,
                      }}
                    >
                      {/* Same icon area as the original slot — preserves current icon state */}
                      <div className="shrink-0 relative w-5 h-5 flex items-center justify-center">
                        {/* Spinner layer */}
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            opacity:
                              icons[expanded.index] === "spinner" ? 1 : 0,
                            transform:
                              icons[expanded.index] === "spinner"
                                ? "scale(1)"
                                : "scale(0)",
                          }}
                        >
                          <SpinnerLoader size="sm" colorScheme="neutral" />
                        </div>
                        {/* Diploma layer */}
                        <div
                          className="absolute inset-0 flex items-center justify-center rounded-md bg-primarylight-900/10 dark:bg-primarydark-900/10"
                          style={{
                            opacity:
                              icons[expanded.index] === "diploma" ? 1 : 0,
                            transform:
                              icons[expanded.index] === "diploma"
                                ? "scale(1)"
                                : "scale(0)",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/CorpIcon/diploma.svg"
                            alt="Formation"
                            className="w-4 h-4"
                          />
                        </div>
                        {/* Job layer */}
                        <div
                          className="absolute inset-0 flex items-center justify-center rounded-md bg-main-300 dark:bg-main-100"
                          style={{
                            opacity: icons[expanded.index] === "job" ? 1 : 0,
                            transform:
                              icons[expanded.index] === "job"
                                ? "scale(1)"
                                : "scale(0)",
                          }}
                        >
                          <span
                            aria-label="Expérience"
                            className="w-4 h-4 svg-main"
                            style={{
                              ["--svg-mask" as string]:
                                "url(/CorpIcon/job.svg)",
                            }}
                          />
                        </div>
                      </div>
                      <p
                        className={`flex-1 min-w-0 text-[14px] font-medium tracking-[-0.15px] truncate ${
                          expandedActive
                            ? "text-neutrallight-900 dark:text-neutraldark-900"
                            : "text-neutrallight-600 dark:text-neutraldark-600"
                        }`}
                        style={{
                          transition: `color 500ms ${smoothEasing}`,
                        }}
                      >
                        {exp.title}
                      </p>
                      <span
                        className="shrink-0 text-[12px] font-medium tracking-[-0.1px] text-neutrallight-500 dark:text-neutraldark-500 tabular-nums"
                        style={{
                          fontFamily: "var(--font-jetbrains-mono)",
                        }}
                      >
                        {exp.period}
                      </span>
                    </div>

                    {/* Expanded description — measured for height calculation.
                      Fixed width prevents reflow as the parent card animates its width. */}
                    <div
                      ref={expandedTextRef}
                      className="pt-4 text-[14px] leading-[1.6] tracking-[-0.1px] text-neutrallight-700 dark:text-neutraldark-600 font-medium"
                      style={{
                        width: 475,
                        opacity: expandedActive ? 1 : 0.6,
                        transform: expandedActive
                          ? "translateY(0)"
                          : "translateY(6px)",
                        transition: `opacity 500ms ${smoothEasing}, transform 500ms ${smoothEasing}`,
                      }}
                    >
                      <div
                        key={`desc-${navTick}`}
                        className="rounded-2xl border border-dashed border-neutrallight-400/30 dark:border-borderdark-800 p-3"
                        style={{
                          animation: `cvNavFadeIn 360ms ${smoothEasing} 60ms both`,
                        }}
                      >
                        {exp.description.join(" ")}
                      </div>

                      {/* Badges row — slot for tech/skill tags below the text */}
                      {exp.badges && exp.badges.length > 0 && (
                        <div
                          key={`badges-${navTick}`}
                          className="flex flex-wrap gap-2 pt-3"
                          style={{
                            animation: `cvNavFadeIn 360ms ${smoothEasing} 120ms both`,
                          }}
                        >
                          {exp.badges.map((b) => (
                            <CustomBadge
                              key={b}
                              text={b}
                              colorScheme="neutral"
                              variant="bordered"
                              size="sm"
                              rounded="md"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
      </div>
    </>
  );
}
