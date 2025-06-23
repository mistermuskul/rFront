import { RouteMeta } from 'vue-router'

export interface CustomRouteMeta extends RouteMeta {
  requireAuth?: boolean
  roles?: string[]
  title?: string
  icon?: string
} 