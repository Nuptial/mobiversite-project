import ProfileSidebar from '@/components/profile-sidebar'

export default function ProtectedLayout({ children }) {
  return (
    <section className="grid gap-6 md:grid-cols-[220px_1fr]">
      <ProfileSidebar />
      <div>{children}</div>
    </section>
  )
}
