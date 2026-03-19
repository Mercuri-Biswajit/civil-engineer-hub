import React from 'react';
import GlobalHeader from '../shared/GlobalHeader';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#1e293b] flex flex-col overflow-x-hidden bg-[radial-gradient(at_0%_0%,rgba(99,102,241,0.04)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(236,72,153,0.04)_0px,transparent_50%)]">
      {/* ── Header ── */}
      <GlobalHeader />

      {/* ── Content ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

