import React, { useState } from "react";
import GlobalHeader from "../shared/GlobalHeader";

const ToolLayout = ({ children, title, subtitle, headerAction, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = async () => {
    if (!onSave) return;
    const pName = window.prompt(
      "Enter Project Name:",
      `${title} - ${new Date().toLocaleDateString()}`,
    );
    if (!pName) return;

    setIsSaving(true);
    try {
      await onSave(pName);
      alert("Project saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  const defaultActions = (
    <>
      {onSave && (
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold text-sm rounded-xl border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveClick}
          disabled={isSaving}
          title="Save this project to your Dashboard"
        >
          {isSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
              Saving...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              Save Project
            </>
          )}
        </button>
      )}
      {headerAction}
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Global Header Bar */}
      <GlobalHeader
        toolTitle={title}
        toolSubtitle={subtitle}
        rightActions={defaultActions}
      />

      {/* Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default ToolLayout;
