import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  try {
    const { name, description, github_url, category, submitted_by } = await req.json()

    if (!name || !github_url) {
      return NextResponse.json(
        { error: 'name and github_url are required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('pending_servers')
      .insert({ name, description, github_url, category, submitted_by })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
