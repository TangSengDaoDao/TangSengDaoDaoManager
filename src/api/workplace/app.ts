import request from '@/utils/axios';

// 获取应用
export function appGet(params?: any) {
  return request({
    url: '/manager/workplace/app',
    method: 'get',
    params
  });
}

// 新增应用
export function appPost(data: any) {
  return request({
    url: '/manager/workplace/app',
    method: 'post',
    data
  });
}

// 编辑应用
export function appPut(data: any) {
  return request({
    url: '/manager/workplace/app',
    method: 'put',
    data
  });
}

// 删除应用
export function appDelete(params: any) {
  return request({
    url: '/manager/workplace/app',
    method: 'delete',
    params
  });
}