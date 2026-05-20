"use client";

import { ButtonHTMLAttributes, ReactNode, useEffect, useState } from "react";

type ActionPillProps = {
  icon: string;
  label: string;
  labelWidth: number;
  isCustomIcon?: boolean;
  noIconFilter?: boolean;
  forceShowLabel?: boolean;
  iconNode?: ReactNode;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

const cn = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");

export function ActionPill({
  icon,
  label,
  labelWidth,
  isCustomIcon = true,
  noIconFilter = false,
  forceShowLabel = false,
  iconNode,
  onClick,
}: ActionPillProps) {
  const [hover, setHover] = useState(false);

  // Reset hover when labelWidth becomes 0 (icon-only mode forced by parent)
  useEffect(() => {
    if (labelWidth === 0) setHover(false);
  }, [labelWidth]);

  const showLabel = forceShowLabel || (hover && labelWidth > 0);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
      className={cn(
        "relative inline-flex items-center cursor-pointer py-1 px-1 rounded-full",
        showLabel || hover
          ? "bg-neutrallight-200 dark:bg-buttondark-900"
          : "bg-transparent",
        "transition-colors duration-200",
      )}
    >
      <span className="flex items-center justify-center w-5 h-5 shrink-0 text-neutrallight-900 dark:text-neutraldark-900">
        {iconNode ? (
          iconNode
        ) : isCustomIcon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/CorpIcon/${icon}.svg`}
            alt={label}
            className={cn("w-4 h-4", !noIconFilter && "custom-icon")}
          />
        ) : null}
      </span>
      <span
        className="overflow-hidden flex items-center justify-center"
        style={{
          width: showLabel ? labelWidth : 0,
          transition: "width 350ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <span
          className={cn(
            "block whitespace-nowrap text-[13px] font-[500] tracking-[-0.15px]",
            "text-neutrallight-900 dark:text-neutraldark-900",
          )}
          style={{
            opacity: showLabel ? 1 : 0,
            transform: showLabel ? "scale(1)" : "scale(0.6)",
            filter: showLabel ? "blur(0px)" : "blur(4px)",
            transition: showLabel
              ? "opacity 350ms cubic-bezier(0.4, 0, 0.2, 1) 20ms, transform 350ms cubic-bezier(0.4, 0, 0.2, 1) 20ms, filter 350ms cubic-bezier(0.4, 0, 0.2, 1) 20ms"
              : "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 350ms cubic-bezier(0.4, 0, 0.2, 1), filter 350ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {label}
        </span>
      </span>
    </button>
  );
}
