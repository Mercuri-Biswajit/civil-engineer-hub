/**
 * Card Component
 *
 * A flexible container component with header, content, and footer sections.
 *
 * Props:
 * - title: string
 * - subtitle: string
 * - headerAction: ReactNode
 * - footer: ReactNode
 * - noPadding: boolean
 * - hover: boolean
 *
 * Example Usage:
 * <Card title="My Card" subtitle="Optional subtitle">
 *   Card content here
 * </Card>
 *
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Title</Card.Title>
 *     <Card.Action>Action</Card.Action>
 *   </Card.Header>
 *   <Card.Body>Content</Card.Body>
 *   <Card.Footer>Footer</Card.Footer>
 * </Card>
 */

import React from "react";
import PropTypes from "prop-types";

/**
 * Card Component
 */
const Card = ({
  children,
  className = "",
  title,
  subtitle,
  headerAction,
  footer,
  noPadding = false,
  hover = true,
  ...props
}) => {
  const cardClasses = [
    "bg-white",
    "rounded-2xl",
    "border",
    "border-neutral-200",
    "shadow-sm",
    "overflow-hidden",
    "transition-all",
    "duration-300",
    hover
      ? "hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const hasHeader = title || subtitle || headerAction;

  return (
    <div className={cardClasses} {...props}>
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-neutral-100">
          <div className="flex flex-col gap-1">
            {title && (
              <h3 className="text-lg font-bold text-neutral-900 m-0">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-neutral-500 m-0">{subtitle}</p>
            )}
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}

      <div className={noPadding ? "p-0" : "p-6"}>{children}</div>

      {footer && (
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50">
          {footer}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CARD SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

Card.Header = function CardHeader({ children, className = "" }) {
  return (
    <div className={`px-6 py-5 border-b border-neutral-100 ${className}`}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = "", noPadding = false }) {
  return (
    <div className={`${noPadding ? "p-0" : "p-6"} ${className}`}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = "" }) {
  return (
    <div
      className={`px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 ${className}`}
    >
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-lg font-bold text-neutral-900 ${className}`}>
      {children}
    </h3>
  );
};

Card.Subtitle = function CardSubtitle({ children, className = "" }) {
  return <p className={`text-sm text-neutral-500 ${className}`}>{children}</p>;
};

Card.Action = function CardAction({ children, className = "" }) {
  return <div className={`flex-shrink-0 ${className}`}>{children}</div>;
};

// PropTypes
Card.propTypes = {
  /** Card title */
  title: PropTypes.string,
  /** Card subtitle */
  subtitle: PropTypes.string,
  /** Action element for header */
  headerAction: PropTypes.node,
  /** Footer content */
  footer: PropTypes.node,
  /** Remove padding from body */
  noPadding: PropTypes.bool,
  /** Enable hover effect */
  hover: PropTypes.bool,
  /** Card content */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default Card;
