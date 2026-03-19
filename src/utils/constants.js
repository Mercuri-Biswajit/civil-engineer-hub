/**
 * Shared Constants for Civil Engineer Hub
 *
 * Single source of truth for configuration values and magic numbers
 * used across the application.
 */

// ===========================
// PAGINATION
// ===========================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  MAX_PAGE_SIZE: 100,
};

// ===========================
// ANIMATION DURATIONS
// ===========================
export const ANIMATION = {
  DURATION_FAST: 150, // ms - quick transitions (hover states)
  DURATION_NORMAL: 200, // ms - standard transitions
  DURATION_SLOW: 300, // ms - slower transitions
  DURATION_PAGE: 500, // ms - page-level animations
  DELAY_SHORT: 50, // ms - short delays
  DELAY_MEDIUM: 100, // ms - medium delays
  DELAY_LONG: 200, // ms - long delays
};

// ===========================
// API TIMEOUTS (ms)
// ===========================
export const API = {
  TIMEOUT_SHORT: 5000, // 5 seconds - quick requests
  TIMEOUT_NORMAL: 10000, // 10 seconds - standard requests
  TIMEOUT_LONG: 30000, // 30 seconds - long requests
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // ms between retries
};

// ===========================
// DEFAULT FORM VALUES
// ===========================
export const FORM_DEFAULTS = {
  TEXT_INPUT: "",
  NUMBER_INPUT: 0,
  SELECT_FIRST: null,
  CHECKBOX: false,
  TEXTAREA_ROWS: 4,
  MIN_DATE: "1900-01-01",
  MAX_DATE: "2100-12-31",
};

// ===========================
// LAYOUT CONSTANTS
// ===========================
export const LAYOUT = {
  HEADER_HEIGHT: "80px",
  SIDEBAR_WIDTH: "280px",
  SIDEBAR_COLLAPSED_WIDTH: "64px",
  CONTENT_MAX_WIDTH: "1280px",
  BREAKPOINT_SM: 640,
  BREAKPOINT_MD: 768,
  BREAKPOINT_LG: 1024,
  BREAKPOINT_XL: 1280,
};

// ===========================
// UI CONSTANTS
// ===========================
export const UI = {
  BORDER_RADIUS_SM: 8,
  BORDER_RADIUS_MD: 12,
  BORDER_RADIUS_LG: 16,
  BORDER_RADIUS_XL: 24,
  FOCUS_RING_WIDTH: 3,
  TOUCH_TARGET_MIN: 44, // minimum touch target size in pixels
};

// ===========================
// TOOL COLORS (for Dashboard badges)
// ===========================
export const TOOL_COLORS = {
  bbs: "#6366f1", // indigo-500
  boq: "#06b6d4", // cyan-500
  structure: "#f59e0b", // amber-500
};

// ===========================
// LOCAL STORAGE KEYS
// ===========================
export const STORAGE_KEYS = {
  USER_PREFERENCES: "user-preferences",
  LAST_PROJECT_ID: "last-project-id",
  THEME_MODE: "theme-mode",
};

// ===========================
// USER IDs
// ===========================
export const LOCAL_USER_ID = "local-user";

// ===========================
// ROUTES
// ===========================
export const ROUTES = {
  HOME: "/",
  BBS: "/bbs",
  BOQ: "/boq",
  STRUCTURE: "/structure",
  DASHBOARD: "/dashboard",
};

// ===========================
// ERROR MESSAGES
// ===========================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  AUTH_ERROR: "Authentication failed. Please log in again.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Something went wrong. Please try again later.",
  VALIDATION_ERROR: "Please check the form and try again.",
};

// ===========================
// SUCCESS MESSAGES
// ===========================
export const SUCCESS_MESSAGES = {
  PROJECT_SAVED: "Project saved successfully!",
  PROJECT_DELETED: "Project deleted successfully.",
  PROJECT_LOADED: "Project loaded successfully.",
};
