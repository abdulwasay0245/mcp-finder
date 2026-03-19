'use client'

const prompts = [
  'Read and send emails',
  'Access my GitHub repos',
  'Save notes to Notion',
  'Query my database',
  'Control my browser',
  'Manage files on my computer',
  'Send Slack messages',
  'Search the web',
  'Track issues and bugs',
  'Manage calendar events'
]

interface QuickPromptsProps {
  setQuery: (q: string) => void
}

export default function QuickPrompts({ setQuery }: QuickPromptsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {prompts.map(prompt => (
        <button
          key={prompt}
          onClick={() => setQuery(prompt)}
          className="rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1.5 text-sm text-neutral-400 transition hover:border-emerald-500 hover:text-emerald-400"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}