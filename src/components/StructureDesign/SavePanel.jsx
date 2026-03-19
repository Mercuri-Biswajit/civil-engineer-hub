/**
 * SavePanel  — sits at the top of the right results column on every page.
 * SaveToast  — fixed toast notification.
 */
import { useState, useRef, useEffect } from 'react'

// ── SAVE TOAST ────────────────────────────────────────────────
export function SaveToast({ msg }) {
  if (!msg) return null
  const isError = msg.type === 'error'

  return (
    <div className={`fixed bottom-7 right-7 z-[9000] flex items-center gap-2.5 px-[18px] py-3 rounded-xl shadow-luxury animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-[320px] border-l-4 ${
      isError 
        ? 'bg-red-50 border-red-500 border-y border-r border-red-200/50' 
        : 'bg-emerald-50 border-emerald-500 border-y border-r border-emerald-200/50'
    }`}>
      <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${
        isError ? 'bg-red-500' : 'bg-emerald-500'
      }`}>
        {isError ? '✕' : '✓'}
      </div>
      <span className="text-[13px] font-bold text-slate-700 leading-tight">{msg.text}</span>
    </div>
  )
}

// ── SAVE PANEL ────────────────────────────────────────────────
export function SavePanel({
  moduleLabel,
  moduleIcon,
  accentColor,
  projectName,
  setProjectName,
  existingNames,
  onSave,
  isSaving,
  hasData,
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const dropRef = useRef(null)
  const accent = accentColor || '#2563eb'

  const suggestions = existingNames.filter(n =>
    n.toLowerCase().includes(projectName.toLowerCase()) && n !== projectName
  )

  useEffect(() => {
    const handler = e => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm" style={{ borderTop: `3px solid ${accent}` }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div 
          className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[13px] shrink-0" 
          style={{
            background: `${accent}12`,
            border: `1px solid ${accent}25`,
            color: accent,
          }}
        >
          {moduleIcon}
        </div>
        <div>
          <div className="text-[12px] font-bold text-slate-800 leading-none">Save to Project</div>
          <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{moduleLabel} · inputs + results</div>
        </div>
        <div className="ml-auto">
          <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold tracking-wider border ${
            hasData 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : 'bg-white text-slate-400 border-slate-100'
          }`}>
            {hasData ? '● READY' : '○ NO DATA'}
          </span>
        </div>
      </div>

      {/* Project name input */}
      <div ref={dropRef} className="relative mb-2.5">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Project Name</label>
        <div className="relative">
          <input
            type="text"
            value={projectName}
            onChange={e => { setProjectName(e.target.value); setShowDropdown(true) }}
            onFocus={() => { setInputFocused(true); setShowDropdown(true) }}
            onBlur={() => setInputFocused(false)}
            placeholder="e.g. G+3 Residential Block A"
            className="w-full h-10 px-3 pr-8 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder:text-slate-300 transition-all focus:outline-none"
            style={{
              borderColor: inputFocused ? accent : undefined,
              boxShadow: inputFocused ? `0 0 0 3px ${accent}15` : undefined,
            }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-35 pointer-events-none">📁</span>
        </div>

        {/* Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-[100] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-white">Existing Projects</div>
            {suggestions.slice(0, 6).map(name => (
              <button
                key={name}
                onMouseDown={() => { setProjectName(name); setShowDropdown(false) }}
                className="flex items-center gap-2 w-full px-3 py-2 text-[12.5px] text-slate-600 border-t border-slate-100 hover:bg-indigo-50/50 hover:text-indigo-600 transition-colors text-left"
              >
                <span className="text-[12px] opacity-40">📁</span>
                <span className="flex-1 truncate">{name}</span>
                <span className="text-[9.5px] font-bold text-slate-300">add module</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Existing project chips */}
      {existingNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {existingNames.slice(0, 4).map(name => (
            <button
              key={name}
              onClick={() => setProjectName(name)}
              className={`px-2 py-0.5 rounded-md border text-[10.5px] font-bold transition-all ${
                projectName === name 
                  ? 'bg-blue-50 text-blue-600 border-blue-200' 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {/* Save button */}
      <button
        onClick={onSave}
        disabled={isSaving || !hasData}
        className="w-full h-10 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all duration-200 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none hover:-translate-y-0.5 active:translate-y-0"
        style={{
          background: isSaving
            ? '#cbd5e1'
            : !hasData
            ? '#f1f5f9'
            : `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`,
          color: !hasData ? '#94a3b8' : '#fff',
          boxShadow: hasData && !isSaving ? `0 4px 14px ${accent}30` : 'none',
        }}
      >
        {isSaving ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Saving…
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2h7.5L12 4.5V12a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" fill="none"/>
              <rect x="4" y="8" width="6" height="4" rx="0.5" fill="currentColor" opacity="0.5"/>
              <rect x="4" y="2" width="5" height="3" rx="0.5" fill="currentColor" opacity="0.5"/>
            </svg>
            {hasData ? 'Save to Dashboard' : 'Run calculation first'}
          </>
        )}
      </button>
    </div>
  )
}
