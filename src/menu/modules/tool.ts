const home: Menu.MenuOptions = {
  component: '/tool/appupdate',
  name: 'tool',
  path: '/tool',
  meta: {
    icon: 'i-bd-tool',
    isAffix: false,
    isFull: false,
    isHide: false,
    isKeepAlive: true,
    isLink: '',
    index: 8,
    title: '工具'
  },
  children: [
    {
      component: '/tool/appupdate',
      name: 'toolAppupdate',
      path: '/tool/appupdate',
      meta: {
        icon: 'i-bd-application-one',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: 'APP升级'
      }
    },
    {
      component: '/tool/command',
      name: 'toolCommand',
      path: '/tool/command',
      meta: {
        icon: 'i-bd-command',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '口令管理'
      }
    },
    {
      component: '/tool/systemrobotmenu',
      name: 'toolSystemrobotmenu',
      path: '/tool/systemrobotmenu',
      meta: {
        icon: 'i-bd-application-two',
        isAffix: false,
        isFull: false,
        isHide: true,
        isKeepAlive: true,
        isLink: '',
        title: '系统机器人菜单列表'
      }
    }
  ]
};
export default home;
