export function SectionTitle({ children, style: extra }) {
  return (
    <h3 
      className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 mt-1 pl-1.5 border-l-2 border-indigo-500 flex items-center gap-2" 
      style={extra}
    >
      {children}
    </h3>
  )
}

