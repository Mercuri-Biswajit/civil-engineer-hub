/**
 * Badge Component
 *
 * A small label component for status indicators, categories, and tags.
 *
 * Props:
 * - variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
 * - size: 'sm' | 'md'
 * - dot: boolean (show a dot indicator)
 *
 * Example Usage:
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning" dot>Pending</Badge>
 */

import React from "react";
import PropTypes from "prop-types";

// Variant color configurations
const variants = {
  primary: {
    bg: "bg-primary-100",
    text: "text-primary-700",
    dot: "bg-primary-500",
  },
  success: {
    bg: "bg-success-100",
    text: "text-success-700",
    dot: "bg-success-500",
  },
  warning: {
    bg: "bg-warning-100",
    text: "text-warning-700",
    dot: "bg-warning-500",
  },
  danger: {
    bg: "bg-danger-100",
    text: "text-danger-700",
    dot: "bg-danger-500",
  },
  info: {
    bg: "bg-info-100",
    text: "text-info-700",
    dot: "bg-info-500",
  },
  neutral: {
    bg: "bg-neutral-100",
    text: "text-neutral-700",
    dot: "bg-neutral-500",
  },
  outline: {
    bg: "bg-transparent",
    text: "text-neutral-600 border border-neutral-300",
    dot: "bg-neutral-500",
  },
};

// Size configurations
const sizes = {
  sm: {
    padding: "px-2 py-0.5",
    fontSize: "text-xs",
    dot: "w-1.5 h-1.5",
  },
  md: {
    padding: "px-2.5 py-1",
    fontSize: "text-xs",
    dot: "w-2 h-2",
  },
};

/**
 * Badge Component
 */
const Badge = ({
  children,
  variant = "neutral",
  size = "sm",
  dot = false,
  className = "",
  ...props
}) => {
  const variantStyles = variants[variant] || variants.neutral;
  const sizeStyles = sizes[size] || sizes.sm;

  const badgeClasses = [
    "inline-flex",
    "items-center",
    "gap-1.5",
    "font-semibold",
    "rounded-lg",
    "whitespace-nowrap",
    "select-none",
    variantStyles.bg,
    variantStyles.text,
    sizeStyles.padding,
    sizeStyles.fontSize,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={badgeClasses} {...props}>
      {dot && (
        <span
          className={`rounded-full ${variantStyles.dot} ${sizeStyles.dot}`}
        />
      )}
      {children}
    </span>
  );
};

// DotBadge variant (Badge with only a dot)
Badge.Dot = function BadgeDot({
  color = "neutral",
  size = "sm",
  className = "",
}) {
  const colorStyles = {
    primary: "bg-primary-500",
    success: "bg-success-500",
    warning: "bg-warning-500",
    danger: "bg-danger-500",
    info: "bg-info-500",
    neutral: "bg-neutral-500",
  };

  const sizeStyles = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
  };

  return (
    <span
      className={`rounded-full ${colorStyles[color]} ${sizeStyles[size]} ${className}`}
    />
  );
};

// PropTypes
Badge.propTypes = {
  /** Badge content */
  children: PropTypes.node,
  /** Badge color variant */
  variant: PropTypes.oneOf([
    "primary",
    "success",
    "warning",
    "danger",
    "info",
    "neutral",
    "outline",
  ]),
  /** Badge size */
  size: PropTypes.oneOf(["sm", "md"]),
  /** Show dot indicator */
  dot: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default Badge;
