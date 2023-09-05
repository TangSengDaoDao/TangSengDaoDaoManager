import request from '@/utils/axios';

// 获取轮播
export function bannerGet(params?: any) {
  return request({
    url: '/workplace/banner',
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
