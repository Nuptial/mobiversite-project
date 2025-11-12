import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { resolveEnv } from '@/lib/env'

export async function POST(req) {
  const session = req.cookies.get('session')?.value
  const uid = req.cookies.get('uid')?.value
  const email = req.cookies.get('email')?.value
  if (!session) return NextResponse.json({ error: 'no session' }, { status: 401 })

  const { apiUrl, uiJwtSecret } = resolveEnv()

  const ping = await fetch(`${apiUrl}/products?_limit=1`, { headers: { Authorization: `Bearer ${session}` } })
  if (!ping.ok) return NextResponse.json({ error: 'session expired' }, { status: 401 })

  const at_ui = jwt.sign({ uid, email }, uiJwtSecret, { expiresIn: '20m' })
  const res = NextResponse.json({ ok: true })
  res.cookies.set('at_ui', at_ui, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 20 })
  return res
}
