export default {
  npmClient: 'pnpm',
  apiRoute: {
    platform: 'vercel'
  },
  routes: [
    { path: '/', component: 'index' },
    { path: '/posts/create', component: 'posts/create' },
    { path: '/login', component: 'login/login' },
    { path: '/register', component: 'login/login'},
    { path: '/posts/:postId', component: 'posts/post' },
    { path: '/dashboard', component: 'dashboard/dashboard' },
  ],
  plugins: [require.resolve('@umijs/plugins/dist/tailwindcss'), require.resolve('@umijs/plugins/dist/antd')],
  tailwindcss: {},
  antd: {
    // configProvider
    configProvider: {},
    // themes
    dark: false,
    compact: true,
    // babel-plugin-import
    import: true,
    // less or css, default less
    style: 'less',
  },
};