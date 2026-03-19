'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Fuse from 'fuse.js'
import { createFuseInstance, expandQuery } from '@/lib/fuseConfig'
import type { MCPServer } from '@/types'

export function useSearch(allServers: MCPServer[]) {
  const [query, setQuery]                     = useState('')
  const [results, setResults]                 = useState<MCPServer[]>([])
  const [isLoading, setIsLoading]             = useState(false)
  const [isSemanticLoading, setIsSemanticLoading] = useState(false)
  const [selectedCategory, setSelectedCategory]   = useState('All')

  const fuseRef    = useRef<Fuse<MCPServer> | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Build Fuse index once servers are loaded
  useEffect(() => {
    if (allServers.length > 0) {
      fuseRef.current = createFuseInstance(allServers)
      setResults(allServers)
    }
  }, [allServers])

  // Filter by category on top of search results
  const filterByCategory = useCallback(
    (items: MCPServer[], category: string) => {
      if (category === 'All') return items
      return items.filter(s => s.category === category)
    },
    []
  )

  const search = useCallback(
    async (q: string, category: string) => {
      if (!q.trim()) {
        setResults(filterByCategory(allServers, category))
        return
      }

      // ── Step 1: Instant Fuse.js results ──────────────────────────
      const expandedQuery = expandQuery(q)
      const fuseResults = fuseRef.current
        ?.search(expandedQuery)
        .map(r => r.item) ?? []

      setResults(filterByCategory(fuseResults, category))

      // ── Step 2: Semantic search in background ─────────────────────
      setIsSemanticLoading(true)
      try {
        // Lazy import — Transformers.js only loads when user types
        const { embedQuery } = await import('@/lib/embedQuery')
        const vector = await embedQuery(q)

        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vector })
        })

        if (!res.ok) throw new Error('Search API failed')

        const semanticResults: MCPServer[] = await res.json()

        // Merge semantic + keyword results
        // Semantic results go first (more accurate)
        // Keyword-only results fill the gaps after
        const semanticIds = new Set(semanticResults.map(s => s.id))
        const keywordOnly = fuseResults.filter(s => !semanticIds.has(s.id))
        const merged = [...semanticResults, ...keywordOnly]

        setResults(filterByCategory(merged, category))
      } catch (err) {
        // Silently fall back to Fuse.js results already shown
        console.warn('Semantic search failed, using keyword results:', err)
      } finally {
        setIsSemanticLoading(false)
      }
    },
    [allServers, filterByCategory]
  )

  // Debounce — wait 350ms after user stops typing before searching
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    setIsLoading(true)
    debounceRef.current = setTimeout(async () => {
      await search(query, selectedCategory)
      setIsLoading(false)
    }, 350)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, selectedCategory, search])

  return {
    query,
    setQuery,
    results,
    isLoading,
    isSemanticLoading,
    selectedCategory,
    setSelectedCategory
  }
}