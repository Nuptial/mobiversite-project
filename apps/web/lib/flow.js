export function postRegisterRedirectPath() {
  return '/login'
}
export function isProtectedPath(pathname) {
  return /^\/(profile|wishlist)(\/|$)/.test(pathname)
}
export function nextPathAfterLogin(search) {
  const params = new URLSearchParams(search || '')
  const to = params.get('redirect')
  return to || '/profile'
}
