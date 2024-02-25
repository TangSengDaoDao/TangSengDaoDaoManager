const home: Menu.MenuOptions = {
  name: 'tool',
  path: '/workplace',
  meta: {
    icon: 'i-bd-all-application',
    isAffix: false,
    isFull: false,
    isHide: false,
    isKeepAlive: true,
    isLink: '',
    index: 7,
    title: '工作台'
  },
  children: [
    {
      name: 'workplaceManage',
      path: '/workplace/manage',
      meta: {
        icon: 'i-bd-application',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '应用管理'
      }
    },
    {
      name: 'workplaceConfiguration',
      path: '/workplace/configuration',
      meta: {
        icon: 'i-bd-setting-config',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '工作台设置'
      }
    }
  ]
};
export default home;
