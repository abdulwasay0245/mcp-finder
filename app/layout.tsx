import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import './globals.css'
import html from 'shiki/dist/langs/html.mjs'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'MCP Finder — Find the right MCP server for what you want to do',
    template: '%s — MCP Finder'
  },
  description:
    'Search and discover Model Context Protocol servers by what you want your AI to do. Get instant config for Claude, Cursor, VS Code and Windsurf.',
  keywords: [
    'MCP',
    'Model Context Protocol',
    'MCP servers',
    'Claude',
    'Cursor',
    'AI tools',
    'MCP config'
  ],
  openGraph: {
    title: 'MCP Finder — Find the right MCP server for what you want to do',
    description:
      'Search MCP servers by what you want your AI to do. Get instant config for Claude, Cursor, VS Code and Windsurf.',
    url: 'https://mcpfinder.dev',
    siteName: 'MCP Finder',
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCP Finder',
    description: 'Find the right MCP server for what you want to do'
  },
  metadataBase: new URL('https://mcpfinder.dev')
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-neutral-950 text-white antialiased`}>
        <Navbar />
        <main>{children}</main>
        <footer className="mt-20 border-t border-neutral-800 py-10">
          <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-600">
              MCP Finder — Discover Model Context Protocol servers
            </p>
            <div className="flex items-center gap-6 text-sm text-neutral-600">
              <a
                href="https://github.com/modelcontextprotocol/servers"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition"
              >
                MCP Registry
              </a>
              <a
                href="https://glama.ai/mcp/servers"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition"
              >
                glama.ai
              </a>
              <Link
                href="/submit"
                className="hover:text-emerald-400 transition"
              >
                Submit a Server
              </Link>
            </div>
    </div>
    
        </footer>
      </body>
    </html>
  ) 
}