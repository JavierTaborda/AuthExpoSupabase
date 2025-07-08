import { vars } from "nativewind";

export const themes = {
  light: vars({
    "--color-primary-default": "#23A247", // principal
    "--color-primary-light": "#4CCF78",
    "--color-primary-pale": "#87FF87",

    "--color-secondary-default": "#40916C",
    "--color-secondary-light": "#74C69D",

    "--color-accent-default": "#FACC15",
    "--color-accent-light": "#FEF08A",

    "--color-tertiary-default": "#3B82F6", // azul info
    "--color-tertiary-light": "#93C5FD",

    "--color-success": "#22C55E",
    "--color-warning": "#EAB308",
    "--color-error": "#EF4444",

    "--color-background": "#FFFFFF",
    "--color-foreground": "#0F172A",

    "--color-muted": "#E5E7EB",
    "--color-muted-foreground": "#6B7280",

    "--color-overlay": "rgba(0, 0, 0, .05)",
  }),

  dark: vars({
    "--color-primary-default": "#23A247",
    "--color-primary-light": "#4CCF78",
    "--color-primary-pale": "#87FF87",

    "--color-secondary-default": "#A7F3D0",
    "--color-secondary-light": "#BBF7D0",

    "--color-accent-default": "#FACC15",
    "--color-accent-light": "#FDE68A",

    "--color-tertiary-default": "#60A5FA",
    "--color-tertiary-light": "#BFDBFE",

    "--color-success": "#4ADE80",
    "--color-warning": "#FCD34D",
    "--color-error": "#F87171",

    "--color-background": "#121212",
    "--color-foreground": "#F3F4F6",

    "--color-muted": "#1F2937",
    "--color-muted-foreground": "#9CA3AF",

    "--color-overlay": "rgba(255, 255, 255, .05)",
  }),
};
