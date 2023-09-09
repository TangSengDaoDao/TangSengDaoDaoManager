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
