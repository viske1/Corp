"use client";

import { useEffect, useRef, useState } from "react";
import { ActionPill } from "./ActionPill";
import { useView } from "./ViewContext";

const EMAIL = "clementfradet@gmail.com";

const ArrowLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const easing = "cubic-bezier(0.4, 0, 0.2, 1)";

const PILL_CONTACT_WIDTH = 194;
const ICON_BTN_WIDTH = 28;
const GAP = 4;

export function MultitaskBar() {
  const { view, setView } = useView();
  const isCV = view === "cv";
  const [mode, setMode] = useState<"idle" | "contact">("idle");
  const [copied, setCopied] = useState(false);
  const [idleWidth, setIdleWidth] = useState(0);
  const [contactWidth, setContactWidth] = useState(0);
  const idleRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (entry.target === idleRef.current) setIdleWidth(w);
        if (entry.target === contactRef.current) setContactWidth(w);
      }
    });
    if (idleRef.current) ro.observe(idleRef.current);
    if (contactRef.current) ro.observe(contactRef.current);
    return () => ro.disconnect();
  }, []);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const isContact = mode === "contact";

  // bar inner width = active layer width + horizontal padding (p-1 = 4px each side)
  const PADDING_X = 8;
  const activeWidth = isContact ? contactWidth : idleWidth;
  const barWidth = activeWidth > 0 ? activeWidth + PADDING_X : undefined;

  return (
    <div className="fixed bottom-[94px] left-1/2 -translate-x-1/2 z-40">
      <div
        className="
          inline-flex items-center justify-center p-1 rounded-full relative
          bg-neutrallight-100/90 dark:bg-inputdark-900
          border-[1px] border-neutrallight-300 dark:border-borderdark-900
          backdrop-blur-md
          shadow-[0_8px_24px_-6px_rgba(0,0,0,0.15)]
          dark:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)]
          overflow-hidden
        "
        style={{
          height: 36,
          width: barWidth,
        }}
      >
        {/* IDLE layer: 2 ActionPills */}
        <div
          ref={idleRef}
          className="absolute top-1/2 left-1/2 flex items-center"
          style={{
            gap: GAP,
            transform: `translate(-50%, -50%) scale(${isContact ? 0.85 : 1})`,
            opacity: isContact ? 0 : 1,
            filter: isContact ? "blur(4px)" : "blur(0px)",
            transition: isContact
              ? `opacity 200ms ${easing}, transform 280ms ${easing}, filter 220ms ${easing}`
              : `opacity 280ms ${easing} 100ms, transform 280ms ${easing} 100ms, filter 280ms ${easing} 100ms`,
            pointerEvents: isContact ? "none" : "auto",
          }}
        >
          <ActionPill
            icon="cv"
            label="Lire CV"
            labelWidth={isCV ? 0 : 50}
            iconNode={isCV ? <ArrowLeftIcon /> : undefined}
            onClick={() => {
              if (isCV) setView("normal");
              else setView("cv");
            }}
          />
          <ActionPill
            icon="contact"
            label="Contact"
            labelWidth={54}
            onClick={() => setMode("contact")}
          />
        </div>

        {/* CONTACT layer: back button + email pill + send button */}
        <div
          ref={contactRef}
          className="absolute top-1/2 left-1/2 flex items-center"
          style={{
            gap: GAP,
            transform: `translate(-50%, -50%) scale(${isContact ? 1 : 0.85})`,
            opacity: isContact ? 1 : 0,
            filter: isContact ? "blur(0px)" : "blur(4px)",
            transition: isContact
              ? `opacity 280ms ${easing} 100ms, transform 280ms ${easing} 100ms, filter 280ms ${easing} 100ms`
              : `opacity 200ms ${easing}, transform 280ms ${easing}, filter 220ms ${easing}`,
            pointerEvents: isContact ? "auto" : "none",
          }}
        >
          {/* Back button */}
          <button
            type="button"
            onClick={() => setMode("idle")}
            aria-label="Retour"
            className="
              inline-flex items-center justify-center w-7 h-7 rounded-full shrink-0
              cursor-pointer text-neutrallight-900 dark:text-neutraldark-900
              hover:bg-neutrallight-200 dark:hover:bg-buttondark-900
              transition-colors duration-200
            "
            style={{ transitionTimingFunction: easing }}
          >
            <ArrowLeftIcon />
          </button>

          {/* Pill Contact morphing */}
          <ContactMorphPill
            isContact={isContact}
            copied={copied}
            onActivate={() => setMode("contact")}
            onCopy={handleCopy}
          />

          {/* Send button */}
          <ActionIconButton
            show={isContact}
            delay={100}
            ariaLabel="Envoyer un mail"
            icon="send"
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `mailto:${EMAIL}`;
            }}
          />
        </div>
      </div>
    </div>
  );
}

