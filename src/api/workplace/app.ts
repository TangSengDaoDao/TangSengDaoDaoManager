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
export function appPut(data: any, app_id: string) {
  return request({
    url: `/manager/workplace/apps/${app_id}`,
    method: 'put',
    data
  });
}

// 删除应用
export function appDelete(app_id: string) {
  return request({
    url: `/manager/workplace/apps/${app_id}`,
    method: 'delete'
  });
}
