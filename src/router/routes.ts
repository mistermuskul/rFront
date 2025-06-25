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
    component: () => import('src/layouts/AuthLayout.vue'),
    children: authRoutes,
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/admin',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: ':uuid',
        name: 'AdminWithUUID',
        component: () => import('src/pages/admin/MainPage/index'),
        meta: {
          requireAuth: false
        }
      },
      {
        path: '',
        name: 'Dashboard',
        component: () => import('src/pages/admin/MainPage/index'),
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
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
];

export default routes;
