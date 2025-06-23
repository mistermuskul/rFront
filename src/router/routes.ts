import { RouteRecordRaw } from 'vue-router';
import adminRoutes from './admin/index';
import authRoutes from './auth/index';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/admin'
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: authRoutes,
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: ':uuid',
        name: 'AdminWithUUID',
        component: () => import('layouts/MainLayout.vue'),
        meta: {
          requireAuth: false
        }
      },
      {
        path: '',
        name: 'Dashboard',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          requireAuth: true,
          roles: ['SuperAdmin', 'Admin', 'HR'],
        },
      },
      ...adminRoutes
    ],
    meta: {
      requireAuth: true,
      roles: ['SuperAdmin', 'Admin', 'HR'],
    },
  },
  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
