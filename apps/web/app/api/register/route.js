import { resolveEnv } from '@/lib/env'

export async function POST(req) {
  const body = await req.json()
  const { apiUrl } = resolveEnv()
  const response = await fetch(`${apiUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const data = await response.json()
  return Response.json(data, { status: response.status })
}
