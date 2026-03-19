'use client'

const categories = [
  'All',
  'Communication',
  'Productivity',
  'Dev Tools',
  'Databases',
  'Files',
  'Browser & Web'
]

interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
  counts: Record<string, number>
}

export default function CategoryFilter({
  selected,
  onChange,
  counts
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map(cat => {
        const count = cat === 'All'
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : (counts[cat] ?? 0)

        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition
              ${selected === cat
                ? 'bg-emerald-500 text-black'
                : 'border border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-emerald-500 hover:text-emerald-400'
              }`}
          >
            {cat}
            <span className={`text-xs ${selected === cat ? 'text-black/60' : 'text-neutral-600'}`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}