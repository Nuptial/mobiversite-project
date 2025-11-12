'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { nextPathAfterLogin } from '@/lib/flow'

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('demo@mobiversite.io')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (loading) return

    setErrorMessage('')
    setLoading(true)

    const redirectPath = nextPathAfterLogin(window.location.search)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        setErrorMessage('Invalid email or password. Please try again.')
        setLoading(false)
        return
      }

      setLoading(false)
      router.replace(redirectPath)
      router.refresh()
    } catch (error) {
      console.error('[login] Unexpected error', error)
      setErrorMessage('Unable to sign in. Please try again shortly.')
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md space-y-4 rounded-2xl bg-white p-6 shadow"
    >
      <h1 className="text-xl font-bold text-neutral-900">Login</h1>
      <label className="block space-y-1 text-sm font-medium text-neutral-700">
        <span>Email</span>
        <input
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          aria-label="Email address"
          required
        />
      </label>
      <label className="block space-y-1 text-sm font-medium text-neutral-700">
        <span>Password</span>
        <input
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          aria-label="Password"
          required
        />
      </label>
      {errorMessage ? (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="text-sm text-neutral-600">
        No account?{' '}
        <a
          href="/register"
          className="font-semibold text-neutral-900 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          Register
        </a>
      </p>
    </form>
  )
}

export default LoginPage
