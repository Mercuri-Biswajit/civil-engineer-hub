export function Card({ children, style: extra, accentColor }) {
  return (
    <div
      className={`relative bg-white border border-slate-100/60 rounded-lg p-6 shadow-luxury hover:shadow-luxury-hover group transition-all duration-500`}
      style={{
        ...(accentColor ? { borderLeftWidth: '5px', borderLeftColor: accentColor } : {}),
        ...extra,
      }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

