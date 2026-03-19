'use client'

interface SearchBarProps {
  query: string
  setQuery: (q: string) => void
  isSemanticLoading: boolean
}

export default function SearchBar({
  query,
  setQuery,
  isSemanticLoading
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">

      {/* Search icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="What do you want your AI to do? e.g. read emails and save to Notion..."
        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-4 pl-12 pr-12 text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      />

      {/* Right side — spinner or clear button */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        {isSemanticLoading ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400">AI matching...</span>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-emerald-400" />
          </div>
        ) : query ? (
          <button
            onClick={() => setQuery('')}
            className="text-neutral-500 hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>

    </div>
  )
}