"use client";

import { useState } from "react";
import { CodeLine } from "./CodeLine";

type CodeBlockProps = {
  lines: string[];
  startLineNumber: number;
  hideStatusBar?: boolean;
  hideActionButton?: boolean;
  numberWidth?: number;
  /** When true, each line stagger-fades in. */
  cascade?: boolean;
  /** Whether the cascade should reveal the lines (true) or hide them (false). */
  cascadeVisible?: boolean;
  /** Base delay before the cascade starts (ms). */
  cascadeBaseDelay?: number;
  /** Delay between each line (ms). */
  cascadeStagger?: number;
};

export function CodeBlock({
  lines,
  startLineNumber,
  hideStatusBar = false,
  hideActionButton = false,
  numberWidth,
  cascade = false,
  cascadeVisible = true,
  cascadeBaseDelay = 0,
  cascadeStagger = 60,
}: CodeBlockProps) {
  // For each line, how many visual lines it actually takes after wrapping
  const [visualCounts, setVisualCounts] = useState<number[]>(
    () => lines.map(() => 1),
  );

  // Compute the starting line number of each item from the visual counts
  const lineNumbers: number[] = [];
  let acc = startLineNumber;
  for (let i = 0; i < lines.length; i++) {
    lineNumbers.push(acc);
    acc += visualCounts[i] ?? 1;
  }

  return (
    <div className="flex flex-col">
      {lines.map((line, i) => (
        <CodeLine
          key={i}
          lineNumber={lineNumbers[i]}
          text={line}
          hideStatusBar={hideStatusBar}
          hideActionButton={hideActionButton}
          numberWidth={numberWidth}
          enterDelayMs={
            cascade
              ? cascadeVisible
                ? cascadeBaseDelay + i * cascadeStagger
                : (lines.length - 1 - i) * cascadeStagger
              : undefined
          }
          visible={cascade ? cascadeVisible : true}
          onMeasure={(count) => {
            setVisualCounts((prev) => {
              if (prev[i] === count) return prev;
              const next = [...prev];
              next[i] = count;
              return next;
            });
          }}
        />
      ))}
    </div>
  );
}
