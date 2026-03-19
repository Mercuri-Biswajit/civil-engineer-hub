export function ResultRow({ label, value, unit, highlight }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0 group">
      <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-tight">{label}</span>
      <div className="flex items-baseline gap-1">
        <span
          className={`text-sm tracking-tight transition-all duration-300 ${
            highlight ? 'font-black text-indigo-400 scale-105' : 'font-bold text-slate-100'
          }`}
        >
          {value}
        </span>
        {unit && (
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

