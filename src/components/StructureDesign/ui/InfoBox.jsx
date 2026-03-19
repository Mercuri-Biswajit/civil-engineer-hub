export function InfoBox({ color, lightColor, children }) {
  const borderColor = color || '#6366f1' // Default indigo
  const bgColor = lightColor || '#f5f3ff'

  return (
    <div
      className="rounded-lg p-4 mb-4 border-l-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-md"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <div className="text-sm font-bold text-slate-700 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

