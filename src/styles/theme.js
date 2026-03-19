/**
 * Theme Configuration for Civil Engineer Hub
 *
 * This file provides theme-related constants and utilities.
 * Used alongside Tailwind CSS for custom styling needs.
 */

// ===========================
// COLOR PALETTE EXTENSION
// ===========================
// These colors extend Tailwind's default palette for consistent usage
// across the application. Use Tailwind's utility classes when possible,
// and fall back to these constants for custom components.

export const COLORS = {
  // Primary brand colors (indigo)
  primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1", // Main primary
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },

  // Tool-specific colors (for badges and indicators)
  tools: {
    bbs: "#6366f1", // Indigo - BBS calculator
    boq: "#06b6d4", // Cyan - BOQ calculator
    structure: "#f59e0b", // Amber - Structure design
  },

  // Semantic colors
  semantic: {
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },

  // Neutral colors
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
};

// ===========================
// SPACING SCALE
// ===========================
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
  "4xl": 64,
};

// ===========================
// TYPOGRAPHY
// ===========================
export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
    mono: ["JetBrains Mono", "DM Mono", "Fira Code", "monospace"],
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

// ===========================
// BORDER RADIUS
// ===========================
export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
};

// ===========================
// SHADOWS
// ===========================
// Custom shadows that extend Tailwind's default shadows
export const SHADOWS = {
  primary: "0 4px 14px -2px rgba(99,102,241,0.4)",
  "primary-hover": "0 6px 20px -2px rgba(99,102,241,0.5)",
  danger: "0 4px 12px -2px rgba(239,68,68,0.3)",
  "danger-hover": "0 6px 16px -2px rgba(239,68,68,0.4)",
  glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
  card: "0 4px 24px -4px rgba(0,0,0,0.08)",
};

// ===========================
// TRANSITIONS
// ===========================
export const TRANSITIONS = {
  duration: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};

// ===========================
// Z-INDEX SCALE
// ===========================
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
};

export default {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  RADIUS,
  SHADOWS,
  TRANSITIONS,
  Z_INDEX,
};
