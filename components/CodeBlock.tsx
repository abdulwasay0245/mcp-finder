'use client'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language: string
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg border border-neutral-800 bg-neutral-950">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
        <span className="text-xs text-neutral-600">{language}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-neutral-500 transition hover:bg-neutral-800 hover:text-white"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-4 text-sm text-neutral-300">
        <code>{code}</code>
      </pre>
    </div>
  )
}