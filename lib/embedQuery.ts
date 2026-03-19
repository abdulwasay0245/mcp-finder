/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from '@huggingface/transformers'

env.allowLocalModels = false
env.useBrowserCache = true

let embedder: any = null
let loadPromise: Promise<void> | null = null

async function loadModel() {
  if (embedder) return

  if (loadPromise) {
    await loadPromise
    return
  }

  loadPromise = (async () => {
    // Dynamic import avoids SSR issues in Next.js
    const { pipeline } = await import('@huggingface/transformers')
    embedder = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    )
  })()

  await loadPromise
}

export async function embedQuery(text: string): Promise<number[]> {
  await loadModel()

  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true
  })

  // output.data is a Float32Array — convert to plain number array
  return Array.from(output.data as Float32Array)
}