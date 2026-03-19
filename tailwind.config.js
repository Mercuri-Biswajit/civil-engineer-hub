/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        secondary: {
          500: "#ec4899",
          600: "#db2777",
        },
        surface: "#f8fafc",
        // Custom colors used in Button and Input components
        component: {
          primary: {
            DEFAULT: "#6366f1",
            dark: "#4f46e5",
            darker: "#4338ca",
            light: "#818cf8",
          },
          danger: {
            DEFAULT: "#ef4444",
            dark: "#dc2626",
            light: "#f87171",
          },
          success: {
            DEFAULT: "#22c55e",
            dark: "#16a34a",
            light: "#4ade80",
          },
        },
        // Focus ring colors for form elements
        focus: {
          primary: "rgba(99, 102, 241, 0.08)",
          danger: "rgba(239, 68, 68, 0.08)",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        card: "0 4px 24px -4px rgba(0,0,0,0.08)",
        header:
          "0 1px 0 rgba(0,0,0,0.05), 0 4px 20px -10px rgba(0, 0, 0, 0.08)",
        dropdown: "0 16px 40px -8px rgba(0,0,0,0.14)",
        modal: "0 24px 60px -12px rgba(0,0,0,0.25)",
        luxury:
          "0 20px 50px -12px rgba(0, 0, 0, 0.08), 0 0 1px 0 rgba(0,0,0,0.1)",
        // Component-specific shadows for Button and Input
        primary: "0 4px 14px -2px rgba(99,102,241,0.4)",
        "primary-hover": "0 6px 20px -2px rgba(99,102,241,0.5)",
        danger: "0 4px 12px -2px rgba(239,68,68,0.3)",
        "danger-hover": "0 6px 16px -2px rgba(239,68,68,0.4)",
        // Focus ring shadows for Input
        "focus-primary": "0 0 0 3px rgba(99,102,241,0.08)",
        "focus-danger": "0 0 0 3px rgba(239,68,68,0.08)",
      },
      backdropBlur: {
        xs: "4px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        dropdown: "dropdownIn 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        dropdownIn: {
          from: { opacity: "0", transform: "translateY(-8px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
