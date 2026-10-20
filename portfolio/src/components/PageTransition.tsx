"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ComponentProps,
  createContext,
  CSSProperties,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const easing = "cubic-bezier(0.4, 0, 0.2, 1)";
// Longest leave transition below: we navigate once the outgoing view is gone.
const LEAVE_DURATION = 380;
// Cascade step between `.reveal` elements entering together.
const REVEAL_STEP = 50;

// Same exit as MainContent's "normal → cv" transition, shared so every view
// leaves the same way.
export function leaveStyle(hidden: boolean): CSSProperties {
  return {
    opacity: hidden ? 0 : 1,
    transform: hidden ? "scale(0.92)" : "scale(1)",
    filter: hidden ? "blur(8px)" : "blur(0px)",
    transition: hidden
      ? `opacity 300ms ${easing}, transform 380ms ${easing}, filter 280ms ${easing}`
      : `opacity 320ms ${easing} 200ms, transform 380ms ${easing} 200ms, filter 320ms ${easing} 200ms`,
    pointerEvents: hidden ? "none" : "auto",
  };
}

// Fixed chrome (header, bottom bar) simply fades out with the leaving view.
export function chromeFade(leaving: boolean): CSSProperties {
  return {
    opacity: leaving ? 0 : 1,
    transition: `opacity 300ms ${easing}`,
    pointerEvents: leaving ? "none" : undefined,
  };
}

type PageTransitionValue = {
  leaving: boolean;
  navigate: (href: string) => void;
};

const PageTransitionContext = createContext<PageTransitionValue | null>(null);

// Client-side navigation (no reload) between views. On navigate, the current
// view plays its leave animation (`leaving`), then the route changes and the
// incoming view's `.reveal` elements cascade in as they become visible.
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // Path we're leaving. Once the new route renders, pathname no longer matches.
  const [leavingFrom, setLeavingFrom] = useState<string | null>(null);
  // Reset once we've left, so coming back (browser back) doesn't stay hidden.
  if (leavingFrom !== null && leavingFrom !== pathname) setLeavingFrom(null);
  const leaving = leavingFrom === pathname;

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) {
        router.push(href);
        return;
      }
      setLeavingFrom(pathname);
      window.setTimeout(() => router.push(href), LEAVE_DURATION);
    },
    [pathname, router],
  );

  useRevealOnView(pathname);

  const value = useMemo(() => ({ leaving, navigate }), [leaving, navigate]);

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
    </PageTransitionContext.Provider>
  );
}

// Reveals `.reveal` elements when they enter the viewport. Elements becoming
// visible together (e.g. everything above the fold on arrival) cascade in
// order; the ones further down animate as they're scrolled into view.
function useRevealOnView(pathname: string) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.setProperty("--reveal-delay", `${i * REVEAL_STEP}ms`);
          el.classList.add("is-revealed");
          observer.unobserve(el);
          i++;
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document
      .querySelectorAll(".reveal:not(.is-revealed)")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx)
    throw new Error("usePageTransition must be used within a PageTransition");
  return ctx;
}

// Wrapper for a page's content: plays the shared leave animation on navigate.
// The scale origin is set to the viewport centre so long, scrolled pages
// shrink around what the user is looking at.
export function PageContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { leaving } = usePageTransition();
  // Only read when leaving, which never happens during SSR.
  const origin = leaving
    ? `50% ${window.scrollY + window.innerHeight / 2}px`
    : "50% 50%";

  return (
    <main
      className={className}
      style={{ ...leaveStyle(leaving), transformOrigin: origin }}
    >
      {children}
    </main>
  );
}

type TransitionLinkProps = ComponentProps<typeof Link> & { href: string };

// Drop-in replacement for next/link that plays the leave animation first.
// Modifier clicks (new tab, etc.) keep the native behaviour.
export function TransitionLink({
  href,
  onClick,
  ...props
}: TransitionLinkProps) {
  const { navigate } = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    e.preventDefault();
    navigate(href);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
