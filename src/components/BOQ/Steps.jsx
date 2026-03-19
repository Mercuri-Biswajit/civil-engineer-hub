import { FiCheck, FiBox } from "react-icons/fi";

/**
 * Step configuration for the BOQ wizard
 * @readonly
 * @type {Array<{num: number, label: string}>}
 */
export const STEPS = [
  { num: 1, label: "Project Brief" },
  { num: 2, label: "Geometry & Extent" },
  { num: 3, label: "Floor Architecture" },
  { num: 4, label: "Structural Profile" },
  { num: 5, label: "Official Estimate" },
];

/**
 * StepIndicator - Sidebar navigation component for the BOQ wizard
 * Displays the current step and allows navigation between completed steps
 */
export default function StepIndicator({ currentStep }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-4 px-2">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg">
          <FiBox size={20} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-none tracking-tight">
            BOQ Engine
          </h2>
          <p className="text-[8px] font-semibold text-indigo-600 uppercase tracking-wider mt-1">
            v2.4 — PWD 2024
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {STEPS.map((s) => (
          <button
            key={s.num}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left group ${
              currentStep === s.num
                ? "bg-indigo-50 text-indigo-700"
                : currentStep > s.num
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
            disabled={s.num > currentStep && currentStep !== 5}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                currentStep === s.num
                  ? "bg-indigo-600 text-white"
                  : currentStep > s.num
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {currentStep > s.num ? <FiCheck strokeWidth={3} /> : `0${s.num}`}
            </div>
            <span
              className={`text-[11px] font-semibold uppercase tracking-wide ${
                currentStep === s.num
                  ? "text-slate-800"
                  : currentStep > s.num
                    ? "text-emerald-700"
                    : "text-slate-500"
              }`}
            >
              {s.label}
            </span>
            {currentStep === s.num && (
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 ml-auto" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
