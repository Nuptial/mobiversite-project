const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

async function main() {
  const res = await fetch('https://fakestoreapi.com/products')
  const products = await res.json()

  const users = [
    { id: 1, email: 'demo@mobiversite.io', password: await bcrypt.hash('123456', 10), name: 'Demo User', wishlist: [] }
  ]

  const db = { products, orders: [], users }
  fs.writeFileSync(path.join(__dirname, '..', 'db.json'), JSON.stringify(db, null, 2))
  console.log('db.json written')
}

main().catch(e => { console.error(e); process.exit(1) })
