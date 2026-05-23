"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { IconButton } from "./IconButton";
import { DropdownContainer } from "./DropdownContainer";
import { CustomButton } from "./CustomButton";
import { HoverList } from "./HoverList";

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const themes: Array<{
  key: "light" | "dark" | "system";
  label: string;
  icon: string;
}> = [
  { key: "light", label: "Clair", icon: "light-theme" },
  { key: "dark", label: "Sombre", icon: "dark-theme" },
  { key: "system", label: "Système", icon: "system" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className="relative inline-flex">
      <div className="relative inline-flex">
        <IconButton
          icon=""
          buttonType="bordered"
          colorScheme="neutral"
          size="sm"
          onClick={() => setIsOpen((v) => !v)}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {themes.map((th) => {
            const active = mounted && theme === th.key;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={th.key}
                src={`/CorpIcon/${th.icon}.svg`}
                alt={th.label}
                className="theme-morph-icon absolute w-4 h-4"
                data-active={active}
              />
            );
          })}
        </div>
      </div>

      <DropdownContainer
        isVisible={isOpen}
        position="bottom-center"
        width="132px"
        offsetY={10}
      >
        <div className=" flex flex-col">
          <HoverList className="flex flex-col p-1">
            {themes.map((th) => {
              const active = mounted && theme === th.key;
              return (
                <div key={th.key} className="relative">
                  <CustomButton
                    text={th.label}
                    buttonType="light"
                    colorScheme="neutral"
                    justify="start"
                    textAlign="left"
                    disableHoverBg
                    leftIcon={th.icon}
                    isCustomLeftIcon
                    onClick={() => {
                      setTheme(th.key);
                      setIsOpen(false);
                    }}
                    heightButton="h-[32px]"
                    fontWeight="medium-bold"
                  />
                  {active && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutrallight-900 dark:text-neutraldark-900">
                      <CheckIcon />
                    </span>
                  )}
                </div>
              );
            })}
          </HoverList>
        </div>
      </DropdownContainer>
    </div>
  );
}
