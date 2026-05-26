"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

type Position =
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"
  | "top-left"
  | "top-right"
  | "top-center";
type Size = "auto" | "sm" | "md" | "lg" | "xl" | "full";
type Shadow = "sm" | "md" | "lg";

type DropdownContainerProps = {
  isVisible: boolean;
  position?: Position;
  width?: Size | string;
  height?: Size | string;
  scrollable?: boolean;
  maxHeight?: string;
  offsetX?: number;
  offsetY?: number;
  shadow?: Shadow;
  zIndexClass?: string;
  children?: ReactNode;
};

const POSITION_CLASSES: Record<Position, string> = {
  "bottom-left": "top-full left-0",
  "bottom-right": "top-full right-0",
  "bottom-center": "top-full left-1/2 -translate-x-1/2",
  "top-left": "bottom-full left-0",
  "top-right": "bottom-full right-0",
  "top-center": "bottom-full left-1/2 -translate-x-1/2",
};

const WIDTH_CLASSES: Record<Size, string> = {
  auto: "w-auto min-w-[200px]",
  sm: "w-48",
  md: "w-64",
  lg: "w-80",
  xl: "w-96",
  full: "w-full",
};

const HEIGHT_CLASSES: Record<Size, string> = {
  auto: "h-auto",
  sm: "h-32",
  md: "h-48",
  lg: "h-64",
  xl: "h-80",
  full: "h-full",
};

const SHADOW_CLASSES: Record<Shadow, string> = {
  sm: "shadow-[0_2px_8px_-2px_rgba(156,163,175,0.1)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.8)]",
  md: "shadow-md dark:shadow-[0_5px_20px_-2px_rgba(0,0,0,0.7)]",
  lg: "shadow-[0_10px_30px_-4px_rgba(156,163,175,0.6)] dark:shadow-[0_10px_30px_-4px_rgba(0,0,0,1.2)]",
};

const isPresetSize = (value: string): value is Size => value in WIDTH_CLASSES;

export function DropdownContainer({
  isVisible,
  position = "bottom-left",
  width = "auto",
  height = "auto",
  scrollable = false,
  maxHeight = "300px",
  offsetX = 0,
  offsetY = 0,
  shadow = "md",
  zIndexClass = "z-50",
  children,
}: DropdownContainerProps) {
  const [isMounted, setIsMounted] = useState(isVisible);
  const [isEntering, setIsEntering] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isVisible) {
      if (exitTimer.current) clearTimeout(exitTimer.current);
      setIsMounted(true);
      const raf = requestAnimationFrame(() => setIsEntering(true));
      return () => cancelAnimationFrame(raf);
    }
    setIsEntering(false);
    exitTimer.current = setTimeout(() => setIsMounted(false), 150);
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, [isVisible]);

  if (!isMounted) return null;

  const widthClass = isPresetSize(width) ? WIDTH_CLASSES[width] : "";
  const heightClass = isPresetSize(height) ? HEIGHT_CLASSES[height] : "";
  const scrollableClass = scrollable ? "overflow-y-auto" : "overflow-hidden";

  const opensUpward = position.startsWith("top");
  const originClass = opensUpward ? "origin-bottom" : "origin-top";
  const hiddenTransform = opensUpward
    ? "opacity-0 translate-y-2.5 scale-95"
    : "opacity-0 -translate-y-2.5 scale-95";
  const visibleTransform = "opacity-100 translate-y-0 scale-100";

  const customStyles: CSSProperties = {};
  if (!widthClass && width !== "auto") customStyles.width = width;
  if (!heightClass && height !== "auto") customStyles.height = height;
  if (scrollable) customStyles.maxHeight = maxHeight;

  if (offsetX !== 0) {
    if (position.endsWith("center")) customStyles.marginLeft = `${offsetX}px`;
    else if (position.endsWith("left")) customStyles.left = `${offsetX}px`;
    else customStyles.right = `${offsetX}px`;
  }
  if (offsetY !== 0) {
    if (position.startsWith("bottom"))
      customStyles.top = `calc(100% + ${offsetY}px)`;
    else customStyles.bottom = `calc(100% + ${offsetY}px)`;
  }

  return (
    <div
      className={[
        "absolute h-auto bg-neutrallight-100 dark:bg-containerdark-900 rounded-[14px] border-[1px] border-neutrallight-300 dark:border-borderdark-900",
        "transition-all duration-150 ease-out",
        originClass,
        isEntering ? visibleTransform : hiddenTransform,
        POSITION_CLASSES[position],
        widthClass,
        heightClass,
        scrollableClass,
        SHADOW_CLASSES[shadow],
        zIndexClass,
      ]
        .filter(Boolean)
        .join(" ")}
      style={customStyles}
      onClick={(e) => e.stopPropagation()}
    >
      {children ?? (
        <div className="py-2 px-3 text-sm text-neutrallight-600 dark:text-neutraldark-600">
          Contenu personnalisé
        </div>
      )}
    </div>
  );
}
