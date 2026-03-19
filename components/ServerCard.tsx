import Link from 'next/link'
import type { MCPServer } from '@/types'

const categoryColors: Record<string, string> = {
  'Communication': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Productivity':  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Dev Tools':     'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Databases':     'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Files':         'bg-green-500/10 text-green-400 border-green-500/20',
  'Browser & Web': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
}

const editorLabels: Record<string, string> = {
  claude:   'Claude',
  cursor:   'Cursor',
  vscode:   'VS Code',
  windsurf: 'Windsurf'
}

interface ServerCardProps {
  server: MCPServer
}

export default function ServerCard({ server }: ServerCardProps) {
  const categoryColor = categoryColors[server.category] ?? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'

  return (
    <Link href={`/servers/${server.id}`}>
      <div className="group relative flex h-full flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5">

        {/* Similarity badge */}
        {server.similarity !== undefined && (
          <div className="absolute right-4 top-4 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 border border-emerald-500/20">
            {Math.round(server.similarity * 100)}% match
          </div>
        )}

        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition">
              {server.name}
            </h3>
            <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-xs ${categoryColor}`}>
              {server.category}
            </span>
          </div>
          {/* Stars */}
          <div className="flex shrink-0 items-center gap-1 text-xs text-neutral-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {server.stars.toLocaleString()}
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-neutral-400 line-clamp-2 flex-1">
          {server.description}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {server.tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className="rounded-md bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400"
            >
              {tag}
            </span>
          ))}
          {server.tags.length > 4 && (
            <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-xs text-neutral-500">
              +{server.tags.length - 4} more
            </span>
          )}
        </div>

        {/* Footer — supported editors */}
        <div className="flex items-center gap-1.5 border-t border-neutral-800 pt-3">
          <span className="text-xs text-neutral-600">Works with:</span>
          {server.supported_editors.map(editor => (
            <span
              key={editor}
              className="rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-neutral-400"
            >
              {editorLabels[editor] ?? editor}
            </span>
          ))}
        </div>

      </div>
    </Link>
  )
}