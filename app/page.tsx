import SearchPage from '@/components/Searchpage'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { MCPServer } from '@/types'

async function getServers(): Promise<MCPServer[]> {
  const { data, error } = await supabaseAdmin
    .from('mcp_servers')
    .select(
      'id, name, description, category, tags, use_cases, github_url, npm_package, supported_os, supported_editors, config_template, stars'
    )
    .order('stars', { ascending: false })

  if (error) {
    console.error('Failed to fetch servers:', error.message)
    return []
  }

  return data ?? []
}

export default async function Home() {
  const servers = await getServers()
  return <SearchPage servers={servers} />
}