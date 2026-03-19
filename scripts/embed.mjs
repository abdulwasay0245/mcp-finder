import { pipeline, env } from '@huggingface/transformers'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

// Force download from HuggingFace hub, use local cache after first run
env.allowLocalModels = false
env.useBrowserCache = false   // this is a Node script, not browser

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_DEFAULT_KEY
)

// ── Step 1: Load the model ──────────────────────────────────────────
console.log('⏳ Loading embedding model (first run downloads ~23MB)...')

const embedder = await pipeline(
  'feature-extraction',
  'Xenova/all-MiniLM-L6-v2'
)

console.log('✅ Model loaded!\n')

// ── Step 2: Fetch servers that don't have embeddings yet ────────────
const { data: servers, error: fetchError } = await supabase
  .from('mcp_servers')
  .select('id, name, description, tags, use_cases')
  .is('embedding', null)

if (fetchError) {
  console.error('Failed to fetch servers:', fetchError.message)
  process.exit(1)
}

if (servers.length === 0) {
  console.log('All servers already have embeddings. Nothing to do!')
  process.exit(0)
}

console.log(`Found ${servers.length} servers to embed...\n`)

// ── Step 3: Embed each server and store vector in Supabase ──────────
let success = 0
let failed = 0

for (const server of servers) {
  try {
    // Combine all meaningful text into one string
    // The richer this text, the better the semantic search
    const text = [
      server.name,
      server.description,
      (server.tags || []).join(', '),
      (server.use_cases || []).join('. ')
    ].join(' | ')

    // Generate the 384-dimension vector
    const output = await embedder(text, {
      pooling: 'mean',
      normalize: true
    })

    const vector = Array.from(output.data)

    // Store vector back in Supabase
    const { error: updateError } = await supabase
      .from('mcp_servers')
      .update({ embedding: vector })
      .eq('id', server.id)

    if (updateError) {
      console.error(`✗ Failed: ${server.name} — ${updateError.message}`)
      failed++
    } else {
      console.log(`✅ ${server.name}`)
      success++
    }

  } catch (err) {
    console.error(`✗ Error on ${server.name}:`, err.message)
    failed++
  }
}

// ── Step 4: Summary ─────────────────────────────────────────────────
console.log(`\n──────────────────────────`)
console.log(`✅ Success: ${success}`)
if (failed > 0) console.log(`✗  Failed:  ${failed}`)
console.log(`──────────────────────────`)
console.log('Embedding complete!')