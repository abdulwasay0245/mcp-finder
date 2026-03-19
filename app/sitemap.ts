import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function sitemap() {
  const baseUrl = 'https://mcpfinder.dev' // change to your real domain later

  // Fetch all server IDs
  const { data: servers } = await supabaseAdmin
    .from('mcp_servers')
    .select('id, created_at')

  const serverUrls = (servers ?? []).map(s => ({
    url: `${baseUrl}/servers/${s.id}`,
    lastModified: new Date(s.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3
    },
    ...serverUrls
  ]
}