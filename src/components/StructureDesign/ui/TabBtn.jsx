export function TabBtn({ active, onClick, children, color }) {
  const activeColor = color || '#6366f1'

  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-[10px] tracking-[0.15em] transition-all duration-300 uppercase relative overflow-hidden group ${
        active 
          ? 'text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
          : 'text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-md'
      }`}
      style={{
        backgroundColor: active ? activeColor : undefined,
      }}
    >
      {active && (
        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

