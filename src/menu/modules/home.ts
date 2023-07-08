const home: Menu.MenuOptions = {
  component: '/home/index',
  name: 'homeIndex',
  path: '/home',
  meta: {
    icon: 'i-bd-home',
    isAffix: true,
    isFull: false,
    isHide: false,
    isKeepAlive: true,
    isLink: '',
    index: 1,
    title: '首页'
  },
  children: [
    {
      component: '/home/aa',
      name: 'HomeAa',
      path: '/home/aa',
      meta: {
        icon: 'HomeFilled',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: 'AA标题'
      }
    },
    {
      component: '/home/bb',
      name: 'HomeBb',
      path: '/home/bb',
      meta: {
        icon: 'i-bd-off-screen-one',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: 'BB标题'
      }
    }
  ]
};
export default home;
