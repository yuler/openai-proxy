import type { NextRequest } from 'next/server'

// refs: https://vercel.com/docs/concepts/functions/edge-functions/edge-functions-api
export const config = {
  runtime: 'edge', // this is a pre-requisite
  // exclude hongkong cause it's not supported by OpenAI, refs: https://platform.openai.com/docs/supported-countries
  regions: [
    'sin1',
    'cdg1',
    'arn1',
    'dub1',
    'lhr1',
    'iad1',
    'sfo1',
    'pdx1',
    'cle1',
    'gru1',
    'hnd1',
    'icn1',
    'kix1',
    'bom1',
    'syd1',
    'fra1',
    'cpt1',
  ],
}

const pickHeaders = (headers: Headers, keys: (string | RegExp)[]): Headers => {
  const picked = new Headers()
  for (const key of headers.keys()) {
    if (keys.some((k) => (typeof k === 'string' ? k === key : k.test(key)))) {
      const value = headers.get(key)
      if (typeof value === 'string') {
        picked.set(key, value)
      }
    }
  }
  return picked
}

const CORS_HEADERS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'Content-Type, Authorization',
}

// export async function OPTIONS(req: NextRequest) {
//   return new Response(null, {
//     headers: CORS_HEADERS,
//   })
// }

// export async function GET(req: NextRequest) {
//   return await handle(req)
// }

// export async function POST(req: NextRequest) {
//   return await handle(req)
// }

export default async function handle(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: CORS_HEADERS,
    })
  }

  const { pathname, search } = req.nextUrl ? req.nextUrl : new URL(req.url)
  const url = new URL(pathname + search, 'https://api.openai.com').href
  const headers = pickHeaders(req.headers, ['content-type', 'authorization'])
  
  console.log({ url, headers: [...headers.entries()] })
  console.log({ body: req.body })
  
  const res = await fetch(url, {
    body: req.body,
    method: req.method,
    headers,
  })

  const resHeaders = {
    ...CORS_HEADERS,
    ...Object.fromEntries(pickHeaders(res.headers, ['content-type', /^x-ratelimit-/, /^openai-/])),
  }

  return new Response(res.body, {
    headers: resHeaders,
  })
}
