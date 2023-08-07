import request from '@/utils/axios';

// APP列表
export function commonAppversionListGet(params: any) {
  return request({
    url: '/common/appversion/list',
    method: 'get',
    params
  });
}

// 新增App版本
export function commonAppversionPost(data: any) {
  return request({
    url: '/common/appversion',
    method: 'post',
    data
  });
}

// 系统机器人菜单列表
export function robotMenusGet(params: any) {
  return request({
    url: '/manager/robot/menus',
    method: 'get',
    params
  });
}
