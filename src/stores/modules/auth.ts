import { defineStore } from 'pinia';
import { AuthState } from '@/stores/interface';
import menu from '@/menu';
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from '@/utils';

import { useUserStore } from './user';

/**
 * 菜单权限处理
 * @param menuList
 */
function getAuthMenu(menuList: Menu.MenuOptions[]) {
  const newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  const userStore = useUserStore();
  const role = userStore.userInfo?.role;

  return newMenuList.filter(item => {
    item.children?.length && (item.children = getAuthMenu(item.children));
    if (item.meta?.auth && role) {
      return item.meta?.auth.indexOf(role) !== -1;
    }
    return item;
  });
}

export const useAuthStore = defineStore({
  id: 'budou-auth',
  state: (): AuthState => ({
    // 按钮权限列表
    authButtonList: {},
    // 菜单权限列表
    authMenuList: [],
    // 当前页面的 router name，用来做按钮权限筛选
    routeName: ''
  }),
  getters: {
    // 按钮权限列表
    authButtonListGet: state => state.authButtonList,
    // 菜单权限列表 ==> 这里的菜单没有经过任何处理
    authMenuListGet: state => state.authMenuList,
    // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
    showMenuListGet: state => getShowMenuList(state.authMenuList),
    // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
    flatMenuListGet: state => getFlatMenuList(state.authMenuList),
    // 递归处理后的所有面包屑导航列表
    breadcrumbListGet: state => getAllBreadcrumbList(state.authMenuList)
  },
  actions: {
    // Get AuthButtonList
    async getAuthButtonList() {
      this.authButtonList = {};
    },
    // Get AuthMenuList
    async getAuthMenuList() {
      this.authMenuList = getAuthMenu(menu);
    },

    // Set RouteName
    async setRouteName(name: string) {
      this.routeName = name;
    }
  }
});
