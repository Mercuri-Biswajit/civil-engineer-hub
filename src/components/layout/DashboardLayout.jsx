import React from "react";
import GlobalHeader from "../shared/GlobalHeader";

const DashboardLayout = ({ children, className = "" }) => {
  return (
    <div
      className={`min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col`}
    >
      {/* Header */}
      <GlobalHeader />

      {/* Main Content */}
      <main
        className={`flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 ${className}`}
      >
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p className="font-medium">Civil Engineer Hub © 2026</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-700 cursor-pointer transition-colors">
              Help
            </span>
            <span className="hover:text-slate-700 cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="hover:text-slate-700 cursor-pointer transition-colors">
              Terms
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
