import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_DEFAULT_KEY
)

const servers = JSON.parse(
  readFileSync('./data/servers.json', 'utf-8')
)

console.log(`Seeding ${servers.length} servers...`)

const { error } = await supabase
  .from('mcp_servers')
  .insert(servers)

if (error) {
  console.error('Seed failed:', error.message)
  process.exit(1)
} else {
  console.log(`✅ Seeded ${servers.length} servers successfully!`)
}