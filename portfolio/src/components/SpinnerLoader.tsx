type Size = "xs" | "sm" | "md" | "lg" | "xl";
type ColorScheme =
  | "primary"
  | "neutral"
  | "success"
  | "destructive"
  | "warning"
  | "white";

type SpinnerLoaderProps = {
  size?: Size;
  customSize?: number | string | null;
  colorScheme?: ColorScheme;
};

const SIZE_MAP: Record<Size, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const BACKGROUND_COLORS: Record<ColorScheme, string> = {
  neutral: "rgba(113, 113, 122, 0.25)",
  primary: "rgba(49, 101, 255, 0.25)",
  success: "rgba(34, 197, 94, 0.25)",
  destructive: "rgba(239, 68, 68, 0.25)",
  warning: "rgba(245, 158, 11, 0.25)",
  white: "rgba(255, 255, 255, 0.3)",
};

const FOREGROUND_COLORS: Record<ColorScheme, string> = {
  neutral: "rgba(113, 113, 122, 1)",
  primary: "rgba(49, 101, 255, 1)",
  success: "rgba(34, 197, 94, 1)",
  destructive: "rgba(239, 68, 68, 1)",
  warning: "rgba(245, 158, 11, 1)",
  white: "rgba(255, 255, 255, 1)",
};

export function SpinnerLoader({
  size = "md",
  customSize = null,
  colorScheme = "neutral",
}: SpinnerLoaderProps) {
  const computedSize =
    customSize != null ? parseInt(String(customSize)) : SIZE_MAP[size];

  const strokeWidth =
    computedSize <= 12
      ? 2
      : computedSize <= 16
        ? 2.5
        : computedSize <= 24
          ? 3
          : 3.5;

  const center = computedSize / 2;
  const radius = (computedSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.25;
  const dashArray = `${arcLength} ${circumference - arcLength}`;

  const backgroundColor = BACKGROUND_COLORS[colorScheme];
  const foregroundColor = FOREGROUND_COLORS[colorScheme];

  return (
    <div
      className="inline-flex items-center justify-center"
      style={{ width: computedSize, height: computedSize }}
    >
      <svg
        width={computedSize}
        height={computedSize}
        viewBox={`0 0 ${computedSize} ${computedSize}`}
        className="animate-spin"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={foregroundColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
