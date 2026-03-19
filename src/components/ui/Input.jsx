import React, { forwardRef } from "react";

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
      ...props
    },
    ref,
  ) => {
    const containerClasses = [
      "flex flex-col gap-1.5",
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const inputClasses = [
      "w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200",
      "bg-white border text-slate-800 placeholder-slate-400",
      error
        ? "border-red-400 bg-red-500/5 focus:border-red-500 shadow-focus-danger"
        : "border-slate-200 focus:border-indigo-500 focus:shadow-focus-primary",
      leftIcon ? "pl-11" : "",
      rightIcon ? "pr-11" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClasses}>
        {label && (
          <label className="text-sm font-bold text-slate-700 flex items-center">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500">
              {leftIcon}
            </div>
          )}

          <input ref={ref} className={inputClasses} {...props} />

          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <div
            className={`text-xs font-semibold mt-1 ${error ? "text-red-500" : "text-slate-400"}`}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
