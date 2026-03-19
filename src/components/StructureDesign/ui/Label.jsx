export function Label({ children, htmlFor }) {
  return (
    <label 
      htmlFor={htmlFor} 
      className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 px-0.5"
    >
      {children}
    </label>
  )
}

