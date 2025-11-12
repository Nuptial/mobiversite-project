'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const ProfileSidebar = () => {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/profile',
      label: 'Profile',
    },
    {
      href: '/wishlist',
      label: 'Wishlist',
    },
  ]

  return (
    <aside className="h-fit space-y-2 rounded-2xl bg-white p-4 shadow">
      {navItems.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'block rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
              isActive
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-700 hover:bg-neutral-100',
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
          </Link>
        )
      })}
    </aside>
  )
}

export default ProfileSidebar

