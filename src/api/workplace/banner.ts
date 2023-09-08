import request from '@/utils/axios';

// 获取轮播
export function bannerGet(params?: any) {
  return request({
    url: '/manager/workplace/banner',
    method: 'get',
    params
  });
}

// 新增轮播
export function bannerPost(data: any) {
  return request({
    url: '/manager/workplace/banner',
    method: 'post',
    data
  });
}

// 编辑轮播
export function bannerPut(data: any) {
  return request({
    url: '/manager/workplace/banner',
    method: 'post',
    data
  });
}

// 删除轮播
export function bannerDelete(params: any) {
  return request({
    url: '/manager/workplace/banner',
    method: 'delete',
    params
  });
}
