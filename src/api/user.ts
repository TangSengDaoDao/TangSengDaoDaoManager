import request from '@/utils/axios';

// 添加用户
export function userAddPost(data: any) {
  return request({
    url: '/manager/user/add',
    method: 'post',
    data
  });
}

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

// 好友列表
export function userFriendsGet(params: any) {
  return request({
    url: 'manager/user/friends',
    method: 'get',
    params
  });
}

// 黑名单列表
export function userBlacklistGet(params: any) {
  return request({
    url: 'manager/user/blacklist',
    method: 'get',
    params
  });
}

// 用户封禁/解禁
export function userLiftbanPut(params: any) {
  return request({
    url: `manager/user/liftban/${params.uid}/${params.status}`,
    method: 'put'
  });
}
