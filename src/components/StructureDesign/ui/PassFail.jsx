export function PassFail({ pass, code }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 px-1">
      <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">{code}</span>
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
          pass 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50 shadow-[0_2px_8px_rgba(16,185,129,0.1)]' 
            : 'bg-rose-50 text-rose-600 border border-rose-200/50 shadow-[0_2px_8px_rgba(244,63,94,0.1)]'
        }`}
      >
        {pass ? '✓ PASS' : '✗ FAIL'}
      </span>
    </div>
  )
}

