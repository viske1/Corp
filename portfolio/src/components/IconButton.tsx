"use client";

import { ButtonHTMLAttributes } from "react";
import { SpinnerLoader } from "./SpinnerLoader";
import { CustomTooltip } from "./CustomTooltip";

type ButtonType = "light" | "bordered" | "solid" | "flat";
type ColorScheme =
  | "primary"
  | "neutral"
  | "warning"
  | "destructive"
  | "success";
type Size = "xs" | "sm" | "md" | "lg";
type TooltipPosition =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right"
  | "left"
  | "right";

type IconButtonProps = {
  icon?: string;
  isCustomIcon?: boolean;
  title?: string;
  withNotificationBadge?: boolean;
  notifCount?: number;
  noStyle?: boolean;
  iconSize?: number;
  isDisabled?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  customButtonStyle?: boolean;
  buttonType?: ButtonType;
  colorScheme?: ColorScheme;
  size?: Size;
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

const getIconPath = (iconName: string) => `/CorpIcon/${iconName}.svg`;

const cn = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");

const ICON_SIZE_MAP: Record<number, string> = {
  12: "w-3 h-3",
  16: "w-4 h-4",
  20: "w-5 h-5",
  24: "w-6 h-6",
  32: "w-8 h-8",
  40: "w-10 h-10",
  48: "w-12 h-12",
};

const BUTTON_SIZE_MAP: Record<Size, string> = {
  xs: "w-[22px] h-[22px] rounded-[5.5px]",
  sm: "w-7 h-7 rounded-lg",
  md: "w-8 h-8 rounded-lg",
  lg: "w-9 h-9 rounded-lg",
};

export function IconButton({
  icon = "user",
  isCustomIcon = false,
  title = "",
  withNotificationBadge = false,
  notifCount = 8,
  noStyle = false,
  iconSize = 16,
  isDisabled = false,
  disabled = false,
  isLoading = false,
  customButtonStyle = false,
  buttonType = "light",
  colorScheme = "neutral",
  size = "lg",
  tooltip = "",
  tooltipPosition = "top",
  onClick,
}: IconButtonProps) {
  const isInactive = isDisabled || disabled || isLoading;

  const spinnerColorScheme = buttonType === "solid" ? "white" : colorScheme;
  const iconSizeClass = ICON_SIZE_MAP[iconSize] || "w-4 h-4";
  const buttonSizeClass = BUTTON_SIZE_MAP[size];

  const buttonClasses = (() => {
    if (noStyle) return "style-less-btn px-1 text-zinc";
    if (customButtonStyle) {
      return cn(
        "inline-block",
        buttonSizeClass,
        "text-zinc font-medium text-xs leading-tight uppercase rounded-lg focus:outline-none custom-button-bg transition duration-150 ease-in-out flex items-center justify-center",
      );
    }

    const baseClasses = cn(
      "inline-block",
      buttonSizeClass,
      "font-medium text-xs leading-tight uppercase cursor-pointer",
      "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
      "transition duration-150 ease-in-out flex items-center justify-center",
    );

    const variants: Record<ButtonType, Record<ColorScheme, string>> = {
      light: {
        primary:
          "text-primarylight-900 dark:text-primarydark-900 hover:bg-primarylight-200 dark:hover:bg-primarydark-50 active:bg-primarylight-300 dark:active:bg-primarydark-300",
        warning: "text-warning-900 hover:bg-warning-100 active:bg-warning-200",
        destructive:
          "text-destructive-900 dark:text-destructive-900 hover:bg-destructive-100 dark:hover:bg-destructive-100 active:bg-destructive-200 dark:active:bg-destructive-300",
        success:
          "text-success-900 dark:text-success-900 hover:bg-success-100 dark:hover:bg-success-100 active:bg-success-200 dark:active:bg-success-300",
        neutral:
          "text-neutrallight-900 dark:text-neutraldark-900 hover:bg-neutrallight-200 dark:hover:bg-buttondark-900 active:bg-neutrallight-300 dark:active:bg-buttondark-900",
      },
      bordered: {
        primary:
          "bg-primarylight-50 dark:bg-primarydark-50 border-[0.5px] border-primarylight-200 dark:border-primarydark-200 text-primarylight-900 dark:text-primarydark-900 hover:bg-primarylight-100 dark:hover:bg-primarydark-100 active:bg-primarylight-200 dark:active:bg-primarydark-200",
        warning:
          "bg-warning-100 border-[0.5px] border-warning-300 text-warning-900 hover:bg-warning-200 active:bg-warning-300 shadow-sm",
        destructive:
          "bg-destructive-100 dark:bg-destructive-100 border-[0.5px] border-destructive-200 dark:border-destructive-200 text-destructive-900 dark:text-destructive-900 hover:bg-destructive-100 dark:hover:bg-destructive-100 active:bg-destructive-200 dark:active:bg-destructive-200",
        success:
          "bg-success-100 dark:bg-success-100 border-[0.5px] border-success-300 dark:border-success-300 text-success-900 dark:text-success-900 hover:bg-success-200 dark:hover:bg-success-200 active:bg-success-300 dark:active:bg-success-300",
        neutral:
          "bg-neutrallight-100 dark:bg-buttondark-900/70 border-[0.5px] border-neutrallight-300 dark:border-buttonborderdark-900 text-neutrallight-900 dark:text-neutraldark-900 hover:border-neutrallight-300 dark:hover:border-buttonborderdark-900 hover:bg-neutrallight-200 dark:hover:bg-buttondark-900 active:bg-neutrallight-200 dark:active:bg-neutraldark-200 shadow-sm",
      },
      solid: {
        primary:
          "bg-primarylight-900 dark:bg-primarydark-900 text-white hover:bg-primarylight-800 dark:hover:bg-primarydark-800 active:bg-primarylight-700 dark:active:bg-primarydark-700",
        warning:
          "bg-warning-900 text-white hover:bg-warning-800 active:bg-warning-700 shadow-sm",
        destructive:
          "bg-destructive-900 dark:bg-destructive-900 text-white hover:bg-destructive-800 dark:hover:bg-destructive-800 active:bg-destructive-700 dark:active:bg-destructive-700",
        success:
          "bg-success-900 dark:bg-success-900 text-white hover:bg-success-800 dark:hover:bg-success-800 active:bg-success-700 dark:active:bg-success-700",
        neutral:
          "bg-neutrallight-900 dark:bg-neutraldark-900 text-white hover:bg-neutrallight-800 dark:hover:bg-neutraldark-800 active:bg-neutrallight-700 dark:active:bg-neutraldark-700 shadow-sm",
      },
      flat: {
        primary:
          "bg-primarylight-200 dark:bg-primarydark-50 text-primarylight-900 dark:text-primarydark-900 hover:bg-primarylight-300 dark:hover:bg-primarydark-100 active:bg-primarylight-400 dark:active:bg-primarydark-400",
        warning:
          "bg-warning-200 text-warning-900 hover:bg-warning-300 active:bg-warning-400",
        destructive:
          "bg-destructive-200 dark:bg-destructive-100 text-destructive-900 dark:text-destructive-900 hover:bg-destructive-300 dark:hover:bg-destructive-100 active:bg-destructive-400 dark:active:bg-destructive-400",
        success:
          "bg-success-200 dark:bg-success-100 text-success-900 dark:text-success-900 hover:bg-success-300 dark:hover:bg-success-200 active:bg-success-400 dark:active:bg-success-400",
        neutral:
          "bg-neutrallight-300/50 dark:bg-buttondark-900/50 text-neutrallight-900 dark:text-neutraldark-900 hover:bg-neutrallight-300 dark:hover:bg-buttondark-900 active:bg-neutrallight-400 dark:active:bg-inputdark-900",
      },
    };

    return cn(baseClasses, variants[buttonType][colorScheme]);
  })();

  const solidIconFilter = buttonType === "solid" ? "svg-white-filter" : "";
  const colorIconFilter =
    buttonType !== "solid"
      ? colorScheme === "primary"
        ? "svg-primary-filter"
        : colorScheme === "warning"
          ? "svg-warning-filter"
          : colorScheme === "destructive"
            ? "svg-destructive-filter"
            : colorScheme === "success"
              ? "svg-success-filter"
              : ""
      : "";

  return (
    <CustomTooltip
      text={tooltip}
      position={tooltipPosition}
      disabled={!tooltip}
    >
      <div className="relative inline-flex">
        <button
          title={!tooltip ? title : ""}
          type="button"
          disabled={isInactive}
          onClick={onClick}
          className={cn(
            buttonClasses,
            "button-component relative",
            isInactive && "opacity-[0.7] cursor-not-allowed",
          )}
        >
          {isLoading ? (
            <SpinnerLoader
              customSize={iconSize}
              colorScheme={spinnerColorScheme}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              {withNotificationBadge && (
                <div
                  className="notification-bagde absolute right-[-5px] inline-block top-0 py-0.5 px-1 text-[10px] leading-none text-center whitespace-nowrap font-semibold text-white bg-primarylight-900 dark:bg-primarydark-900 rounded-full z-10"
                  style={{ top: "0px" }}
                >
                  {notifCount}
                </div>
              )}
              {isCustomIcon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getIconPath(icon)}
                  alt={title || icon}
                  className={cn(
                    iconSizeClass,
                    (isDisabled || disabled) && "opacity-[0.5]",
                    solidIconFilter,
                    colorIconFilter,
                    "custom-icon dark:opacity-100",
                  )}
                />
              )}
            </div>
          )}
        </button>
      </div>
    </CustomTooltip>
  );
}
