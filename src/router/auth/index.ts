export default [
    { path: '', component: () => import('src/pages/auth/login/LoginPage.vue') },
    {
      path: 'login',
      name: 'login',
      component: () => import('src/pages/auth/login/LoginPage.vue'),
    },
  ];
  