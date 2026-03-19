import { Label } from './Label'

export function Inp({ label, value, onChange, type = 'number', options, min, max, step, small, id }) {
  const inputId = id || (label ? label.replace(/\W+/g, '-').toLowerCase() : undefined)
  const sizeClass = small ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-sm'

  return (
    <div className="mb-2">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      {options ? (
        <div className="relative">
          <select
            id={inputId}
            className={`w-full ${sizeClass} rounded-lg border border-slate-200 bg-white text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-300 appearance-none cursor-pointer`}
            value={value}
            onChange={e => onChange(e.target.value)}
          >
            {options.map(o => (
              <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6">
              <path d="M0 0l5 6 5-6z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      ) : (
        <input
          id={inputId}
          className={`w-full ${sizeClass} rounded-lg border border-slate-200 bg-white text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-300`}
          type={type}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value)}
        />
      )}
    </div>
  )
}

