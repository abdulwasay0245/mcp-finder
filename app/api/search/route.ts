import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  try {
    const { vector } = await req.json()

    // Basic validation
    if (!vector || !Array.isArray(vector) || vector.length !== 384) {
      return NextResponse.json(
        { error: 'Invalid vector — must be an array of 384 numbers' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin.rpc('match_servers', {
      query_embedding: vector,
      match_threshold: 0.3,
      match_count: 15
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)

  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}