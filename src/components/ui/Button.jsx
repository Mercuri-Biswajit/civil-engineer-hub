import React from "react";

const Button = ({
  children,
  variant = "primary", // primary, secondary, danger, ghost, outline
  size = "md", // sm, md, lg
  fullWidth = false,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  const baseClasses =
    "relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer border-0 outline-none select-none whitespace-nowrap overflow-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]";

  const sizeClasses = {
    sm: "text-xs px-3 py-2 h-8",
    md: "text-sm px-4 py-2.5 h-10",
    lg: "text-base px-6 py-3 h-12",
  }[size];

  const variantClasses = {
    primary:
      "text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-md active:bg-indigo-800",
    secondary:
      "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:border-slate-300 active:bg-slate-300",
    danger:
      "text-white bg-red-600 hover:bg-red-700 shadow-sm hover:shadow-md active:bg-red-800",
    ghost:
      "bg-transparent text-indigo-600 border-none hover:bg-indigo-50 active:bg-indigo-100",
    outline:
      "bg-transparent text-indigo-600 border border-indigo-300 hover:bg-indigo-50 hover:border-indigo-500 active:bg-indigo-100",
  }[variant];

  const classes = [
    baseClasses,
    sizeClasses,
    variantClasses,
    fullWidth ? "w-full" : "",
    isLoading ? "cursor-wait" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span
          className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden="true"
        />
      ) : leftIcon ? (
        <span className="flex items-center justify-center text-[1em]">
          {leftIcon}
        </span>
      ) : null}

      <span className="flex-1 text-center">{children}</span>

      {!isLoading && rightIcon && (
        <span className="flex items-center justify-center text-[1em]">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
