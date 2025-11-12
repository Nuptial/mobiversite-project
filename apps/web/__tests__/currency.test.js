import { describe, it, expect } from 'vitest'
import { money } from '../lib/currency'

describe('money()', () => {
  it('formats decimals correctly', () => {
    expect(money(12.3)).toBe('$12.30')
  })
  it('formats zero', () => {
    expect(money(0)).toBe('$0.00')
  })
  it('formats large numbers', () => {
    expect(money(1234567.89)).toBe('$1,234,567.89')
  })
  it('rounds half up as expected', () => {
    expect(money(2.005)).toBe('$2.01')
  })
})
