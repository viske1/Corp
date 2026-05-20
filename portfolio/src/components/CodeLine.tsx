"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { DropdownContainer } from "./DropdownContainer";
import { CustomButton } from "./CustomButton";
import { HoverList } from "./HoverList";

export type LineStatus = "default" | "modified" | "deleted";

type CodeLineProps = {
  lineNumber: number;
  text: string;
  initialStatus?: LineStatus;
  onMeasure?: (visualLines: number) => void;
  hideStatusBar?: boolean;
  hideActionButton?: boolean;
  numberWidth?: number;
  enterDelayMs?: number;
  visible?: boolean;
};

const LINE_HEIGHT = 28;

const STATUS_BAR_COLORS: Record<LineStatus, string> = {
  default: "bg-neutrallight-400 dark:bg-neutraldark-400",
  modified: "bg-primarylight-900 dark:bg-primarydark-900",
  deleted: "bg-destructive-900",
};

// Gutter background — semi-transparent solid color when not default
const STATUS_GUTTER_BG: Record<LineStatus, string> = {
  default: "",
  modified: "bg-primarylight-900/15 dark:bg-primarydark-900/15",
  deleted: "bg-destructive-900/15",
};

// Text-side background — hatched pattern in the status color when not default
const STATUS_TEXT_BG: Record<LineStatus, string> = {
  default: "",
  modified: "gutter-bg-modified",
  deleted: "gutter-bg-deleted",
};

const TEXT_COLORS: Record<LineStatus, string> = {
  default: "text-neutrallight-700 dark:text-neutraldark-600",
  modified: "text-primarylight-900 dark:text-primarydark-900",
  deleted: "text-destructive-900 line-through opacity-60",
};

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const MentionIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);

const RestoreIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <polyline points="3 4 3 10 9 10" />
  </svg>
);

export function CodeLine({
  lineNumber,
  text,
  initialStatus = "default",
  onMeasure,
  hideStatusBar = false,
  hideActionButton = false,
  numberWidth,
  enterDelayMs,
  visible = true,
}: CodeLineProps) {
  const [status, setStatus] = useState<LineStatus>(initialStatus);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [visualLines, setVisualLines] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Measure how many visual lines the wrapped text takes
  useLayoutEffect(() => {
    if (!textRef.current) return;

    const measure = () => {
      const el = textRef.current;
      if (!el) return;
      const count = Math.max(1, Math.round(el.scrollHeight / LINE_HEIGHT));
      setVisualLines(count);
      onMeasure?.(count);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(textRef.current);
    return () => ro.disconnect();
  }, [text, onMeasure]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const showButton = hover || open;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
    setOpen(false);
  };

  const handleDelete = () => {
    setStatus("deleted");
    setOpen(false);
  };

  const handleRestore = () => {
    setStatus("modified");
    setOpen(false);
  };

  const handleMention = () => {
    setOpen(false);
  };

  const hasEnterAnim = enterDelayMs != null;
  const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`group relative flex items-stretch gap-3 -mx-3 px-3 transition-[margin,background-color] duration-200  ${
        status !== "default" ? "my-2" : ""
      }`}
      style={
        hasEnterAnim
          ? {
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-6px)",
              filter: visible ? "blur(0px)" : "blur(3px)",
              transition: visible
                ? `opacity 300ms ${easing} ${enterDelayMs}ms, transform 350ms ${easing} ${enterDelayMs}ms, filter 300ms ${easing} ${enterDelayMs}ms`
                : `opacity 150ms ${easing}, transform 200ms ${easing}, filter 150ms ${easing}`,
            }
          : undefined
      }
    >
      {/* Gutter: numbers (with status bg) + status bar */}
      <div className="flex shrink-0 select-none">
        {/* Line numbers column — bg matches status color, extends to left edge with rounded corners */}
        <div
          className={`flex flex-col pl-3 pr-2 -ml-3 rounded-l-xl transition-colors duration-200 ${STATUS_GUTTER_BG[status]}`}
        >
          {Array.from({ length: visualLines }).map((_, i) => (
            <span
              key={i}
              className={`text-[11px] tabular-nums font-jetbrains text-neutrallight-500 dark:text-neutraldark-500 text-right flex items-center justify-end ${
                numberWidth == null ? "w-8" : ""
              }`}
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                height: LINE_HEIGHT,
                width: numberWidth,
              }}
            >
              {lineNumber + i}
            </span>
          ))}
        </div>
        {/* Status bar — hatched when default, solid otherwise */}
        {!hideStatusBar && (
          <span
            className={`w-[3px] transition-colors duration-200 ${
              status === "default"
                ? "status-bar-hatched"
                : STATUS_BAR_COLORS[status]
            }`}
          />
        )}
      </div>

      {/* Line text — wraps naturally, with hatched bg when not default.
          bg extends from the status bar to the parent's right edge. */}
      <p
        ref={textRef}
        className={`relative flex-1 min-w-0 text-[14px] tracking-[-0.2px] font-medium pl-3 pr-10 -ml-3 -mr-3 rounded-r-xl transition-colors duration-200 ${TEXT_COLORS[status]} ${STATUS_TEXT_BG[status]}`}
        style={{ lineHeight: `${LINE_HEIGHT}px` }}
      >
        {text}
      </p>

      {/* Action button — absolute on the right so it doesn't push the bg */}
      {!hideActionButton && (
      <div
        ref={wrapperRef}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
        style={{
          opacity: showButton ? 1 : 0,
          transition: "opacity 150ms ease-out",
          pointerEvents: showButton ? "auto" : "none",
        }}
      >
        <IconButton
          icon="more"
          isCustomIcon
          buttonType="light"
          colorScheme="neutral"
          size="sm"
          onClick={() => setOpen((v) => !v)}
        />

        <DropdownContainer
          isVisible={open}
          position="bottom-right"
          width="180px"
          offsetY={6}
        >
          <HoverList className="flex flex-col p-1">
            <CustomButton
              text="Copier"
              buttonType="light"
              colorScheme="neutral"
              justify="start"
              textAlign="left"
              disableHoverBg
              leftIconNode={<CopyIcon />}
              onClick={handleCopy}
              heightButton="h-[32px]"
              fontWeight="medium"
            />
            <CustomButton
              text="Mentionner"
              buttonType="light"
              colorScheme="neutral"
              justify="start"
              textAlign="left"
              disableHoverBg
              leftIconNode={<MentionIcon />}
              onClick={handleMention}
              heightButton="h-[32px]"
              fontWeight="medium"
            />
            {status === "deleted" ? (
              <CustomButton
                text="Restaurer"
                buttonType="light"
                colorScheme="neutral"
                justify="start"
                textAlign="left"
                disableHoverBg
                leftIconNode={<RestoreIcon />}
                onClick={handleRestore}
                heightButton="h-[32px]"
                fontWeight="medium"
              />
            ) : (
              <CustomButton
                text="Supprimer"
                buttonType="light"
                colorScheme="destructive"
                justify="start"
                textAlign="left"
                disableHoverBg
                leftIconNode={<TrashIcon />}
                onClick={handleDelete}
                heightButton="h-[32px]"
                fontWeight="medium"
              />
            )}
          </HoverList>
        </DropdownContainer>
      </div>
      )}
    </div>
  );
}
