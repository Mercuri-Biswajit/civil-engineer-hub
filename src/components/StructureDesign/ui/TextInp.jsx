import { Label } from './Label'

export function TextInp({ label, value, onChange, placeholder, id }) {
  const inputId = id || (label ? label.replace(/\W+/g, '-').toLowerCase() : undefined)
  
  return (
    <div className="mb-3">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <input
        id={inputId}
        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

