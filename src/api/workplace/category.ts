import request from '@/utils/axios';

// 获取分类
export function categoryGet(params?: any) {
  return request({
    url: '/manager/workplace/category',
    method: 'get',
    params
  });
}

// 新增分类
export function categoryPost(data: any) {
  return request({
    url: '/manager/workplace/category',
    method: 'post',
    data
  });
}

// 分类获取应用
export function categoryAppGet(params: any) {
  return request({
    url: '/manager/workplace/category/app',
    method: 'get',
    params
  });
}

// 分类新增应用
export function categoryAppPost(data: any) {
  return request({
    url: '/manager/workplace/category/app',
    method: 'post',
    data
  });
}
