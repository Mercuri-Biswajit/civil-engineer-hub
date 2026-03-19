/**
 * ErrorBoundary Component
 *
 * A React error boundary that catches JavaScript errors anywhere in the child component tree.
 * It logs these errors to the console and displays a user-friendly fallback UI instead of
 * crashing the entire application.
 *
 * @component
 * @example
 * // Usage in main.jsx:
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 *
 * @example
 * // Usage in a specific component:
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 */

import React, { Component } from "react";

/**
 * ErrorBoundary - Catches and handles React component errors
 * @extends React.Component
 */
class ErrorBoundary extends Component {
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
    console.error("ErrorBoundary caught an error:", error);
    console.error("Error Info:", errorInfo);

    // You can also send errors to an error reporting service here
    // Example: errorReportingService.captureException(error, { extra: errorInfo });

    this.setState({
      errorInfo,
    });
  }

  /**
   * Handler for the "Try Again" button.
   * Resets the error state to allow the component to re-render.
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 shadow-2xl">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-white text-center mb-3">
              Oops! Something went wrong
            </h1>

            {/* Error Message */}
            <p className="text-slate-400 text-center mb-6">
              {this.state.error?.message ||
                "An unexpected error occurred. Please try again."}
            </p>

            {/* Error Details (Collapsible) */}
            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <div className="mb-6">
                <details className="group">
                  <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-400 transition-colors flex items-center gap-2">
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
                    View Error Details
                  </summary>
                  <div className="mt-3 p-3 bg-slate-900/50 rounded-lg overflow-auto max-h-40 text-xs font-mono text-red-300">
                    {this.state.error?.stack}
                  </div>
                </details>
              </div>
            )}

            {/* Try Again Button */}
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
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
          </div>
        </div>
      );
    }

    // Render children when there's no error
    return this.props.children;
  }
}

export default ErrorBoundary;
