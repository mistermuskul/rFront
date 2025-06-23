export default [
    { path: '', component: () => import('pages/auth/login/LoginPage.vue') },
    {
      path: 'login',
      name: 'login',
      component: () => import('pages/auth/login/LoginPage.vue'),
    },
  ];
  