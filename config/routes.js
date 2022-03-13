export default [
  {
    name: '服务',
    path: '/services',
    component: './Services',
  },
  {
    name: '路由',
    path: '/routes',
    component: './Routes',
  },
  {
    name: '插件',
    path: '/plugins',
    component: './Plugins',
  },
  {
    name: '上游',
    path: '/upstreams',
    component: './Upstreams',
  },
  {
    name: '上游',
    path: '/connections',
    component: './Connections',
  },
  {
    path: '/',
    redirect: '/services',
  },
  {
    component: './404',
  },
];
