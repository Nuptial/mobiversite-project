import { describe, it, expect } from 'vitest'

function add(prev, p){
  const f = prev.find(i => i.id===p.id)
  return f ? prev.map(i=>i.id===p.id?{...i,quantity:i.quantity+1}:i) : [...prev,{...p,quantity:1}]
}
function updateQty(prev, id, q){
  return prev.map(i=>i.id===id?{...i,quantity:q}:i)
}
describe('cart mutations', () => {
  it('adds new item with quantity 1', () => {
    const next = add([], { id: 1, price: 10 })
    expect(next).toEqual([{ id:1, price:10, quantity:1 }])
  })
  it('increments existing item quantity', () => {
    const next = add([{ id:1, price:10, quantity:1 }], { id:1, price:10 })
    expect(next[0].quantity).toBe(2)
  })
  it('updates quantity immutably', () => {
    const prev = [{ id:2, price:5, quantity:1 }]
    const next = updateQty(prev, 2, 7)
    expect(next[0].quantity).toBe(7)
    expect(prev[0].quantity).toBe(1)
  })
})
