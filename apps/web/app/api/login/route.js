import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { resolveEnv } from '@/lib/env'

export async function POST(req) {
  const { email, password } = await req.json()
  const { apiUrl, uiJwtSecret } = resolveEnv()
  let response

  try {
    response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
  } catch (error) {
    console.error('[login] Failed to reach API', error)
    return NextResponse.json({ error: 'Unable to reach authentication service' }, { status: 502 })
  }

  if (!response.ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const data = await response.json()

  const res = NextResponse.json({ user: data.user })
  res.cookies.set('session', data.accessToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 3 })
  const at_ui = jwt.sign({ uid: data.user.id, email: data.user.email }, uiJwtSecret, { expiresIn: '20m' })
  res.cookies.set('at_ui', at_ui, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 20 })
  res.cookies.set('uid', String(data.user.id), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 3 })
  res.cookies.set('email', data.user.email, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 3 })
  return res
}
