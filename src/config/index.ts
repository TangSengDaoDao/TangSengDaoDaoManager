// 首页地址（默认）
export const HOME_URL = '/home';

// 登录页地址（默认）
export const LOGIN_URL = '/login';

// 默认主题颜色
export const DEFAULT_PRIMARY = '#E4633B';

// 路由白名单地址（必须是本地存在的路由 staticRouter.ts 中）
export const ROUTER_WHITE_LIST: string[] = ['/login'];

// 自定义应用根据运行环境获取配置
const modules: any = {};
const moduleFiles = import.meta.glob('./modules/*.ts', { import: 'default', eager: true });

Object.keys(moduleFiles).forEach(name => {
  const key = name.replace('./modules/', '').replace('.ts', '').trim();
  modules[key] = moduleFiles[name];
});

const TSDD_CONFIG = window.TSDD_CONFIG ? window.TSDD_CONFIG : {};
// 默认应用配置
export const BU_DOU_CONFIG = {
  APP_TITLE: '唐僧叨叨后台管理',
  APP_TITLE_SHORT: '唐',
  ...modules[process.env.APP_ENV as any],
  ...TSDD_CONFIG
  // APP_URL: '/api/v1/' // 正式环境地址 (通用打包镜像，用此相对地址)
};
