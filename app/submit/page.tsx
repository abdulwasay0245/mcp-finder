'use client'
import { useState } from 'react'
import Link from 'next/link'

const categories = [
  'Communication',
  'Productivity',
  'Dev Tools',
  'Databases',
  'Files',
  'Browser & Web'
]

export default function SubmitPage() {
  const [form, setForm] = useState({
    name: '',
    github_url: '',
    description: '',
    category: '',
    submitted_by: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit() {
    if (!form.name || !form.github_url) return

    setStatus('loading')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mb-4 text-5xl">🎉</div>
        <h1 className="mb-2 text-2xl font-bold text-white">Thanks for submitting!</h1>
        <p className="mb-8 text-neutral-400">We'll review it and add it to the index soon.</p>
        <Link href="/" className="text-emerald-400 hover:underline">← Back to search</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-emerald-400 transition">
        ← Back to search
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-white">Submit an MCP Server</h1>
      <p className="mb-8 text-neutral-400">Know an MCP server that's missing? Add it here.</p>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm text-neutral-400">
            Server name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Gmail MCP"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-white placeholder-neutral-600 outline-none focus:border-emerald-500"
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label className="mb-1.5 block text-sm text-neutral-400">
            GitHub URL <span className="text-red-400">*</span>
          </label>
          <input
            type="url"
            value={form.github_url}
            onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))}
            placeholder="https://github.com/..."
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-white placeholder-neutral-600 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm text-neutral-400">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="What does this MCP server do?"
            rows={3}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-white placeholder-neutral-600 outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-sm text-neutral-400">Category</label>
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Your email */}
        <div>
          <label className="mb-1.5 block text-sm text-neutral-400">Your email (optional)</label>
          <input
            type="email"
            value={form.submitted_by}
            onChange={e => setForm(f => ({ ...f, submitted_by: e.target.value }))}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-white placeholder-neutral-600 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Error */}
        {status === 'error' && (
          <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!form.name || !form.github_url || status === 'loading'}
          className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Submitting...' : 'Submit Server'}
        </button>
      </div>
    </div>
  )
}