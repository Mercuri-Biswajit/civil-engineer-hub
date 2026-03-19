/**
 * Button Component
 *
 * A versatile button component with multiple variants, sizes, and states.
 *
 * Props:
 * - variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
 * - size: 'sm' | 'md' | 'lg'
 * - fullWidth: boolean
 * - isLoading: boolean
 * - disabled: boolean
 * - leftIcon: ReactNode
 * - rightIcon: ReactNode
 *
 * Example Usage:
 * <Button variant="primary" size="md">Click Me</Button>
 * <Button variant="outline" leftIcon={<Icon />}>With Icon</Button>
 */

import React from "react";
import { Loader2 } from "lucide-react";

// Variant styles configuration
const variants = {
  primary: {
    base: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
    shadow: "shadow-sm hover:shadow-md",
    disabled: "opacity-50 cursor-not-allowed",
  },
  secondary: {
    base: "bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200 hover:border-neutral-300 active:bg-neutral-300",
    shadow: "",
    disabled: "opacity-50 cursor-not-allowed",
  },
  danger: {
    base: "bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700",
    shadow: "shadow-sm hover:shadow-md",
    disabled: "opacity-50 cursor-not-allowed",
  },
  ghost: {
    base: "bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100",
    shadow: "",
    disabled: "opacity-50 cursor-not-allowed",
  },
  outline: {
    base: "bg-transparent text-primary-600 border border-primary-300 hover:bg-primary-50 hover:border-primary-500 active:bg-primary-100",
    shadow: "",
    disabled: "opacity-50 cursor-not-allowed",
  },
  success: {
    base: "bg-success-500 text-white hover:bg-success-600 active:bg-success-700",
    shadow: "shadow-sm hover:shadow-md",
    disabled: "opacity-50 cursor-not-allowed",
  },
  warning: {
    base: "bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700",
    shadow: "shadow-sm hover:shadow-md",
    disabled: "opacity-50 cursor-not-allowed",
  },
};

// Size configurations
const sizes = {
  sm: {
    height: "h-8",
    padding: "px-3",
    fontSize: "text-xs",
    iconSize: "w-3.5 h-3.5",
  },
  md: {
    height: "h-10",
    padding: "px-4",
    fontSize: "text-sm",
    iconSize: "w-4 h-4",
  },
  lg: {
    height: "h-12",
    padding: "px-6",
    fontSize: "text-base",
    iconSize: "w-5 h-5",
  },
  xl: {
    height: "h-14",
    padding: "px-8",
    fontSize: "text-lg",
    iconSize: "w-6 h-6",
  },
};

/**
 * Button Component
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
  type = "button",
  ...props
}) => {
  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;

  const isDisabled = disabled || isLoading;

  const classes = [
    // Base styles
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "font-semibold",
    "rounded-xl",
    "transition-all",
    "duration-200",
    "outline-none",
    "select-none",
    "whitespace-nowrap",

    // Focus styles
    "focus-visible:ring-2",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-primary-500",

    // Size
    sizeStyles.height,
    sizeStyles.padding,
    sizeStyles.fontSize,

    // Variant
    variantStyles.base,
    variantStyles.shadow,

    // States
    isDisabled ? variantStyles.disabled : "cursor-pointer",
    fullWidth ? "w-full" : "",

    // Custom className
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} disabled={isDisabled} {...props}>
      {isLoading ? (
        <Loader2 className={`${sizeStyles.iconSize} animate-spin`} />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}

      <span className={fullWidth ? "w-full text-center" : ""}>{children}</span>

      {!isLoading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PROP TYPES (for documentation)
// ═══════════════════════════════════════════════════════════════════════════

Button.propTypes = {
  /** Button style variant */
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "ghost",
    "outline",
    "success",
    "warning",
  ]),
  /** Button size */
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  /** Full width button */
  fullWidth: PropTypes.bool,
  /** Show loading spinner */
  isLoading: PropTypes.bool,
  /** Disable the button */
  disabled: PropTypes.bool,
  /** Icon to show before text */
  leftIcon: PropTypes.node,
  /** Icon to show after text */
  rightIcon: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Button type attribute */
  type: PropTypes.string,
  /** Button content */
  children: PropTypes.node.isRequired,
};

import PropTypes from "prop-types";

export default Button;
export { variants, sizes };
