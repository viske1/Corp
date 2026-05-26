"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { SpinnerLoader } from "./SpinnerLoader";

type ButtonType = "light" | "bordered" | "solid" | "flat";
type ColorScheme =
  | "primary"
  | "neutral"
  | "success"
  | "destructive"
  | "warning";
type Justify = "start" | "center" | "end";
type FontWeight = "semibold" | "medium-bold" | "medium";
type TextSize = "lg" | "sm";
type IconSize = "lg" | "sm";
type IconOpacity = "hg" | "md";
type TextAlign = "left" | "center" | "right";
type LoaderPosition = "left" | "right";

type CustomButtonProps = {
  text: string;
  type?: "button" | "submit" | "reset";
  leftIcon?: string;
  rightIcon?: string;
  isCustomLeftIcon?: boolean;
  isCustomRightIcon?: boolean;
  isBagdeLeft?: boolean;
  isBagdeRight?: boolean;
  badgeLeft?: string;
  badgeRight?: string;
  isDescription?: boolean;
  description?: string;
  title?: string;
  withNotificationBadge?: boolean;
  notifCount?: number;
  withRightNotificationBadge?: boolean;
  rightNotifCount?: number;
  noStyle?: boolean;
  isDisabled?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  loaderPosition?: LoaderPosition;
  customButtonStyle?: boolean;
  buttonType?: ButtonType;
  colorScheme?: ColorScheme;
  wFull?: boolean;
  justify?: Justify;
  fontWeight?: FontWeight;
  textSize?: TextSize;
  iconSize?: IconSize;
  iconOpacity?: IconOpacity;
  textAlign?: TextAlign;
  heightButton?: string;
  roundedTopLeft?: boolean;
  roundedTopRight?: boolean;
  roundedBottomLeft?: boolean;
  roundedBottomRight?: boolean;
  disableHoverBg?: boolean;
  noIconFilter?: boolean;
  leftIconNode?: ReactNode;
  rightIconNode?: ReactNode;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  onMouseEnter?: ButtonHTMLAttributes<HTMLButtonElement>["onMouseEnter"];
  onMouseLeave?: ButtonHTMLAttributes<HTMLButtonElement>["onMouseLeave"];
  onFocus?: ButtonHTMLAttributes<HTMLButtonElement>["onFocus"];
};

const getIconPath = (iconName: string) => `/CorpIcon/${iconName}.svg`;

const cn = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");

