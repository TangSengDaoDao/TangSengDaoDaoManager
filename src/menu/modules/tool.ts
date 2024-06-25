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
    }
  ]
};
export default home;
