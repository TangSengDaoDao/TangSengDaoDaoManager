import { RouteRecordRaw } from 'vue-router';
import { HOME_URL, LOGIN_URL } from '@/config';

/**
 * staticRouter (静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: HOME_URL
  },
  {
    path: LOGIN_URL,
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
    meta: {
      title: '登录'
    }
  }
];
