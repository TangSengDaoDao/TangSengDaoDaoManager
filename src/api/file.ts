import request from '@/utils/axios';

// 获取文件路径
export function feileGet(params?: any) {
  return request({
    url: '/file/upload',
    method: 'get',
    params
  });
}
