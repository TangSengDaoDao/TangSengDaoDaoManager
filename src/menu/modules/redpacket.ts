const home: Menu.MenuOptions = {
  component: '/redpacket/list',
  name: 'redpacket',
  path: '/redpacket',
  meta: {
    icon: 'i-bd-red-envelopes',
    isAffix: false,
    isFull: false,
    isHide: true,
    isKeepAlive: true,
    isLink: '',
    index: 5,
    title: '红包'
  },
  children: [
    {
      component: '/redpacket/list',
      name: 'redpacketList',
      path: '/redpacket/list',
      meta: {
        icon: 'i-bd-doc-search',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '红包记录'
      }
    }
  ]
};
export default home;
