/**
 * Avatar Component
 *
 * A component to display user profile images or initials.
 *
 * Props:
 * - src: string (image URL)
 * - alt: string
 * - name: string (for initials fallback)
 * - size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * - status: 'online' | 'offline' | 'away' | 'busy'
 *
 * Example Usage:
 * <Avatar src="/user.jpg" alt="John Doe" />
 * <Avatar name="John Doe" size="lg" />
 * <Avatar name="JD" status="online" />
 */

import React from "react";
import PropTypes from "prop-types";

// Size configurations
const sizes = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

// Status indicator sizes
const statusSizes = {
  xs: "w-1.5 h-1.5 border",
  sm: "w-2 h-2 border",
  md: "w-2.5 h-2.5 border-2",
  lg: "w-3 h-3 border-2",
  xl: "w-4 h-4 border-2",
};

// Status colors
const statusColors = {
  online: "bg-success-500",
  offline: "bg-neutral-400",
  away: "bg-warning-500",
  busy: "bg-danger-500",
};

/**
 * Get initials from name
 */
const getInitials = (name) => {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Avatar Component
 */
const Avatar = ({ src, alt, name, size = "md", status, className = "" }) => {
  const sizeStyles = sizes[size] || sizes.md;
  const statusSizeStyles = statusSizes[size] || statusSizes.md;

  const [imageError, setImageError] = React.useState(false);

  const showImage = src && !imageError;

  const containerClasses = [
    "relative",
    "inline-flex",
    "flex-shrink-0",
    "items-center",
    "justify-center",
    "rounded-full",
    "bg-primary-100",
    "text-primary-700",
    "font-bold",
    "overflow-hidden",
    sizeStyles,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const statusClasses = [
    "absolute",
    "bottom-0",
    "right-0",
    "rounded-full",
    "border-white",
    statusColors[status],
    statusSizeStyles,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="relative inline-block">
      <div className={containerClasses}>
        {showImage ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && <span className={statusClasses} title={status} />}
    </div>
  );
};

// Avatar Group (multiple avatars stacked)
Avatar.Group = function AvatarGroup({
  children,
  max = 4,
  size = "md",
  className = "",
}) {
  const childArray = React.Children.toArray(children);
  const visibleAvatars = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  const overlapStyles = {
    xs: "-space-x-1",
    sm: "-space-x-2",
    md: "-space-x-3",
    lg: "-space-x-4",
    xl: "-space-x-5",
  };

  return (
    <div
      className={`flex items-center ${overlapStyles[size] || overlapStyles.md} ${className}`}
    >
      {visibleAvatars.map((child, index) => (
        <div key={index} className="ring-2 ring-white rounded-full">
          {React.cloneElement(child, { size })}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`
            flex items-center justify-center
            rounded-full bg-neutral-100 text-neutral-600
            font-semibold
            ring-2 ring-white
            ${sizes[size] || sizes.md}
          `}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

// PropTypes
Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  status: PropTypes.oneOf(["online", "offline", "away", "busy"]),
  className: PropTypes.string,
};

export default Avatar;
