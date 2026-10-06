"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { IconButton } from "./IconButton";
import { DropdownContainer } from "./DropdownContainer";
import { CustomButton } from "./CustomButton";
import { HoverList } from "./HoverList";
import { CustomBadge } from "./CustomBadge";
import { useView } from "./ViewContext";

const easing = "cubic-bezier(0.4, 0, 0.2, 1)";

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

export function Header() {
  const { theme, setTheme } = useTheme();
  const { view } = useView();
  const isCV = view === "cv";

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

  const themes: Array<{
    key: "light" | "dark" | "system";
    label: string;
    icon: string;
  }> = [
    { key: "light", label: "Clair", icon: "light-theme" },
    { key: "dark", label: "Sombre", icon: "dark-theme" },
    { key: "system", label: "Système", icon: "system" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50  ">
      <nav className="px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center justify-between py-1 pl-1 pr-2 rounded-full dark:bg-containerdark-900 bg-neutrallight-100 border-[1px] border-neutrallight-300 dark:border-borderdark-900 shadow-[0_4px_6px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_18px_-2px_rgba(0,0,0,1)] translate-y-[84px] mx-auto"
          style={{
            width: isCV ? 20 : 608,
            opacity: isCV ? 0 : 1,
            filter: isCV ? "blur(6px)" : "blur(0px)",
            transition: isCV
              ? `width 400ms ${easing} 180ms, opacity 250ms ${easing} 320ms, filter 250ms ${easing} 320ms`
              : `width 400ms ${easing} 200ms, opacity 250ms ${easing} 200ms, filter 250ms ${easing} 200ms`,
            pointerEvents: isCV ? "none" : "auto",
          }}
        >
          <div className="flex items-center gap-1">
            {/* Logo fav — leaves last (with theme button) */}
            <div
              style={{
                opacity: isCV ? 0 : 1,
                transform: isCV ? "scale(0)" : "scale(1)",
                filter: isCV ? "blur(1px)" : "blur(0px)",
                transition: isCV
                  ? `opacity 200ms ${easing} 140ms, transform 280ms ${easing} 80ms, filter 220ms ${easing} 140ms`
                  : `opacity 200ms ${easing} 460ms, transform 280ms ${easing} 460ms, filter 280ms ${easing} 460ms`,
              }}
            >
              <img src={`/CorpIcon/fav.png`} className=" w-7 h-7 mr-2" />
            </div>

            {/* Badge "Working" — leaves second (translates left to slide into En recherche's spot) */}
            <div
              style={{
                opacity: isCV ? 0 : 1,
                transform: isCV ? "translateX(24px)" : "translateX(0)",
                filter: isCV ? "blur(1px)" : "blur(0px)",
                transition: isCV
                  ? `opacity 250ms ${easing} 100ms, transform 320ms ${easing} 40ms, filter 250ms ${easing} 100ms`
                  : `opacity 250ms ${easing} 500ms, transform 320ms ${easing} 500ms, filter 250ms ${easing} 500ms`,
              }}
            >
              <CustomBadge
                text="Product Designer"
                colorScheme="neutral"
                variant="flat"
                rounded="full"
                size="lg"
              />
            </div>

            {/* Badge "En recherche" — leaves first (translates right, off-screen) */}
            <div
              style={{
                opacity: isCV ? 0 : 1,
                transform: isCV ? "translateX(24px)" : "translateX(0)",
                filter: isCV ? "blur(1px)" : "blur(0px)",
                transition: isCV
                  ? `opacity 250ms ${easing} 60ms, transform 320ms ${easing}, filter 250ms ${easing} 60ms`
                  : `opacity 250ms ${easing} 540ms, transform 320ms ${easing} 540ms, filter 250ms ${easing} 540ms`,
              }}
            >
              <CustomBadge
                text="Disponible · Full remote"
                colorScheme="success"
                variant="flat"
                rounded="full"
                size="lg"
              />
            </div>
          </div>

          {/* Theme button — leaves last together with logo */}
          <div
            ref={wrapperRef}
            className="relative inline-flex"
            style={{
              opacity: isCV ? 0 : 1,
              transform: isCV ? "scale(0)" : "scale(1)",
              filter: isCV ? "blur(1px)" : "blur(0px)",
              transition: isCV
                ? `opacity 200ms ${easing} 140ms, transform 280ms ${easing} 80ms, filter 220ms ${easing} 220ms`
                : `opacity 200ms ${easing} 460ms, transform 280ms ${easing} 460ms, filter 280ms ${easing} 460ms`,
            }}
          >
            <div className="relative inline-flex">
              <IconButton
                icon=""
                buttonType="light"
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
        </div>
      </nav>
    </header>
  );
}
