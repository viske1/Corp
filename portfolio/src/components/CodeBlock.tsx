"use client";

import { useState } from "react";
import { CodeLine } from "./CodeLine";

type CodeBlockProps = {
  lines: string[];
  startLineNumber: number;
  hideStatusBar?: boolean;
  hideActionButton?: boolean;
  numberWidth?: number;
};

export function CodeBlock({
  lines,
  startLineNumber,
  hideStatusBar = false,
  hideActionButton = false,
  numberWidth,
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