const CheckSmall = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-neutrallight-900 dark:text-neutraldark-900"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ─── Contact pill that morphs label "Contact" into the email ─── */

type ContactMorphPillProps = {
  isContact: boolean;
  copied: boolean;
  onActivate: () => void;
  onCopy: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

function ContactMorphPill({
  isContact,
  copied,
  onActivate,
  onCopy,
}: ContactMorphPillProps) {
  const [hover, setHover] = useState(false);
  const showLabel = isContact || hover;

  const baseTransition = `opacity 220ms ${easing}, transform 220ms ${easing}, filter 220ms ${easing}`;
  const enterDelay = "180ms";

  const handleRootClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isContact) {
      onActivate();
    } else {
      onCopy(e as unknown as React.MouseEvent<HTMLButtonElement>);
    }
  };

  const bgClass = isContact
    ? "bg-neutrallight-100 dark:bg-containerdark-900 border-[1px] border-neutrallight-300 dark:border-borderdark-900"
    : showLabel
      ? "bg-neutrallight-200 dark:bg-buttondark-900"
      : "bg-transparent";

  const contentOpacity = isContact && hover ? 0.8 : 1;

  return (
    <div
      onClick={handleRootClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        transitionTimingFunction: easing,
        width: isContact ? PILL_CONTACT_WIDTH : showLabel ? undefined : 28,
        height: 28,
      }}
      className={`
        relative inline-flex items-center py-1 pl-1 pr-1 rounded-full cursor-pointer select-none dark:ring-1 dark:ring-containerdark-900 shadow-sm
        ${bgClass}
        transition-[background-color,width] duration-100
      `}
    >
      {/* Icon "contact" — fades out when isContact */}
      <span
        className="flex items-center justify-center shrink-0 overflow-hidden"
        style={{
          width: isContact ? 0 : 20,
          height: 20,
          transition: `width 320ms ${easing}`,
        }}
      >
        <span
          className="flex items-center justify-center w-5 h-5"
          style={{
            opacity: isContact ? 0 : 1,
            transform: isContact ? "scale(0.6)" : "scale(1)",
            filter: isContact ? "blur(4px)" : "blur(0px)",
            transition: baseTransition,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/CorpIcon/contact.svg"
            alt="Contact"
            className="w-4 h-4 custom-icon"
          />
        </span>
      </span>

      {/* Text container — fills remaining space in contact mode, collapses otherwise */}
      <span
        className="flex items-center justify-center relative overflow-hidden"
        style={{
          height: 20,
          flex: isContact ? "1 1 auto" : "0 0 auto",
          width: isContact ? undefined : showLabel ? 58 : 0,
          transition: `width 320ms ${easing}`,
        }}
      >
        {/* "Contact" text — only when not in contact mode */}
        <span
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-[13px] font-[500] tracking-[-0.15px] text-neutrallight-900 dark:text-neutraldark-900"
          style={{
            opacity: isContact ? 0 : hover ? 1 : 0,
            transform: hover && !isContact ? "scale(1)" : "scale(0.6)",
            filter: hover && !isContact ? "blur(0px)" : "blur(4px)",
            transition: baseTransition,
          }}
        >
          Contact
        </span>

        {/* Email text — slides down on copy, comes back from top */}
        <span
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-[13px] font-[500] tracking-[-0.15px] text-neutrallight-900 dark:text-white"
          style={{
            opacity: isContact && !copied ? contentOpacity : 0,
            transform: !isContact
              ? "translateY(0) scale(0.6)"
              : copied
                ? "translateY(14px) scale(1)"
                : "translateY(0) scale(1)",
            filter: isContact && !copied ? "blur(0px)" : "blur(4px)",
            transition: isContact
              ? copied
                ? `opacity 200ms ${easing}, transform 280ms ${easing}, filter 220ms ${easing}`
                : `opacity 280ms ${easing} ${enterDelay}, transform 280ms ${easing} ${enterDelay}, filter 280ms ${easing} ${enterDelay}`
              : baseTransition,
          }}
        >
          {EMAIL}
        </span>

        {/* "Email copié" — comes from top, leaves to top */}
        <span
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-[13px] font-[500] tracking-[-0.15px] text-neutrallight-900 dark:text-white pointer-events-none"
          style={{
            opacity: copied ? contentOpacity : 0,
            transform: copied
              ? "translateY(0) scale(1)"
              : "translateY(-14px) scale(1)",
            filter: copied ? "blur(0px)" : "blur(4px)",
            transition: copied
              ? `opacity 280ms ${easing} 80ms, transform 280ms ${easing} 80ms, filter 280ms ${easing} 80ms`
              : `opacity 200ms ${easing}, transform 280ms ${easing}, filter 220ms ${easing}`,
          }}
        >
          Email copié
        </span>
      </span>

      {/* Right side icon area — copy / check */}
      <span
        className="relative overflow-hidden shrink-0 flex items-center justify-center"
        style={{
          width: isContact ? 20 : 0,
          height: 20,
          transition: `width 320ms ${easing}`,
        }}
      >
        {/* Copy icon — slides down on copy, comes back from top */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(e);
          }}
          aria-label="Copier l'email"
          className="absolute inset-0 flex items-center justify-center cursor-pointer text-white"
          style={{
            opacity: isContact && !copied ? contentOpacity : 0,
            transform: !isContact
              ? "translateY(0) scale(0.6)"
              : copied
                ? "translateY(14px) scale(1)"
                : "translateY(0) scale(1)",
            filter: isContact && !copied ? "blur(0px)" : "blur(4px)",
            transition: isContact
              ? copied
                ? `opacity 200ms ${easing}, transform 280ms ${easing}, filter 220ms ${easing}`
                : `opacity 280ms ${easing} ${enterDelay}, transform 280ms ${easing} ${enterDelay}, filter 280ms ${easing} ${enterDelay}`
              : `opacity 180ms ${easing}, transform 220ms ${easing}, filter 220ms ${easing}`,
            pointerEvents: isContact && !copied ? "auto" : "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/CorpIcon/copy.svg"
            alt="Copier"
            className="w-4 h-4 custom-icon"
          />
        </button>

        {/* Check icon — comes from top, leaves back to top */}
        <span
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: copied ? contentOpacity : 0,
            transform: copied
              ? "translateY(0) scale(1)"
              : "translateY(-14px) scale(1)",
            filter: copied ? "blur(0px)" : "blur(4px)",
            transition: copied
              ? `opacity 280ms ${easing} 80ms, transform 280ms ${easing} 80ms, filter 280ms ${easing} 80ms`
              : `opacity 200ms ${easing}, transform 280ms ${easing}, filter 220ms ${easing}`,
          }}
        >
          <CheckSmall />
        </span>
      </span>
    </div>
  );
}

