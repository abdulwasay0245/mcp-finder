'use client'
import { useState, useMemo } from 'react'
import { useSearch } from '@/hooks/useSearch'
import SearchBar from '@/components/Searchbar'
import QuickPrompts from '@/components/QuickPrompts'
import CategoryFilter from '@/components/CategoryFilter'
import ServerCard from '@/components/ServerCard'
import SkeletonCard from '@/components/SkeletonCard'
import EmptyState from '@/components/EmptyState'
import type { MCPServer } from '@/types'

interface SearchPageProps {
  servers: MCPServer[]
}

export default function SearchPage({ servers }: SearchPageProps) {
  const {
    query,
    setQuery,
    results,
    isLoading,
    isSemanticLoading,
    selectedCategory,
    setSelectedCategory
  } = useSearch(servers)

  // Count servers per category for the filter pills
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    servers.forEach(s => {
      counts[s.category] = (counts[s.category] ?? 0) + 1
    })
    return counts
  }, [servers])

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">

      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {servers.length} MCP Servers indexed
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Find the right{' '}
          <span className="text-emerald-400">MCP server</span>
          <br />
          for what you want to do
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-neutral-400">
          Search by what you want your AI to do — not by server name.
          Get instant config for Claude, Cursor, VS Code and more.
        </p>

        {/* Search */}
        <SearchBar
          query={query}
          setQuery={setQuery}
          isSemanticLoading={isSemanticLoading}
        />
        <QuickPrompts setQuery={setQuery} />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
          counts={categoryCounts}
        />
      </div>

      {/* Results count */}
      {query && !isLoading && (
        <p className="mb-4 text-sm text-neutral-500">
          {results.length > 0
            ? `${results.length} server${results.length === 1 ? '' : 's'} found for "${query}"`
            : null
          }
        </p>
      )}

      {/* Results grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : results.length === 0 && query ? (
        <EmptyState query={query} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(server => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      )}

    </div>
  )
}