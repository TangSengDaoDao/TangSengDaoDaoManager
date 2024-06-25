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
