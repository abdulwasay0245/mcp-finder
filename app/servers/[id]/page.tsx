import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { MCPServer } from '@/types'
import ConfigGenerator from '@/components/ConfigGenerator'
import { supabaseAdmin } from '@/lib/supabase-admin'

async function getServer(id: string): Promise<MCPServer | null> {
  const { data, error } = await supabaseAdmin
    .from('mcp_servers')
    .select(
      'id, name, description, category, tags, use_cases, github_url, npm_package, supported_os, supported_editors, config_template, stars'
    )
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const server = await getServer(id)
  if (!server) return { title: 'Server Not Found' }
  return {
    title: `${server.name} MCP Server — MCP Finder`,
    description: server.description
  }
}

const categoryColors: Record<string, string> = {
  'Communication': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Productivity':  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Dev Tools':     'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Databases':     'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Files':         'bg-green-500/10 text-green-400 border-green-500/20',
  'Browser & Web': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
}

export default async function ServerPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const server = await getServer(id)
  if (!server) return notFound()

  const categoryColor =
    categoryColors[server.category] ??
    'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">

      {/* Back button */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-emerald-400 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All Servers
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{server.name}</h1>
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${categoryColor}`}>
              {server.category}
            </span>
          </div>
          <p className="text-neutral-400">{server.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-neutral-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {server.stars.toLocaleString()}
          </div>
          {server.github_url && (
            
            <a
              href={server.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-neutral-800 px-4 py-2 text-sm text-neutral-300 transition hover:border-emerald-500 hover:text-emerald-400"
            >
              GitHub →
            </a>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-500">
          Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {server.tags.map(tag => (
            <span
              key={tag}
              className="rounded-lg bg-neutral-800 px-3 py-1 text-sm text-neutral-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-500">
          What you can do with this
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {server.use_cases.map(uc => (
            <li
              key={uc}
              className="flex items-center gap-2 text-sm text-neutral-300"
            >
              <span className="text-emerald-500">✓</span>
              {uc}
            </li>
          ))}
        </ul>
      </div>

      {/* Supported Editors */}
      <div className="mb-10">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-500">
          Supported Editors
        </h2>
        <div className="flex flex-wrap gap-2">
          {server.supported_editors.map(editor => (
            <span
              key={editor}
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-1.5 text-sm text-neutral-300 capitalize"
            >
              {editor === 'vscode' ? 'VS Code' : editor}
            </span>
          ))}
        </div>
      </div>

      {/* Config Generator */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-1 text-xl font-semibold text-white">
          Get your config
        </h2>
        <p className="mb-6 text-sm text-neutral-500">
          Select your OS and editor to get the exact config to paste
        </p>
        <ConfigGenerator server={server} />
      </div>

    </div>
  )
}