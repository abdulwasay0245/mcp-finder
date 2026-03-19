import Fuse from 'fuse.js'
import type { MCPServer } from '@/types'
import synonymsJson from '@/data/synonyms.json'

const synonyms = synonymsJson as Record<string, string[]>

// Expand query words using synonyms map
// "send email" → "send email gmail inbox mail message outlook"
export function expandQuery(query: string): string {
  const words = query.toLowerCase().split(/\s+/)
  const expanded = new Set(words)

  for (const word of words) {
    if (synonyms[word]) {
      synonyms[word].forEach(syn => expanded.add(syn))
    }
    // Also check if any synonym key is contained in the word
    // e.g. "emails" matches "email"
    for (const [key, values] of Object.entries(synonyms)) {
      if (word.includes(key) || key.includes(word)) {
        expanded.add(key)
        values.forEach(syn => expanded.add(syn))
      }
    }
  }

  return Array.from(expanded).join(' ')
}

// Create a Fuse instance with weighted keys
export function createFuseInstance(servers: MCPServer[]) {
  return new Fuse(servers, {
    keys: [
      { name: 'use_cases',   weight: 0.5  },
      { name: 'tags',        weight: 0.3  },
      { name: 'description', weight: 0.15 },
      { name: 'name',        weight: 0.05 }
    ],
    threshold: 0.4,
    includeScore: true,
    shouldSort: true,
    minMatchCharLength: 2,
    ignoreLocation: true
  })
}