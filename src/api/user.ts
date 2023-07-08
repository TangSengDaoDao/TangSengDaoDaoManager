import request from '@/utils/axios';

// 用户列表
export function userListGet(params: any) {
  return request({
    url: '/manager/user/list',
    method: 'get',
    params
  });
}

// 封禁用户列表
export function userDisablelistGet(params: any) {
  return request({
    url: '/manager/user/disablelist',
    method: 'get',
    params
  });
}