export function CustomButton({
  text,
  type = "button",
  leftIcon = "",
  rightIcon = "",
  isCustomLeftIcon = false,
  isCustomRightIcon = false,
  isBagdeLeft = false,
  isBagdeRight = false,
  badgeLeft = "",
  badgeRight = "",
  isDescription = false,
  description = "Description",
  title = "",
  withNotificationBadge = false,
  notifCount = 0,
  withRightNotificationBadge = false,
  rightNotifCount = 0,
  noStyle = false,
  isDisabled = false,
  disabled = false,
  isLoading = false,
  loaderPosition = "left",
  customButtonStyle = false,
  buttonType = "light",
  colorScheme = "neutral",
  wFull = true,
  justify = "center",
  fontWeight = "medium",
  textSize = "lg",
  iconSize = "lg",
  iconOpacity = "hg",
  textAlign = "left",
  heightButton = "h-[36px]",
  roundedTopLeft = true,
  roundedTopRight = true,
  roundedBottomLeft = true,
  roundedBottomRight = true,
  disableHoverBg = false,
  noIconFilter = false,
  leftIconNode,
  rightIconNode,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
}: CustomButtonProps) {
  const isInactive = isDisabled || disabled || isLoading;

  const spinnerColorScheme = buttonType === "solid" ? "white" : colorScheme;
  const iconSizePixels = 16;

  const textAlignClass =
    textAlign === "center"
      ? "text-center"
      : textAlign === "right"
        ? "text-right"
        : "text-left";

  const justifyClass =
    justify === "start"
      ? "justify-start"
      : justify === "end"
        ? "justify-end"
        : "justify-center";

  const fontWeightClass =
    fontWeight === "semibold"
      ? "font-semibold"
      : fontWeight === "medium-bold"
        ? "font-[500]"
        : "font-medium";

  const textSizeClass =
    textSize === "lg"
      ? "text-[13px] tracking-[-0.15px]"
      : "text-[12px] tracking-[-0.1px]";

  const iconSizeClass = iconSize === "lg" ? "w-[16px] h-[16px]" : "w-4 h-4";
  const iconOpacityClass =
    iconOpacity === "hg" ? "opacity-[1]" : "opacity-[0.7]";

  const borderRadiusClasses = cn(
    roundedTopLeft && "rounded-tl-[10px]",
    roundedTopRight && "rounded-tr-[10px]",
    roundedBottomLeft && "rounded-bl-[10px]",
    roundedBottomRight && "rounded-br-[10px]",
  );

  const textColorClasses = (() => {
    if (buttonType === "solid") {
      if (colorScheme === "neutral") return "text-white dark:text-black";
      return "text-white";
    }
    switch (colorScheme) {
      case "primary":
        return "text-primarylight-900 dark:text-primarydark-900";
      case "destructive":
        return "text-destructive-900 dark:text-destructive-900";
      case "warning":
        return "text-warning-900 dark:text-warning-900";
      case "success":
        return "text-success-900 dark:text-success-900";
      default:
        return "text-neutrallight-900 dark:text-neutraldark-900";
    }
  })();

  const badgeColor = (() => {
    if (buttonType === "solid") {
      if (colorScheme === "neutral") return "bg-white dark:text-black";
      if (colorScheme === "success")
        return "bg-success-300 dark:bg-success-300";
      return "bg-white";
    }
    if (buttonType === "flat") {
      switch (colorScheme) {
        case "primary":
          return "bg-primarylight-300 dark:bg-primarydark-300";
        case "destructive":
          return "bg-destructive-300 dark:bg-destructive-300";
        case "warning":
          return "bg-warning-300 dark:bg-warning-300";
        case "success":
          return "bg-success-300 dark:bg-success-300";
        default:
          return "bg-neutrallight-300 dark:bg-neutraldark-200";
      }
    }
    if (buttonType === "bordered") {
      switch (colorScheme) {
        case "primary":
          return "bg-primarylight-300 dark:bg-primarydark-300";
        case "destructive":
          return "bg-destructive-300 dark:bg-destructive-300";
        case "warning":
          return "bg-warning-300 dark:bg-warning-300";
        case "success":
          return "bg-success-300 dark:bg-success-300";
        default:
          return "bg-neutrallight-200 dark:bg-neutraldark-200";
      }
    }
    return "";
  })();

  const badgeTextColor = (() => {
    if (buttonType === "solid") {
      if (colorScheme === "neutral") return "text-white dark:text-black";
      if (colorScheme === "success")
        return "text-success-900 dark:text-success-900";
      return "text-white";
    }
    if (buttonType === "flat") {
      switch (colorScheme) {
        case "primary":
          return "text-primarylight-900 dark:text-primarydark-900";
        case "destructive":
          return "text-destructive-900 dark:text-destructive-900";
        case "warning":
          return "text-warning-900 dark:text-warning-900";
        case "success":
          return "text-success-900 dark:text-success-900";
        default:
          return "text-neutrallight-900 dark:text-neutraldark-900";
      }
    }
    return "";
  })();

  const buttonClasses = (() => {
    if (noStyle) return "style-less-btn px-2 py-1";
    if (customButtonStyle) {
      return cn(
        `justify-${justify}`,
        "inline-block px-3 py-2 font-medium text-xs leading-tight uppercase",
        borderRadiusClasses,
        "focus:outline-none focus:ring-0 custom-button-bg transition duration-150 ease-in-out flex items-center",
      );
    }

    const paddingClasses =
      leftIcon && rightIcon
        ? "pl-2 pr-2"
        : leftIcon
          ? "pl-2 pr-3"
          : rightIcon
            ? "pl-3 pr-2"
            : "px-2";

    const baseClasses = cn(
      "inline-block",
      paddingClasses,
      "font-medium text-xs leading-tight cursor-pointer",
      borderRadiusClasses,
      "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
      "transition duration-150 ease-in-out flex items-center",
      `justify-${justify}`,
      heightButton,
    );

    const variants: Record<ButtonType, Record<ColorScheme, string>> = {
      light: {
        primary:
          "text-primarylight-900 dark:text-primarydark-900 hover:bg-primarylight-200 dark:hover:bg-primarydark-50 active:bg-primarylight-300 dark:active:bg-primarydark-300",
        destructive:
          "text-destructive-900 dark:text-destructive-900 hover:bg-destructive-100 dark:hover:bg-destructive-100 active:bg-destructive-200 dark:active:bg-destructive-300",
        warning:
          "text-warning-900 dark:text-warning-900 hover:bg-warning-100 dark:hover:bg-warning-100 active:bg-warning-200 dark:active:bg-warning-300",
        success:
          "text-success-900 dark:text-success-900 hover:bg-success-100 dark:hover:bg-success-100 active:bg-success-200 dark:active:bg-success-300",
        neutral:
          "text-neutrallight-900 dark:text-neutraldark-900 hover:bg-neutrallight-200 dark:hover:bg-buttondark-900 active:bg-neutrallight-300 dark:active:bg-buttondark-900",
      },
      bordered: {
        primary:
          "bg-primarylight-50 dark:bg-primarydark-50 border-[1px] border-primarylight-300 dark:border-primarydark-300 text-primarylight-900 dark:text-primarydark-900 hover:bg-primarylight-100 dark:hover:bg-primarydark-100 active:bg-primarylight-200 dark:active:bg-primarydark-200 shadow-sm",
        destructive:
          "bg-destructive-100 dark:bg-destructive-100 border-[1px] border-destructive-200 dark:border-destructive-200 text-destructive-900 dark:text-destructive-900 hover:bg-destructive-100 dark:hover:bg-destructive-100 active:bg-destructive-200 dark:active:bg-destructive-200",
        warning:
          "bg-warning-100 dark:bg-warning-100 border-[1px] border-warning-200 dark:border-warning-200 text-warning-900 dark:text-warning-900 hover:bg-warning-100 dark:hover:bg-warning-200 active:bg-warning-200 dark:active:bg-warning-200",
        success:
          "bg-success-100 dark:bg-success-100 border-[1px] border-success-200 dark:border-success-200 text-success-900 dark:text-success-900 hover:bg-success-100 dark:hover:bg-success-100 active:bg-success-200 dark:active:bg-success-200",
        neutral:
          "bg-neutrallight-100 dark:bg-buttondark-900/70 border-[1px] border-neutrallight-300 dark:border-buttonborderdark-900 text-neutrallight-900 dark:text-neutraldark-900 hover:border-neutrallight-300 dark:hover:border-buttonborderdark-900 hover:bg-neutrallight-200 dark:hover:bg-buttondark-900 active:bg-neutrallight-200 dark:active:bg-neutraldark-200 focus:bg-neutrallight-200 shadow-sm",
      },
      solid: {
        primary:
          "bg-primarylight-900 dark:bg-primarydark-900 text-white hover:bg-primarylight-800 dark:hover:bg-primarydark-800 active:bg-primarylight-700 dark:active:bg-primarydark-700",
        destructive:
          "bg-destructive-900 dark:bg-destructive-900 text-white hover:bg-destructive-800 dark:hover:bg-destructive-800 active:bg-destructive-700 dark:active:bg-destructive-700",
        warning:
          "bg-warning-900 dark:bg-warning-900 text-white hover:bg-warning-800 dark:hover:bg-warning-800 active:bg-warning-700 dark:active:bg-warning-700",
        success:
          "bg-success-900 dark:bg-success-900 text-white hover:bg-success-800 dark:hover:bg-success-800 active:bg-success-700 dark:active:bg-success-700",
        neutral:
          "bg-neutrallight-900 dark:bg-neutraldark-900 text-white hover:bg-neutrallight-800 dark:hover:bg-neutraldark-800 active:bg-neutrallight-700 dark:active:bg-neutraldark-700 shadow-sm",
      },
      flat: {
        primary:
          "bg-primarylight-200 dark:bg-primarydark-50 text-primarylight-900 dark:text-primarydark-900 hover:bg-primarylight-300 dark:hover:bg-primarydark-100 active:bg-primarylight-400 dark:active:bg-primarydark-400",
        destructive:
          "bg-destructive-200 dark:bg-destructive-100 text-destructive-900 dark:text-destructive-900 hover:bg-destructive-300 dark:hover:bg-destructive-100 active:bg-destructive-400 dark:active:bg-destructive-400",
        warning:
          "bg-warning-200 dark:bg-warning-100 text-warning-900 dark:text-warning-900 hover:bg-warning-300 dark:hover:bg-warning-100 active:bg-warning-400 dark:active:bg-warning-400",
        success:
          "bg-success-200 dark:bg-success-100 text-success-900 dark:text-success-900 hover:bg-success-300 dark:hover:bg-success-100 active:bg-success-400 dark:active:bg-success-400",
        neutral:
          "bg-neutrallight-300/50 dark:bg-buttondark-900/50 text-neutrallight-900 dark:text-neutraldark-900 hover:bg-neutrallight-300 dark:hover:bg-buttondark-900 active:bg-neutrallight-400 dark:active:bg-inputdark-900",
      },
    };

    const variantClasses = variants[buttonType][colorScheme];
    const filtered = disableHoverBg
      ? variantClasses
          .split(" ")
          .filter(
            (c) =>
              !/^(?:dark:)?(?:hover|active|focus):bg-/.test(c) &&
              !/^(?:dark:)?(?:hover|active|focus):border-/.test(c),
          )
          .join(" ")
      : variantClasses;

    return cn(baseClasses, filtered);
  })();

  const solidIconFilter = buttonType === "solid" ? "svg-white-filter" : "";
  const colorIconFilter =
    buttonType !== "solid"
      ? colorScheme === "primary"
        ? "svg-primary-filter"
        : colorScheme === "destructive"
          ? "svg-destructive-filter"
          : colorScheme === "success"
            ? "svg-success-filter"
            : colorScheme === "warning"
              ? "svg-warning-filter"
              : ""
      : "";

  return (
    <button
      type={type}
      disabled={isInactive}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      className={cn(
        justifyClass,
        buttonClasses,
        "button-component",
        wFull && "w-full min-w-0",
        isInactive && "opacity-70 cursor-not-allowed",
      )}
    >
      <div
        className={cn(
          justifyClass,
          wFull && "w-full",
          "inline-flex relative items-center h-full min-w-0",
        )}
      >
        {isBagdeLeft && (
          <div
            className={cn(badgeColor, "ml-2 relative rounded-full px-1.5")}
            style={{ minWidth: 20, height: 20 }}
          >
            <span
              className={cn(
                badgeTextColor,
                textSizeClass,
                fontWeightClass,
                "text-[12px] font-medium",
              )}
              style={{ lineHeight: "0px" }}
            >
              {badgeLeft}
            </span>
          </div>
        )}

        {isLoading && !leftIcon && loaderPosition === "left" && (
          <div className="mr-2 relative flex items-center">
            <SpinnerLoader
              customSize={iconSizePixels}
              colorScheme={spinnerColorScheme}
            />
          </div>
        )}

        {(leftIcon || leftIconNode) && (
          <div
            className={cn(
              "mr-1.5 relative flex items-center justify-center",
              (isDisabled || disabled) && "opacity-50 cursor-not-allowed",
            )}
          >
            {withNotificationBadge && notifCount > 0 && (
              <div className="notification-bagde absolute inline-block translate-x-6 -translate-y-1/2 top-0 right-0 py-0.5 px-2 text-xs leading-none text-center whitespace-nowrap font-bold text-white bg-primarylight-900 dark:bg-primarydark-900 rounded-full z-10">
                {notifCount}
              </div>
            )}
            {isLoading ? (
              <SpinnerLoader
                customSize={iconSizePixels}
                colorScheme={spinnerColorScheme}
              />
            ) : leftIconNode ? (
              leftIconNode
            ) : isCustomLeftIcon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getIconPath(leftIcon)}
                alt={title || leftIcon}
                className={cn(
                  iconSizeClass,
                  iconOpacityClass,
                  !noIconFilter && solidIconFilter,
                  !noIconFilter && colorIconFilter,
                  !noIconFilter && "custom-icon",
                )}
              />
            ) : null}
          </div>
        )}

        <div
          className={cn(
            "flex flex-col justify-center items-center",
            (isDisabled || disabled) && "opacity-50 cursor-not-allowed",
          )}
        >
          <span
            className={cn(
              textColorClasses,
              textSizeClass,
              fontWeightClass,
              textAlignClass,
              "whitespace-nowrap overflow-hidden text-ellipsis",
            )}
          >
            {text}
          </span>
          {isDescription && (
            <span
              className={cn(
                textColorClasses,
                "text-[11px] font-medium tracking-[-0.1px] text-left opacity-[0.5] pt-[2px]",
              )}
            >
              {description}
            </span>
          )}
        </div>

        {isBagdeRight && (
          <div
            className={cn(
              badgeColor,
              "ml-2 relative flex items-center justify-center rounded-full px-1.5",
            )}
            style={{ minWidth: 20, height: 20 }}
          >
            <span
              className={cn(
                badgeTextColor,
                textSizeClass,
                fontWeightClass,
                "text-[12px] font-semibold",
              )}
              style={{ lineHeight: "0px" }}
            >
              {badgeRight}
            </span>
          </div>
        )}

        {rightIcon && (
          <div
            className={cn(
              "ml-2 relative flex items-center justify-center",
              (isDisabled || disabled) && "opacity-50 cursor-not-allowed",
            )}
          >
            {withRightNotificationBadge && rightNotifCount > 0 && (
              <div className="notification-bagde absolute inline-block translate-x-6 -translate-y-1/2 top-0 right-0 py-0.5 px-2 text-xs leading-none text-center whitespace-nowrap font-bold text-white bg-primarylight-900 dark:bg-primarydark-900 rounded-full z-10">
                {rightNotifCount}
              </div>
            )}
            {isLoading ? (
              <SpinnerLoader
                customSize={iconSizePixels}
                colorScheme={spinnerColorScheme}
              />
            ) : isCustomRightIcon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getIconPath(rightIcon)}
                alt={title || rightIcon}
                className={cn(
                  iconSizeClass,
                  iconOpacityClass,
                  !noIconFilter && solidIconFilter,
                  !noIconFilter &&
                    buttonType !== "solid" &&
                    colorScheme === "primary"
                    ? "svg-primary-filter"
                    : "",
                  !noIconFilter && "custom-icon",
                )}
              />
            ) : null}
          </div>
        )}

        {isLoading && !rightIcon && loaderPosition === "right" && (
          <div className="ml-2 relative">
            <SpinnerLoader
              customSize={iconSizePixels}
              colorScheme={spinnerColorScheme}
            />
          </div>
        )}
      </div>
    </button>
  );
}
