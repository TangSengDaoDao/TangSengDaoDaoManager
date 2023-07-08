const home: Menu.MenuOptions = {
  component: '/report/user',
  name: 'report',
  path: '/report',
  meta: {
    icon: 'i-bd-report',
    isAffix: false,
    isFull: false,
    isHide: false,
    isKeepAlive: true,
    isLink: '',
    index: 6,
    title: '举报'
  },
  children: [
    {
      component: '/report/user',
      name: 'reportUser',
      path: '/report/user',
      meta: {
        icon: 'i-bd-wrong-user',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '举报用户'
      }
    },
    {
      component: '/report/group',
      name: 'reportGroup',
      path: '/report/group',
      meta: {
        icon: 'i-bd-user-to-user-transmission',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '举报群聊'
      }
    }
  ]
};
export default home;
