import React from "react";
import { FiCheck } from "react-icons/fi";

export default function Sidebar({
  tabs,
  activeTab,
  setActiveTab,
  elementSets,
  totalNos,
}) {
  return (
    <aside className="w-full lg:w-56 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto flex flex-col gap-4 no-print z-30">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg">
            <span className="text-lg">📐</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-none tracking-tight">
              BBS Engine
            </h2>
            <p className="text-[8px] font-semibold text-indigo-600 uppercase tracking-wider mt-1">
              v3.1 — Smart Calc
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {/* Project Details */}
          <button
            onClick={() => setActiveTab("project_details")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left group ${
              activeTab === "project_details"
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${
                activeTab === "project_details"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              📋
            </div>
            <span
              className={`text-[11px] font-semibold uppercase tracking-wide ${
                activeTab === "project_details"
                  ? "text-slate-800"
                  : "text-slate-500"
              }`}
            >
              Project Details
            </span>
            {activeTab === "project_details" && (
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 ml-auto" />
            )}
          </button>

          <div className="h-px w-full bg-slate-100 my-2" />

          {tabs.map((t) => {
            const nos = elementSets[t.id].items.reduce(
              (s, it) => s + (+it.count || 1),
              0,
            );
            const isActive = activeTab === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left group ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {t.icon}
                </div>
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wide flex-1 ${
                    isActive ? "text-slate-800" : "text-slate-500"
                  }`}
                >
                  {t.label}
                </span>
                {nos > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      isActive
                        ? "bg-indigo-200 text-indigo-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {nos}
                  </span>
                )}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Total Elements
        </span>
        <strong className="text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1.5">
          {totalNos}
          <span className="text-xs font-semibold text-slate-400 uppercase">
            nos
          </span>
        </strong>
      </div>
    </aside>
  );
}
