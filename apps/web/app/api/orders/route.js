import { resolveEnv } from '@/lib/env'

export async function GET(req) {
  const session = req.cookies.get('session')?.value
  const uid = req.cookies.get('uid')?.value
  if (!session || !uid) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const { apiUrl } = resolveEnv()
  const response = await fetch(`${apiUrl}/orders?userId=${uid}`, { headers: { Authorization: `Bearer ${session}` } })
  const data = await response.json()
  return Response.json(data)
}

export async function POST(req) {
  const session = req.cookies.get('session')?.value
  const uid = req.cookies.get('uid')?.value
  if (!session || !uid) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json()
  const payload = { userId: Number(uid), items: body.items, total: body.total, status: 'paid', date: new Date().toISOString() }
  const { apiUrl } = resolveEnv()
  const response = await fetch(`${apiUrl}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session}` }, body: JSON.stringify(payload) })
  const data = await response.json()
  return Response.json(data, { status: 201 })
}