/* ─── Right side icon button (send / copy) ─── */

type ActionIconButtonProps = {
  show: boolean;
  delay: number;
  ariaLabel: string;
  icon: string | null;
  iconNode?: React.ReactNode;
  variant?: "neutral" | "primary";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

function ActionIconButton({
  show,
  delay,
  ariaLabel,
  icon,
  iconNode,
  variant = "neutral",
  onClick,
}: ActionIconButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: show ? ICON_BTN_WIDTH : 0,
        marginLeft: show ? 0 : -GAP,
        opacity: show ? 1 : 0,
        transform: show ? "scale(1)" : "scale(0.6)",
        filter: show ? "blur(0px)" : "blur(4px)",
        transition: show
          ? `width 320ms ${easing}, margin-left 320ms ${easing}, opacity 280ms ${easing} ${delay}ms, transform 280ms ${easing} ${delay}ms, filter 280ms ${easing} ${delay}ms`
          : `width 280ms ${easing}, margin-left 280ms ${easing}, opacity 180ms ${easing}, transform 220ms ${easing}, filter 220ms ${easing}`,
        pointerEvents: show ? "auto" : "none",
      }}
      className={`
        inline-flex items-center justify-center h-[28px] rounded-full overflow-hidden shrink-0
        cursor-pointer
        ${
          isPrimary
            ? "bg-primarylight-900 dark:bg-primarydark-900 text-white hover:bg-primarylight-800 dark:hover:bg-primarydark-800"
            : "text-neutrallight-900 dark:text-neutraldark-900 hover:bg-neutrallight-300 dark:hover:bg-buttondark-900/60"
        }
        transition-colors duration-200
      `}
    >
      {iconNode ? (
        iconNode
      ) : icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/CorpIcon/${icon}.svg`}
          alt={ariaLabel}
          className={`w-4 h-4 ${isPrimary ? "svg-white-filter" : "custom-icon"}`}
        />
      ) : null}
    </button>
  );
}
