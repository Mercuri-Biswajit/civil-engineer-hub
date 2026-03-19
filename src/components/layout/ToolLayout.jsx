import React, { useState } from "react";
import GlobalHeader from "../shared/GlobalHeader";

const ToolLayout = ({
  children,
  title,
  subtitle,
  headerAction,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = async () => {
    if (!onSave) return;
    const pName = window.prompt("Enter Project Name:", `${title} - ${new Date().toLocaleDateString()}`);
    if (!pName) return; // User cancelled
    
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
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#e0f2fe] text-[#0369a1] font-bold text-xs rounded-lg border border-[#bae6fd] hover:bg-[#bae6fd] hover:border-[#7dd3fc] transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={handleSaveClick} 
          disabled={isSaving}
          title="Save this project to your Dashboard"
        >
          {isSaving ? "⏳ Saving..." : "☁️ Save Project"}
        </button>
      )}
      {headerAction}
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      {/* ── Global Header Bar ── */}
      <GlobalHeader 
        toolTitle={title}
        toolSubtitle={subtitle}
        rightActions={defaultActions}
      />

      {/* ── Content Area ── */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 overflow-y-auto">{children}</main>
    </div>
  );
};

export default ToolLayout;
