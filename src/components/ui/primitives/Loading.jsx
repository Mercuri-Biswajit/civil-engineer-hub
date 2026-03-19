/**
 * Loading Component
 *
 * A collection of loading/spinner components for various use cases.
 *
 * Components:
 * - Spinner: A simple rotating spinner
 * - PageLoader: Full page loading overlay
 * - Skeleton: Loading placeholder for content
 *
 * Example Usage:
 * <Loading.Spinner size="md" />
 * <Loading.PageLoader text="Loading..." />
 * <Loading.Skeleton lines={3} />
 */

import React from "react";
import PropTypes from "prop-types";

// ═══════════════════════════════════════════════════════════════════════════
// SPINNER
// ═══════════════════════════════════════════════════════════════════════════

const sizes = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
  xl: "w-12 h-12 border-4",
};

const colors = {
  primary: "border-primary-200 border-t-primary-600",
  white: "border-white/30 border-t-white",
  neutral: "border-neutral-200 border-t-neutral-600",
};

const Spinner = ({ size = "md", color = "primary", className = "" }) => {
  return (
    <div
      className={`
        rounded-full 
        animate-spin
        ${sizes[size] || sizes.md}
        ${colors[color] || colors.primary}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  color: PropTypes.oneOf(["primary", "white", "neutral"]),
  className: PropTypes.string,
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE LOADER
// ═══════════════════════════════════════════════════════════════════════════

const PageLoader = ({
  text = "Loading...",
  fullScreen = false,
  className = "",
}) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50"
    : "relative";

  return (
    <div
      className={`
        ${containerClasses}
        flex flex-col items-center justify-center gap-4
        ${fullScreen ? "" : "py-12"}
        ${className}
      `}
    >
      <Spinner size="lg" />
      {text && (
        <p className="text-sm font-medium text-neutral-500 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

PageLoader.propTypes = {
  text: PropTypes.string,
  fullScreen: PropTypes.bool,
  className: PropTypes.string,
};

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════════════════════

const Skeleton = ({ width, height, variant = "text", className = "" }) => {
  const variantStyles = {
    text: "h-4 w-full rounded",
    title: "h-6 w-3/4 rounded",
    avatar: "h-10 w-10 rounded-full",
    thumbnail: "h-40 w-full rounded-xl",
    card: "h-64 w-full rounded-xl",
  };

  return (
    <div
      className={`
        animate-pulse
        bg-neutral-200
        ${variantStyles[variant] || variantStyles.text}
        ${className}
      `}
      style={width ? { width } : {}}
    />
  );
};

Skeleton.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  variant: PropTypes.oneOf(["text", "title", "avatar", "thumbnail", "card"]),
  className: PropTypes.string,
};

// Skeleton Group for multiple lines
Skeleton.Group = function SkeletonGroup({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant={i === 0 ? "title" : "text"}
          className={i === lines - 1 ? "w-2/3" : "w-full"}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// DOTS LOADER
// ═══════════════════════════════════════════════════════════════════════════

const DotsLoader = ({ size = "md", color = "primary", className = "" }) => {
  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const dotColors = {
    primary: "bg-primary-600",
    white: "bg-white",
    neutral: "bg-neutral-600",
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            ${dotSizes[size] || dotSizes.md}
            ${dotColors[color] || dotColors.primary}
            rounded-full
            animate-bounce
          `}
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: "600ms",
          }}
        />
      ))}
    </div>
  );
};

DotsLoader.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  color: PropTypes.oneOf(["primary", "white", "neutral"]),
  className: PropTypes.string,
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

const Loading = {
  Spinner,
  PageLoader,
  Skeleton,
  DotsLoader,
};

export default Loading;
export { Spinner, PageLoader, Skeleton, DotsLoader };
