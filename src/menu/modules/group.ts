const home: Menu.MenuOptions = {
  component: '/group/adduser',
  name: 'group',
  path: '/group',
  meta: {
    icon: 'i-bd-peoples-two',
    isAffix: false,
    isFull: false,
    isHide: false,
    isKeepAlive: true,
    isLink: '',
    index: 3,
    title: '群组'
  },
  children: [
    {
      component: '/group/grouplist',
      name: 'groupGrouplist',
      path: '/group/grouplist',
      meta: {
        icon: 'i-bd-group',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '群列表'
      }
    },
    {
      component: '/group/groupdisablelist',
      name: 'groupGroupdisablelist',
      path: '/group/groupdisablelist',
      meta: {
        icon: 'i-bd-ungroup',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '封禁群列表'
      }
    }
  ]
};
export default home;
