'use client'
import { useState } from 'react'
import type { MCPServer } from '@/types'
import CodeBlock from '@/components/CodeBlock'

const osOptions = [
  { value: 'mac',     label: 'Mac' },
  { value: 'windows', label: 'Windows' },
  { value: 'linux',   label: 'Linux' }
]

const editorOptions = [
  { value: 'claude',   label: 'Claude Desktop' },
  { value: 'cursor',   label: 'Cursor' },
  { value: 'vscode',   label: 'VS Code' },
  { value: 'windsurf', label: 'Windsurf' }
]

interface ConfigResult {
  config: Record<string, unknown>
  install_command: string
  config_file_path: string
}

interface ConfigGeneratorProps {
  server: MCPServer
}

export default function ConfigGenerator({ server }: ConfigGeneratorProps) {
  const [os, setOs]         = useState('')
  const [editor, setEditor] = useState('')
  const [result, setResult] = useState<ConfigResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  async function generate(selectedOs: string, selectedEditor: string) {
    if (!selectedOs || !selectedEditor) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/generate-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server_id: server.id,
          os: selectedOs,
          editor: selectedEditor
        })
      })

      if (!res.ok) throw new Error('Failed to generate config')
      const data = await res.json()
      setResult(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleOsChange(value: string) {
    setOs(value)
    if (editor) generate(value, editor)
  }

  function handleEditorChange(value: string) {
    setEditor(value)
    if (os) generate(os, value)
  }

  return (
    <div>
      {/* OS Selector */}
      <div className="mb-4">
        <p className="mb-2 text-sm text-neutral-400">Step 1 — Select your OS</p>
        <div className="flex gap-2">
          {osOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleOsChange(opt.value)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition
                ${os === opt.value
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-white'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Selector */}
      <div className="mb-6">
        <p className="mb-2 text-sm text-neutral-400">Step 2 — Select your editor</p>
        <div className="flex flex-wrap gap-2">
          {editorOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleEditorChange(opt.value)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition
                ${editor === opt.value
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-white'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-700 border-t-emerald-400" />
          Generating config...
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Install command */}
          <div>
            <p className="mb-2 text-sm text-neutral-500">Install command</p>
            <CodeBlock code={result.install_command} language="bash" />
          </div>

          {/* Config JSON */}
          <div>
            <p className="mb-2 text-sm text-neutral-500">Config JSON</p>
            <CodeBlock
              code={JSON.stringify(result.config, null, 2)}
              language="json"
            />
          </div>

          {/* Where to paste */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
            <p className="mb-1 text-sm font-medium text-neutral-300">
              📁 Paste this config into:
            </p>
            <code className="text-sm text-emerald-400">
              {result.config_file_path}
            </code>
            <p className="mt-2 text-xs text-neutral-600">
              Merge the <code className="text-neutral-400">mcpServers</code> key
              into your existing config file if one already exists.
            </p>
          </div>
        </div>
      )}

      {/* Prompt when nothing selected yet */}
      {!os && !editor && !loading && (
        <div className="rounded-lg border border-dashed border-neutral-800 p-6 text-center text-sm text-neutral-600">
          Select your OS and editor above to generate your config
        </div>
      )}
    </div>
  )
}