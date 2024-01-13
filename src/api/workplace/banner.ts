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
export function bannerPut(data: any, banner_no: string) {
  return request({
    url: `/manager/workplace/banners/${banner_no}`,
    method: 'put',
    data
  });
}

// 删除轮播
export function bannerDelete(banner_no: string) {
  return request({
    url: `/manager/workplace/banners/${banner_no}`,
    method: 'delete'
  });
}

// 轮播排序
export function bannerReorderPut(data: any) {
  return request({
    url: `/manager/workplace/banner/reorder`,
    method: 'put',
    data
  });
}
