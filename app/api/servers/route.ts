import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Cache this response for 1 hour
export const revalidate = 3600

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('mcp_servers')
    .select(
      'id, name, description, category, tags, use_cases, github_url, npm_package, supported_os, supported_editors, config_template, stars'
    )
    // never select embedding — it's large and useless on frontend
    .order('stars', { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}