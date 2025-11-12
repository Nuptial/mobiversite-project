import { describe, it, expect } from 'vitest'
import { postRegisterRedirectPath, isProtectedPath, nextPathAfterLogin } from '../lib/flow'

describe('postRegisterRedirectPath()', () => {
  it('always returns /login as decided', () => {
    expect(postRegisterRedirectPath()).toBe('/login')
  })
})
describe('isProtectedPath()', () => {
  it('detects protected routes', () => {
    expect(isProtectedPath('/profile')).toBe(true)
    expect(isProtectedPath('/profile/orders')).toBe(true)
    expect(isProtectedPath('/wishlist')).toBe(true)
  })
  it('returns false for public routes', () => {
    expect(isProtectedPath('/')).toBe(false)
    expect(isProtectedPath('/products/1')).toBe(false)
    expect(isProtectedPath('/cart')).toBe(false)
  })
})
describe('nextPathAfterLogin()', () => {
  it('returns redirect target when provided', () => {
    expect(nextPathAfterLogin('?redirect=/cart')).toBe('/cart')
  })
  it('handles wishlist redirect', () => {
    expect(nextPathAfterLogin('?redirect=/wishlist')).toBe('/wishlist')
  })
  it('falls back to /profile when missing', () => {
    expect(nextPathAfterLogin('')).toBe('/profile')
  })
})
