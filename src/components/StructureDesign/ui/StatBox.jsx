export function StatBox({ label, value, unit, color }) {
  return (
    <div className="bg-white border border-slate-200/40 rounded-xl p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-200/50 group">
      <div className="text-[10px] text-slate-400 font-bold mb-1 tracking-[0.1em] uppercase truncate group-hover:text-indigo-400 transition-colors">
        {label}
      </div>
      <div 
        className="text-xl font-black leading-none truncate mb-1" 
        style={{ color: color || '#6366f1' }}
      >
        {value}
      </div>
      {unit && (
        <div className="text-[10px] text-slate-400 font-semibold tracking-wide">
          {unit}
        </div>
      )}
    </div>
  )
}

