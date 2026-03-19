/**
 * EmptyState Component
 *
 * A component to display when there's no content to show.
 * Perfect for empty lists, search results, or placeholder content.
 *
 * Props:
 * - icon: ReactNode
 * - title: string
 * - description: string
 * - action: ReactNode
 *
 * Example Usage:
 * <EmptyState
 *   icon={<FolderOpenIcon />}
 *   title="No projects yet"
 *   description="Create your first project to get started"
 *   action={<Button>Create Project</Button>}
 * />
 */

import React from "react";
import PropTypes from "prop-types";

/**
 * EmptyState Component
 */
const EmptyState = ({ icon, title, description, action, className = "" }) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        py-12 px-4 text-center
        ${className}
      `}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4 p-4 bg-neutral-100 rounded-full text-neutral-400">
          {icon}
        </div>
      )}

      {/* Title */}
      {title && (
        <h3 className="text-lg font-bold text-neutral-800 mb-2">{title}</h3>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-neutral-500 max-w-sm mb-6">{description}</p>
      )}

      {/* Action */}
      {action && <div>{action}</div>}
    </div>
  );
};

// Pre-built empty states for common use cases
EmptyState.NotFound = function EmptyStateNotFound({
  title = "Not Found",
  description = "The resource you're looking for doesn't exist.",
  action,
  className = "",
}) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
};

EmptyState.NoResults = function EmptyStateNoResults({
  title = "No results found",
  description = "Try adjusting your search or filter criteria.",
  action,
  className = "",
}) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
};

EmptyState.NoData = function EmptyStateNoData({
  title = "No data yet",
  description = "Start adding data to see it displayed here.",
  action,
  className = "",
}) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
          />
        </svg>
      }
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
};

// PropTypes
EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
};

export default EmptyState;
