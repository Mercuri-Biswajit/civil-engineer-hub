export function TwoCol({ left, right, leftWidth = 'lg:w-[400px]' }) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className={`${leftWidth} w-full shrink-0 lg:sticky lg:top-24`}>
        {left}
      </div>
      <div className="flex-1 min-w-0 w-full">
        {right}
      </div>
    </div>
  )
}

