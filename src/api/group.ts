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

// 移除成员
export function groupGroupmembersDelete(data: any, groupNo: string) {
  return request({
    url: `/manager/groups/${groupNo}/members`,
    method: 'delete',
    data
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

// 禁言/解除禁言
export function groupForbiddenPut(params: any) {
  return request({
    url: `/manager/groups/${params.groupNo}/forbidden/${params.forbidden}`,
    method: 'put'
  });
}

// 封禁/解禁
export function groupLiftbanPut(params: any) {
  return request({
    url: `/manager/group/liftban/${params.groupNo}/${params.status}`,
    method: 'put'
  });
}
