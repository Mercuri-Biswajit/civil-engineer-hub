// src/components/BBS/ui.jsx — Premium UI primitives using Tailwind CSS
import React from "react";

export function Card({ children, style, className = "" }) {
  return (
    <div 
      className={`bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow ${className}`} 
      style={style}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon }) {
  return (
    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-4">
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl filter drop-shadow-sm">{icon}</span>}
          <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
        </div>
        {subtitle && <p className="text-xs text-slate-500 font-medium truncate opacity-80 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0 flex items-center gap-3">{action}</div>}
    </div>
  );
}

export function FormSection({ title, children, icon, className = "", gridClassName = "grid-cols-1 sm:grid-cols-2" }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {title && (
        <div className="flex items-center gap-1.5 px-0.5">
          {icon && <span className="text-xs opacity-80">{icon}</span>}
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{title}</span>
        </div>
      )}
      <div className={`grid gap-3 ${gridClassName}`}>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, value, onChange, unit = "", step = "0.01", min = "0", icon, type = "number", placeholder = "", className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 group ${className}`}>
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          {icon && <span className="text-xs opacity-60 group-focus-within:opacity-100 transition-opacity">{icon}</span>}
          <label className="text-xs font-bold text-slate-600 group-focus-within:text-primary-600 transition-colors uppercase tracking-tight">{label}</label>
        </div>
        {unit && <span className="text-[10px] font-black text-slate-300 group-focus-within:text-primary-200 transition-colors">{unit}</span>}
      </div>
      <div className="relative">
        <input
          className="w-full h-9 bg-slate-50/50 border border-slate-200 rounded-lg px-3 text-[13px] font-semibold text-slate-900 
                     placeholder:text-slate-400 outline-none transition-all duration-200 
                     focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          step={type === "number" ? step : undefined}
          min={type === "number" ? min : undefined}
          placeholder={placeholder}
        />
        {unit && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{unit}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function DiaSelect({ label, value, onChange, icon }) {
  const dias = [6, 8, 10, 12, 16, 20, 25, 32];
  const wt = { 6: 0.222, 8: 0.395, 10: 0.617, 12: 0.888, 16: 1.578, 20: 2.469, 25: 3.858, 32: 6.313 };
  return (
    <div className="flex flex-col gap-1.5 group">
      <div className="flex items-center gap-1.5 px-0.5">
        {icon && <span className="text-xs opacity-60 group-focus-within:opacity-100 transition-opacity">{icon}</span>}
        <label className="text-xs font-bold text-slate-600 group-focus-within:text-primary-600 transition-colors uppercase tracking-tight">{label}</label>
      </div>
      <div className="relative">
        <select 
          className="w-full h-9 bg-slate-50/50 border border-slate-200 rounded-lg px-3 pr-8 text-[13px] font-semibold text-slate-900 
                     appearance-none outline-none transition-all duration-200 
                     focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 cursor-pointer" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        >
          {dias.map((d) => (
            <option key={d} value={d}>φ{d}mm — {wt[d]} kg/m</option>
          ))}
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
      </div>
    </div>
  );
}

export function Button({ children, onClick, variant = "primary", size = "md", fullWidth, style: extStyle, disabled, leftIcon }) {
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-200",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 shadow-sm",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-100",
  };

  const sizes = {
    xs: "h-7 px-2.5 text-[10px]",
    sm: "h-8 px-3 text-[11px]",
    md: "h-9 px-4 text-xs",
    lg: "h-10 px-5 text-sm",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 font-bold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none
                 ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""}`}
      style={extStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && <span className="text-base">{leftIcon}</span>}
      {children}
    </button>
  );
}

export function Badge({ label, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    red: "bg-red-50 text-red-700 border-red-100",
    teal: "bg-teal-50 text-teal-700 border-teal-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };
  return (
    <span className={`inline-flex items-center h-6 px-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${colors[color] || colors.blue}`}>
      {label}
    </span>
  );
}

export function Divider({ label }) {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="h-px flex-1 bg-slate-100" />
      {label && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{label}</span>}
      <div className="h-px flex-1 bg-slate-100" />
    </div>
  );
}

export function MetricCard({ label, value, unit, icon, onChange }) {
  return (
    <div className="bg-white p-3.5 rounded-lg border border-slate-100 hover:border-primary-100 transition-colors shadow-sm">
      <div className="flex items-center gap-2 mb-2.5">
        {icon && <span className="text-sm opacity-80">{icon}</span>}
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
      </div>
      <div className="flex items-center group">
        <input 
          type="number" 
          className="flex-1 min-w-0 bg-transparent text-sm font-extrabold text-slate-900 outline-none placeholder:text-slate-300" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="0.00"
        />
        <span className="text-[10px] font-bold text-slate-400 ml-1.5 group-focus-within:text-primary-500 transition-colors">{unit}</span>
      </div>
    </div>
  );
}

export function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-4 mb-2">
      {icon && (
        <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-xl shadow-sm text-primary-600 flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-0.5 pt-0.5">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 leading-relaxed font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}
export function Modal({ isOpen, onClose, title, subtitle, children, icon, maxWidth = "max-w-4xl" }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer" 
        onClick={onClose} 
      />
      <div className={`w-full ${maxWidth} bg-white rounded-lg shadow-2xl relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500`}>
        <CardHeader 
          title={title} 
          subtitle={subtitle} 
          icon={icon}
          action={
            <Button variant="secondary" size="xs" onClick={onClose} className="rounded-full w-8 h-8 !p-0">
              ✕
            </Button>
          }
        />
        <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
