/**
 * Input Component
 *
 * A flexible input component with label, icons, error states, and more.
 *
 * Props:
 * - label: string
 * - error: string
 * - helperText: string
 * - leftIcon: ReactNode
 * - rightIcon: ReactNode
 * - fullWidth: boolean
 *
 * Example Usage:
 * <Input label="Email" type="email" placeholder="Enter your email" />
 * <Input label="Password" type="password" leftIcon={<LockIcon />} />
 */

import React, { forwardRef } from "react";
import PropTypes from "prop-types";

// Size configurations
const sizes = {
  sm: {
    input: "px-3 py-2 text-sm",
    icon: "left-3",
    label: "text-xs",
  },
  md: {
    input: "px-4 py-3 text-sm",
    icon: "left-4",
    label: "text-sm",
  },
  lg: {
    input: "px-4 py-4 text-base",
    icon: "left-4",
    label: "text-base",
  },
};

/**
 * Input Component
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = "",
      fullWidth = true,
      size = "md",
      type = "text",
      id,
      ...props
    },
    ref,
  ) => {
    const sizeStyles = sizes[size] || sizes.md;

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const containerClasses = [
      "flex flex-col gap-1.5",
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const wrapperClasses = ["relative", "flex", "items-center", "group"]
      .filter(Boolean)
      .join(" ");

    const inputClasses = [
      "w-full",
      "rounded-xl",
      "font-medium",
      "outline-none",
      "transition-all",
      "duration-200",
      "bg-white",
      "text-neutral-800",
      "placeholder:text-neutral-400",
      sizeStyles.input,

      // Border styles
      error
        ? "border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20"
        : "border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",

      // Icon padding
      leftIcon ? `pl-11` : "",
      rightIcon ? `pr-11` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const iconClasses = [
      "absolute",
      "top-1/2",
      "-translate-y-1/2",
      "text-neutral-400",
      "transition-colors",
      "duration-200",
      size === "sm" ? "w-4 h-4" : "w-5 h-5",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClasses}>
        {label && (
          <label
            htmlFor={inputId}
            className={`${sizeStyles.label} font-semibold text-neutral-700 flex items-center gap-1`}
          >
            {label}
            {props.required && <span className="text-danger-500">*</span>}
          </label>
        )}

        <div className={wrapperClasses}>
          {leftIcon && (
            <div
              className={`${sizeStyles.icon} absolute ${leftIcon.props.className || ""}`}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={inputClasses}
            {...props}
          />

          {rightIcon && (
            <div
              className={`right-4 absolute ${rightIcon.props.className || ""}`}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <span
            className={`text-xs font-medium ${error ? "text-danger-500" : "text-neutral-400"}`}
          >
            {error || helperText}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

// PropTypes
Input.propTypes = {
  /** Input label */
  label: PropTypes.string,
  /** Error message */
  error: PropTypes.string,
  /** Helper text (shown below input) */
  helperText: PropTypes.string,
  /** Icon to display before input */
  leftIcon: PropTypes.node,
  /** Icon to display after input */
  rightIcon: PropTypes.node,
  /** Full width input */
  fullWidth: PropTypes.bool,
  /** Input size */
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  /** Input type */
  type: PropTypes.string,
  /** Input id */
  id: PropTypes.string,
  /** Make input required */
  required: PropTypes.bool,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default Input;
