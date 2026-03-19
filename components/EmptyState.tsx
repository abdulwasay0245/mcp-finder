import Link from 'next/link'

interface EmptyStateProps {
  query: string
}

export default function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-4xl">🔍</div>
      <h3 className="mb-2 text-lg font-semibold text-white">
        No servers found for &quot;{query}&quot;
      </h3>
      <p className="mb-6 max-w-sm text-sm text-neutral-500">
        We couldn&apos;t find an MCP server matching your search. Try different words or browse by category.
      </p>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {['read emails', 'query database', 'search the web', 'manage files'].map(suggestion => (
          <span
            key={suggestion}
            className="rounded-full border border-neutral-800 px-3 py-1 text-sm text-neutral-400"
          >
            Try: &quot;{suggestion}&quot;
          </span>
        ))}
      </div>
      <Link
        href="/submit"
        className="text-sm text-emerald-400 hover:underline"
      >
        Don&apos;t see the server you need? Submit it →
      </Link>
    </div>
  )
}