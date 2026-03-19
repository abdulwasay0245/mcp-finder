import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Sync endpoint — coming in Phase 9' })
}