import { FiAlertTriangle } from "react-icons/fi";

/**
 * Reusable form group component with label, hint, and error handling
 * Used throughout the BOQ wizard for consistent form styling
 *
 * @param {Object} props
 * @param {string} props.label - Label text for the form field
 * @param {string} [props.hint] - Optional hint text displayed next to label
 * @param {string} [props.error] - Error message to display
 * @param {React.ReactNode} props.children - Input element(s)
 * @returns {JSX.Element}
 */
export default function FormGroup({ label, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4 group">
      <div className="flex items-center justify-between px-0.5">
        <label className="text-[11px] font-semibold text-slate-500 group-focus-within:text-indigo-600 transition-colors uppercase tracking-wide">
          {label}
        </label>
        {hint && !error && (
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <span className="text-[10px] text-rose-500 font-bold px-1 flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
          <FiAlertTriangle size={12} /> {error}
        </span>
      )}
    </div>
  );
}

/**
 * PageHeader - Header component for wizard pages
 * Displays step number, title, and description
 *
 * @param {Object} props
 * @param {string} props.step - Step number (e.g., "01")
 * @param {string} props.title - Page title
 * @param {string} props.desc - Page description
 * @returns {JSX.Element}
 */
export function PageHeader({ step, title, desc }) {
  const STEPS_TOTAL = 5;

  return (
    <div className="mb-6 relative">
      <div className="absolute -left-6 top-0 w-1.5 h-full bg-gradient-to-b from-indigo-600 to-transparent rounded-full opacity-50 blur-[1px]" />
      <div className="flex items-center gap-3 mb-2">
        <div className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
          STEP {step} / {STEPS_TOTAL.toString().padStart(2, "0")}
        </div>
      </div>
      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
        {title}
      </h2>
      <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
        {desc}
      </p>
    </div>
  );
}

/**
 * NavBar - Navigation bar for wizard pages
 * Contains back and next/continue buttons
 *
 * @param {Object} props
 * @param {Function} props.onNext - Handler for next button click
 * @param {Function} props.onBack - Handler for back button click
 * @param {boolean} [props.hideBack] - Whether to hide the back button
 * @param {string} [props.nextLabel] - Label for next button (default: "Continue")
 * @param {boolean} [props.nextCta] - Whether to use CTA styling for next button
 * @returns {JSX.Element}
 */
export function NavBar({
  onNext,
  onBack,
  hideBack,
  nextLabel = "Continue",
  nextCta,
}) {
  return (
    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
      {!hideBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-slate-500 text-xs font-bold uppercase tracking-widest border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95 group"
        >
          Back
        </button>
      )}
      <button
        onClick={onNext}
        className={`flex-1 flex items-center justify-center gap-3 px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] group ${
          nextCta
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5"
            : "bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-200 hover:-translate-y-0.5"
        }`}
      >
        {nextLabel}
      </button>
    </div>
  );
}

/**
 * Banner - Alert banner component for messages
 *
 * @param {Object} props
 * @param {string} props.type - Banner type: "info", "err", or "warn"
 * @param {React.ReactNode} props.children - Banner content
 * @returns {JSX.Element}
 */
export function Banner({ type, children }) {
  const isErr = type === "err";
  const isWarn = type === "warn";
  const colorCls = isErr
    ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
    : isWarn
      ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
      : "bg-purple-500/10 border-purple-500/20 text-purple-400";

  return (
    <div
      className={`p-6 rounded-lg border text-xs font-black uppercase tracking-tight flex items-center gap-4 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-left-2 ${colorCls}`}
    >
      <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100">
        {isErr ? (
          <FiAlertTriangle className="w-4 h-4 text-rose-500" />
        ) : (
          <FiAlertTriangle className="w-4 h-4 text-indigo-500" />
        )}
      </div>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

/**
 * ResultSection - Section container for displaying results
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} props.title - Section title
 * @param {string} [props.sub] - Subtitle text
 * @param {string} [props.badge] - Optional badge text
 * @param {React.ReactNode} props.children - Section content
 * @returns {JSX.Element}
 */
export function ResultSection({ icon, title, sub, badge, children }) {
  return (
    <div className="bg-white rounded-lg border border-slate-100 overflow-hidden mb-10 shadow-sm transition-all hover:shadow-md">
      <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-xl border border-indigo-100/50 text-indigo-600">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">
            {title}
          </h3>
          {sub && (
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              {sub}
            </div>
          )}
        </div>
        {badge && (
          <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-tighter">
            {badge}
          </div>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
