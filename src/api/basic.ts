import request from '@/utils/axios';

// 登录
export function loginPost(data: any) {
  return request({
    url: '/manager/login',
    method: 'post',
    data
  });
}
