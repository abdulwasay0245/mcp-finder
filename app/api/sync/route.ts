import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Protect this route — only Vercel Cron can call it
function isAuthorized(req: Request): boolean {
  const authHeader = req.headers.get('authorization')
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: Request) {
  // Block unauthorized requests
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Fetch current server names so we don't add duplicates
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('mcp_servers')
      .select('name')

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch existing servers' },
        { status: 500 }
      )
    }

    const existingNames = new Set(
      (existing ?? []).map(s => s.name.toLowerCase())
    )

    // Fetch latest servers from glama.ai public API
    const res = await fetch(
      'https://glama.ai/api/mcp/v1/servers?first=100',
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from glama.ai' },
        { status: 500 }
      )
    }

    const glamaData = await res.json()
    const glamaServers = glamaData?.servers ?? glamaData?.data ?? []

    // Filter to only NEW servers not already in our database
    const newServers = glamaServers
      .filter((s: any) =>
        s.name && !existingNames.has(s.name.toLowerCase())
      )
      .map((s: any) => ({
        name:               s.name ?? '',
        description:        s.description ?? '',
        category:           s.category ?? 'Dev Tools',
        tags:               s.tags ?? [],
        use_cases:          [],        // will need manual enrichment
        github_url:         s.url ?? s.githubUrl ?? '',
        npm_package:        s.npmPackage ?? '',
        supported_os:       ['mac', 'windows', 'linux'],
        supported_editors:  ['claude', 'cursor', 'vscode'],
        config_template:    {},
        stars:              s.stars ?? 0
      }))

    if (newServers.length === 0) {
      return NextResponse.json({
        message: 'No new servers found',
        added: 0
      })
    }

    // Insert new servers into Supabase
    const { error: insertError } = await supabaseAdmin
      .from('mcp_servers')
      .insert(newServers)

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `Successfully added ${newServers.length} new servers`,
      added: newServers.length
    })

  } catch (err) {
    return NextResponse.json(
      { error: 'Sync failed unexpectedly' },
      { status: 500 }
    )
  }
}