import { ReactNode } from "react";

type ColorScheme = "neutral" | "success" | "warning" | "destructive";
type Variant = "flat" | "bordered" | "filled";
type Size = "xs" | "sm" | "md" | "lg";
type Rounded = "sm" | "md" | "full";

type CustomBadgeProps = {
  children?: ReactNode;
  text?: string;
  colorScheme?: ColorScheme;
  variant?: Variant;
  size?: Size;
  rounded?: Rounded;
  leftIcon?: string;
  rightIcon?: string;
  isCustomLeftIcon?: boolean;
  isCustomRightIcon?: boolean;
  noIconFilter?: boolean;
  className?: string;
};

const cn = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");

const getIconPath = (iconName: string) => `/CorpIcon/${iconName}.svg`;

const SIZE_CLASSES: Record<Size, string> = {
  xs: "text-[10px] tracking-[-0.17px] leading-none px-1.5 py-0.5 gap-1",
  sm: "text-[11px] tracking-[-0.18px] leading-none px-2 py-0.5 gap-1",
  md: "text-[12px] tracking-[-0.2px] leading-none px-2 py-1 gap-1.5",
  lg: "text-[13px] tracking-[-0.3px] leading-none px-2 py-1 gap-1.5",
};

const ICON_SIZE_CLASSES: Record<Size, string> = {
  xs: "w-2.5 h-2.5",
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
  lg: "w-4 h-4",
};

const ROUNDED_CLASSES: Record<Rounded, string> = {
  sm: "rounded-[4px]",
  md: "rounded-[6px]",
  full: "rounded-full",
};

const VARIANTS: Record<Variant, Record<ColorScheme, string>> = {
  flat: {
    neutral:
      "bg-neutrallight-300 text-neutrallight-900 dark:bg-buttondark-900/50 dark:text-neutraldark-900",
    success: "bg-success-200 text-success-900 dark:bg-success-100",
    warning: "bg-warning-200 text-warning-900 dark:bg-warning-100",
    destructive:
      "bg-destructive-200 text-destructive-900 dark:bg-destructive-100",
  },
  bordered: {
    neutral:
      "bg-neutrallight-100 text-neutrallight-900 border-[1px] border-neutrallight-300 dark:bg-buttondark-900/70 dark:text-neutraldark-900 dark:border-buttonborderdark-900",
    success:
      "bg-success-100 text-success-900 border-[1px] border-success-300 dark:border-success-300",
    warning:
      "bg-warning-100 text-warning-900 border-[1px] border-warning-300 dark:border-warning-300",
    destructive:
      "bg-destructive-100 text-destructive-900 border-[1px] border-destructive-300 dark:border-destructive-300",
  },
  filled: {
    neutral:
      "bg-neutrallight-900 text-white dark:bg-neutraldark-900 dark:text-black",
    success: "bg-success-900 text-white",
    warning: "bg-warning-900 text-white",
    destructive: "bg-destructive-900 text-white",
  },
};

const ICON_FILTERS: Record<ColorScheme, string> = {
  neutral: "custom-icon",
  success: "svg-success-filter",
  warning: "svg-warning-filter",
  destructive: "svg-destructive-filter",
};

export function CustomBadge({
  children,
  text,
  colorScheme = "neutral",
  variant = "flat",
  size = "md",
  rounded = "md",
  leftIcon,
  rightIcon,
  isCustomLeftIcon = false,
  isCustomRightIcon = false,
  noIconFilter = false,
  className,
}: CustomBadgeProps) {
  const iconFilter = (() => {
    if (noIconFilter) return "";
    if (variant === "filled") return "svg-white-filter";
    return ICON_FILTERS[colorScheme];
  })();

  const renderIcon = (icon: string, isCustom: boolean) => {
    if (!isCustom) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getIconPath(icon)}
        alt={icon}
        className={cn(ICON_SIZE_CLASSES[size], iconFilter)}
      />
    );
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium whitespace-nowrap",
        SIZE_CLASSES[size],
        ROUNDED_CLASSES[rounded],
        VARIANTS[variant][colorScheme],
        className,
      )}
    >
      {leftIcon && renderIcon(leftIcon, isCustomLeftIcon)}
      {children ?? text}
      {rightIcon && renderIcon(rightIcon, isCustomRightIcon)}
    </span>
  );
}
