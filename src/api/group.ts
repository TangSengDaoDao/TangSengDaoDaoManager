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

// 群成员
export function groupGroupmembersGet(params: any, groupNo: string) {
  return request({
    url: `/manager/groups/${groupNo}/members`,
    method: 'get',
    params
  });
}

// 黑名单列表
export function groupBlacklistGet(params: any, groupNo: string) {
  return request({
    url: `/manager/groups/${groupNo}/members/blacklist`,
    method: 'get',
    params
  });
}
