"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useRef,
  useState,
} from "react";

type HoverListProps = {
  children: ReactNode;
  className?: string;
  indicatorClassName?: string;
  rounded?: string;
};

type Rect = { top: number; left: number; width: number; height: number };

export function HoverList({
  children,
  className = "",
  indicatorClassName = "bg-neutrallight-200 dark:bg-buttondark-900",
  rounded = "rounded-[10px]",
}: HoverListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(true);

  const updateRect = (target: HTMLElement, instant: boolean) => {
    const container = containerRef.current;
    if (!container) return;
    const cBox = container.getBoundingClientRect();
    const tBox = target.getBoundingClientRect();
    setAnimate(!instant);
    setRect({
      top: tBox.top - cBox.top,
      left: tBox.left - cBox.left,
      width: tBox.width,
      height: tBox.height,
    });
    setVisible(true);
  };

  const items = Children.toArray(children).filter(isValidElement) as ReactElement<{
    onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
    disableHoverBg?: boolean;
  }>[];

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseLeave={() => setVisible(false)}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute ${rounded} ${indicatorClassName} ${
          animate ? "transition-all duration-100 ease-out" : ""
        }`}
        style={{
          top: rect?.top ?? 0,
          left: rect?.left ?? 0,
          width: rect?.width ?? 0,
          height: rect?.height ?? 0,
          opacity: visible && rect ? 1 : 0,
        }}
      />
      {items.map((child, i) => {
        // Only pass `disableHoverBg` to React components, not DOM elements
        const isDOMElement = typeof child.type === "string";
        const extraProps: Record<string, unknown> = {
          key: child.key ?? i,
          onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
            updateRect(e.currentTarget, !visible);
            child.props.onMouseEnter?.(e);
          },
          onFocus: (e: React.FocusEvent<HTMLElement>) => {
            updateRect(e.currentTarget, !visible);
            child.props.onFocus?.(e);
          },
        };
        if (!isDOMElement) {
          extraProps.disableHoverBg = true;
        }
        return cloneElement(child, extraProps);
      })}
    </div>
  );
}
