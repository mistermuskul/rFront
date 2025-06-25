import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { CustomRouteMeta } from '../types'

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  console.log('Auth guard triggered:', { to: to.path, from: from.path })
  
  const auth = useAuthStore()
  if (!auth.token && localStorage.getItem('token')) {
    auth.token = localStorage.getItem('token')
  }

  const fullPath = window.location.href
  const uuidMatch = fullPath.match(/\/admin\/([^\/#]+)/)
  if (uuidMatch) {
    const uuid = uuidMatch[1]
    console.log('UUID found:', uuid)
    const autoLoginSuccess = await auth.autoLogin(uuid)
    console.log('Auto login result:', autoLoginSuccess)
    if (autoLoginSuccess) {
      return next()
    } else {
      return next({ name: 'login' })
    }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  if (!auth.token) {
    if ((to.meta as CustomRouteMeta).requireAuth) {
      return next({ name: 'login' })
    }
    return next()
  }

  if (!auth.user) {
    try {
      await auth.fetchUser()
      if (!auth.user) {
        auth.logout()
        return next({ name: 'login' })
      }
    } catch (error) {
      auth.logout()
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