import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
            <span className="text-sm font-bold text-black">M</span>
          </div>
          <span className="text-lg font-bold text-white">
            MCP <span className="text-emerald-400">Finder</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-neutral-500 sm:block">
            {/* will show server count later */}
          </span>
          <Link
            href="/submit"
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:border-emerald-500 hover:text-emerald-400"
          >
            + Submit a Server
          </Link>
        </div>

      </div>
    </nav>
  )
}