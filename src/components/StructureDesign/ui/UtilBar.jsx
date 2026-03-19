export function UtilBar({ pct, label, color }) {
  const p = Math.min(Math.max(parseFloat(pct) || 0, 0), 100)
  const colors = {
    success: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444'
  }
  const col = color || (p <= 70 ? colors.success : p <= 90 ? colors.yellow : colors.red)

  return (
    <div className="mt-6 group">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
          {label}
        </span>
        <span className="text-xs font-black tabular-nums transition-colors" style={{ color: col }}>{pct}%</span>
      </div>
      <div className="h-3 w-full bg-slate-100/50 rounded-full overflow-hidden border border-slate-200/30 p-0.5 shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${p}%`,
            background: `linear-gradient(90deg, ${col}ee, ${col})`,
            boxShadow: `0 0 15px ${col}30`,
          }}
        />
      </div>
    </div>
  )
}

