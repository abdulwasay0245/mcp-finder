import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { buildConfig, getConfigFilePath } from '@/lib/configBuilder'

export async function POST(req: Request) {
  try {
    const { server_id, os, editor } = await req.json()

    // Validate inputs
    if (!server_id || !os || !editor) {
      return NextResponse.json(
        { error: 'server_id, os and editor are all required' },
        { status: 400 }
      )
    }

    const validOS = ['mac', 'windows', 'linux']
    const validEditors = ['claude', 'cursor', 'vscode', 'windsurf']

    if (!validOS.includes(os)) {
      return NextResponse.json(
        { error: `os must be one of: ${validOS.join(', ')}` },
        { status: 400 }
      )
    }

    if (!validEditors.includes(editor)) {
      return NextResponse.json(
        { error: `editor must be one of: ${validEditors.join(', ')}` },
        { status: 400 }
      )
    }

    // Fetch the server
    const { data: server, error } = await supabaseAdmin
      .from('mcp_servers')
      .select('name, npm_package, config_template')
      .eq('id', server_id)
      .single()

    if (error || !server) {
      return NextResponse.json(
        { error: 'Server not found' },
        { status: 404 }
      )
    }

    // Build the final config
    const config = buildConfig(server.config_template, os)

    return NextResponse.json({
      config,
      install_command: `npx -y ${server.npm_package}`,
      config_file_path: getConfigFilePath(os, editor)
    })

  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}