import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { CustomRouteMeta } from '../types'

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const auth = useAuthStore()
  if (!auth.token && localStorage.getItem('token')) {
    auth.token = localStorage.getItem('token')
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  const fullPath = window.location.href
  const uuidMatch = fullPath.match(/\/admin\/([^\/#]+)/)
  if (uuidMatch) {
    const uuid = uuidMatch[1]
    const autoLoginSuccess = await auth.autoLogin(uuid)
    if (autoLoginSuccess) {
      return next()
    } else {
      return next({ name: 'login' })
    }
  }

  if (!auth.token) {
    if ((to.meta as CustomRouteMeta).requireAuth) {
      return next({ name: 'login' })
    }
    return next()
  }

  if (!auth.user) {
    await auth.fetchUser()
    if (!auth.user) {
      return next({ name: 'login' })
    }
  }

  const meta = to.meta as CustomRouteMeta
  if (meta.roles) {
    const hasRequiredRole = meta.roles.some((role: string) => auth.hasRole(role))
    if (!hasRequiredRole) {
      return next({ name: 'login' })
    }
  }

  next()
} 