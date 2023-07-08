import request from '@/utils/axios';

// 群列表
export function groupListGet(params: any) {
  return request({
    url: '/manager/group/list',
    method: 'get',
    params
  });
}

// 封禁群列表
export function groupDisablelistGet(params: any) {
  return request({
    url: '/manager/group/disablelist',
    method: 'get',
    params
  });
}
