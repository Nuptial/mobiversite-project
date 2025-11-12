'use client'

import { Toaster } from 'react-hot-toast'

import { CartProvider } from '../context/CartContext'
import { WishlistProvider } from '../context/WishlistContext'

const Providers = ({ children }) => (
  <WishlistProvider>
    <CartProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          className: 'rounded-2xl bg-neutral-900 text-white text-sm font-medium',
        }}
      />
    </CartProvider>
  </WishlistProvider>
)

export default Providers

