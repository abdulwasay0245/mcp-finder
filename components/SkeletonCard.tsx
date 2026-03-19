export default function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-5 animate-pulse">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="h-5 w-32 rounded bg-neutral-800" />
          <div className="mt-2 h-4 w-20 rounded-full bg-neutral-800" />
        </div>
        <div className="h-4 w-10 rounded bg-neutral-800" />
      </div>
      <div className="mb-4 space-y-2">
        <div className="h-3 w-full rounded bg-neutral-800" />
        <div className="h-3 w-4/5 rounded bg-neutral-800" />
      </div>
      <div className="mb-4 flex gap-1.5">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-5 w-14 rounded bg-neutral-800" />
        ))}
      </div>
      <div className="flex gap-1.5 border-t border-neutral-800 pt-3">
        <div className="h-4 w-8 rounded bg-neutral-800" />
        <div className="h-4 w-12 rounded bg-neutral-800" />
        <div className="h-4 w-12 rounded bg-neutral-800" />
      </div>
    </div>
  )
}