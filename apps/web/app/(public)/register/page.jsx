'use client'
import { useState } from 'react'
import { postRegisterRedirectPath } from '@/lib/flow'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    const r = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) })
    setLoading(false)
    if (r.ok) window.location.href = postRegisterRedirectPath()
    else alert('Register failed')
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow space-y-4">
      <h1 className="text-xl font-bold">Create account</h1>
      <input className="w-full border rounded p-2" value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
      <input className="w-full border rounded p-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input className="w-full border rounded p-2" value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" />
      <button disabled={loading} className="w-full px-4 py-2 rounded bg-black text-white">{loading? 'Creating…' : 'Register'}</button>
      <p className="text-sm">Already have an account? <a href="/login" className="underline">Login</a></p>
    </form>
  )
}
