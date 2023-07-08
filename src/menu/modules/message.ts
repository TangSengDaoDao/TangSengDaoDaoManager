const home: Menu.MenuOptions = {
  component: '/message/sendmsglist',
  name: 'message',
  path: '/message',
  meta: {
    icon: 'i-bd-message',
    isAffix: false,
    isFull: false,
    isHide: false,
    isKeepAlive: true,
    isLink: '',
    index: 4,
    title: '消息'
  },
  children: [
    {
      component: '/message/sendmsglist',
      name: 'messageSendmsglist',
      path: '/message/sendmsglist',
      meta: {
        icon: 'i-bd-communication',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '消息记录'
      }
    },
    {
      component: '/message/prohibitwords',
      name: 'messageProhibitwords',
      path: '/message/prohibitwords',
      meta: {
        icon: 'i-bd-message-security',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '违禁词列表'
      }
    }
  ]
};
export default home;
