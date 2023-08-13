const home: Menu.MenuOptions = {
  component: '/setting/currencysetting',
  name: 'setting',
  path: '/setting',
  meta: {
    icon: 'i-bd-setting',
    isAffix: false,
    isFull: false,
    isHide: false,
    isKeepAlive: true,
    isLink: '',
    index: 9,
    title: '设置'
  },
  children: [
    {
      component: '/setting/currencysetting',
      name: 'settingCurrencysetting',
      path: '/setting/currencysetting',
      meta: {
        icon: 'i-bd-setting-config',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '通用设置'
      }
    },
    {
      component: '/setting/updatepwd',
      name: 'settingUpdatepwd',
      path: '/setting/updatepwd',
      meta: {
        icon: 'i-bd-shield',
        isAffix: false,
        isFull: false,
        isHide: false,
        isKeepAlive: true,
        isLink: '',
        title: '修改登录密码'
      }
    }
  ]
};
export default home;
