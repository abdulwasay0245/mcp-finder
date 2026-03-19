import SearchPage from '@/components/Searchpage'
import type { MCPServer } from '@/types'

async function getServers(): Promise<MCPServer[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const res = await fetch(`${baseUrl}/api/servers`, {
    next: { revalidate: 3600 }
  })

  if (!res.ok) return []
  return res.json()
}

export default async function Home() {
  const servers = await getServers()
  return <SearchPage servers={servers} />
}