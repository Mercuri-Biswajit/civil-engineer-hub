/**
 * RouteErrorBoundary Component
 *
 * A specialized React error boundary designed for handling route-level errors.
 * It provides a more focused error UI that's appropriate when individual pages
 * or routes fail to load, with options to navigate back or reload.
 *
 * @component
 * @example
 * // Usage in App.jsx with React Router:
 * <RouteErrorBoundary>
 *   <Routes>
 *     <Route path="/" element={<Home />} />
 *     <Route path="/about" element={<About />} />
 *   </Routes>
 * </RouteErrorBoundary>
 *
 * @example
 * // Usage wrapping a specific route:
 * <RouteErrorBoundary>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </RouteErrorBoundary>
 */

import React, { Component } from "react";
import { useNavigate } from "react-router-dom";

/**
 * RouteErrorBoundaryInner - Inner component that uses useNavigate hook
 * @extends React.Component
 */
class RouteErrorBoundaryInner extends Component {
  /**
   * @typedef {Object} State
   * @property {boolean} hasError - Whether an error has been caught
   * @property {Error|null} error - The caught error object
   * @property {string|null} errorInfo - Information about the error component stack
   */

  /** @type {State} */
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  /**
   * Static method that is called when a child component throws an error.
   * Updates the state to trigger the fallback UI.
   *
   * @param {Error} error - The error that was thrown
   * @returns {Object} New state object
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Lifecycle method that is called after an error has been caught.
   * Logs the error and error info to the console for debugging.
   *
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Object containing information about which component threw the error
   */
  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error("RouteErrorBoundary caught a route error:", error);
    console.error("Error Info:", errorInfo);

    // You can also send errors to an error reporting service here
    // Example: errorReportingService.captureException(error, { extra: { ...errorInfo, route: window.location.pathname } });

    this.setState({
      errorInfo,
    });
  }

  /**
   * Handler for the "Try Again" button.
   * Resets the error state to allow the route to re-render.
   */
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Handler for the "Go Home" button.
   * Navigates back to the home page.
   */
  handleGoHome = () => {
    const { navigate } = this.props;
    if (navigate) {
      navigate("/");
    } else {
      window.location.href = "/";
    }
  };

  /**
   * Handler for the "Reload Page" button.
   * Reloads the current page.
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * Renders the fallback error UI when an error has been caught,
   * or the children components if no error occurred.
   *
   * @returns {React.ReactNode}
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-orange-500/30 rounded-2xl p-8 shadow-xl">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-orange-600 dark:text-orange-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white text-center mb-3">
              Page Load Failed
            </h2>

            {/* Error Message */}
            <p className="text-slate-600 dark:text-slate-400 text-center mb-2">
              We couldn't load this page. This might be a temporary issue.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 text-center mb-6">
              {this.state.error?.message ||
                "An unexpected error occurred while loading this route."}
            </p>

            {/* Error Details (Collapsible) */}
            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <div className="mb-6">
                <details className="group">
                  <summary className="cursor-pointer text-sm text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center gap-2">
                    <svg
                      className="w-4 h-4 transition-transform group-open:rotate-90"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Technical Details
                  </summary>
                  <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg overflow-auto max-h-32 text-xs font-mono text-slate-600 dark:text-orange-300">
                    {this.state.error?.stack}
                  </div>
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reload
              </button>
            </div>

            {/* Go Home Button */}
            <button
              onClick={this.handleGoHome}
              className="w-full mt-3 py-3 px-4 border-2 border-slate-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go to Homepage
            </button>
          </div>
        </div>
      );
    }

    // Render children when there's no error
    return this.props.children;
  }
}

/**
 * RouteErrorBoundary - Higher-order component that wraps the inner error boundary with useNavigate hook
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {React.ReactNode}
 */
function RouteErrorBoundary({ children }) {
  const navigate = useNavigate();
  return (
    <RouteErrorBoundaryInner navigate={navigate}>
      {children}
    </RouteErrorBoundaryInner>
  );
}

export default RouteErrorBoundary;
