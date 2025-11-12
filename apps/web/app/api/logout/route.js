import { NextResponse } from 'next/server'
export async function POST() {
  const res = NextResponse.json({ ok: true })
  for (const n of ['session','at_ui','uid','email']) res.cookies.set(n, '', { maxAge: 0, path: '/' })
  return res
}
