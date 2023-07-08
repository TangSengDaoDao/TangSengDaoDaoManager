import request from '@/utils/axios';

// 举报列表
export function reportListGet(params: any) {
  return request({
    url: '/manager/report/list',
    method: 'get',
    params
  });
}
