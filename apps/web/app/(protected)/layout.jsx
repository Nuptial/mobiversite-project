export default function ProtectedLayout({ children }) {
  return (
    <section className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="bg-white rounded-2xl shadow p-4 space-y-2 h-fit">
        <a href="/profile" className="block">Profile</a>
        <a href="/wishlist" className="block">Wishlist</a>
      </aside>
      <div>{children}</div>
    </section>
  )
}
