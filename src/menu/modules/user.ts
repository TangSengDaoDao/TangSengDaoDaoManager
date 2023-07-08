const home: Menu.MenuOptions = {
  component: '/user/adduser',
  name: 'use',
  path: '/user',
  meta: {
    icon: 'i-bd-user',
    isAffix: false,
    isFull: false,
    isHide: false,
    isKeepAlive: true,
    isLink: '',
    index: 2,
    title: '用户'
  },
  children: [
    {
      component: '/user/adduser',
      name: 'userAdduser',
      path: '/user/adduser',
      meta: {
        icon: 'i-bd-add-user',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '新增用户'
      }
    },
    {
      component: '/user/userlist',
      name: 'userUserlist',
      path: '/user/userlist',
      meta: {
        icon: 'i-bd-every-user',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '用户列表'
      }
    },
    {
      component: '/user/disablelist',
      name: 'userDisablelist',
      path: '/user/disablelist',
      meta: {
        icon: 'i-bd-wrong-user',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '封禁用户列表'
      }
    }
  ]
};
export default home;
