"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ComponentProps,
  createContext,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const easing = "cubic-bezier(0.4, 0, 0.2, 1)";
// Must match the opacity transition below: we navigate once the fade-out ends.
const LEAVE_DURATION = 300;

type PageTransitionValue = {
  navigate: (href: string) => void;
};

const PageTransitionContext = createContext<PageTransitionValue | null>(null);

// Wraps every page. Client-side navigation (no reload) with a fade-out of the
// current view before the route changes; the incoming view handles its own
// entrance (see the `.reveal` class in globals.css).
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // Path we're fading out of. Once the new route renders, pathname no longer
  // matches and the wrapper comes back on its own.
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

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <PageTransitionContext.Provider value={value}>
      <div
        style={{
          opacity: leaving ? 0 : 1,
          transition: `opacity ${LEAVE_DURATION}ms ${easing}`,
          pointerEvents: leaving ? "none" : undefined,
        }}
      >
        {children}
      </div>
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx)
    throw new Error("usePageTransition must be used within a PageTransition");
  return ctx;
}

type TransitionLinkProps = ComponentProps<typeof Link> & { href: string };

// Drop-in replacement for next/link that plays the page fade-out first.
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
