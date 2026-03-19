export function StatGrid({ cols = 3, children }) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-3 lg:grid-cols-6',
  }[cols] || 'grid-cols-2 lg:grid-cols-3'

  return (
    <div className={`grid ${gridCols} gap-4 mb-6`}>
      {children}
    </div>
  )
}

