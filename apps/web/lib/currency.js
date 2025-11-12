export const money = (n) => Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
