"use client";

import { ReactNode } from "react";
import { useView } from "./ViewContext";
import { leaveStyle, usePageTransition } from "./PageTransition";

type MainContentProps = {
  children: ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  const { view } = useView();
  const { leaving } = usePageTransition();
  const hidden = view === "cv" || leaving;

  return (
    <main
      className="fixed inset-0 overflow-y-auto"
      style={{ ...leaveStyle(hidden), transformOrigin: "50% 50%" }}
    >
      {children}
    </main>
  );
}
