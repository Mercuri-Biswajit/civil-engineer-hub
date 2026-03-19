/**
 * Select Component
 *
 * A dropdown select component with label, icons, and error states.
 *
 * Props:
 * - options: array of { value, label }
 * - label: string
 * - placeholder: string
 * - error: string
 *
 * Example Usage:
 * <Select
 *   label="Choose Option"
 *   options={[
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' }
 *   ]}
 * />
 */

import React from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";

/**
 * Select Component
 */
const Select = ({
  options = [],
  label,
  error,
  placeholder = "Select an option",
  className = "",
  fullWidth = true,
  size = "md",
  disabled = false,
  value,
  onChange,
  id,
  ...props
}) => {
  const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const sizeStyles = {
    sm: {
      padding: "px-3 py-2",
      textSize: "text-sm",
      iconSize: "w-4 h-4",
    },
    md: {
      padding: "px-4 py-3",
      textSize: "text-sm",
      iconSize: "w-5 h-5",
    },
    lg: {
      padding: "px-4 py-4",
      textSize: "text-base",
      iconSize: "w-5 h-5",
    },
  };

  const styles = sizeStyles[size] || sizeStyles.md;

  const containerClasses = [
    "flex flex-col gap-1.5",
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const selectClasses = [
    "w-full",
    "rounded-xl",
    "font-medium",
    "outline-none",
    "transition-all",
    "duration-200",
    "bg-white",
    "text-neutral-800",
    styles.padding,
    styles.textSize,
    "appearance-none",
    "cursor-pointer",

    // Border styles
    error
      ? "border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20"
      : "border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",

    disabled ? "bg-neutral-100 cursor-not-allowed text-neutral-400" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-neutral-700 flex items-center gap-1"
        >
          {label}
          {props.required && <span className="text-danger-500">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={inputId}
          className={selectClasses}
          disabled={disabled}
          value={value}
          onChange={onChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none ${styles.iconSize}`}
        />
      </div>

      {error && (
        <span className="text-xs font-medium text-danger-500">{error}</span>
      )}
    </div>
  );
};

// PropTypes
Select.propTypes = {
  /** Options array */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  /** Select label */
  label: PropTypes.string,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Error message */
  error: PropTypes.string,
  /** Full width select */
  fullWidth: PropTypes.bool,
  /** Select size */
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  /** Disable select */
  disabled: PropTypes.bool,
  /** Selected value */
  value: PropTypes.string,
  /** Change handler */
  onChange: PropTypes.func,
  /** Select id */
  id: PropTypes.string,
  /** Make select required */
  required: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default Select;
