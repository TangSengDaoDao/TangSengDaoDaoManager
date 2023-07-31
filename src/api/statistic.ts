import request from '@/utils/axios';

// 统计
export function statisticsCountnumGet(params: any) {
  return request({
    url: '/statistics/countnum',
    method: 'get',
    params
  });
}

// 用户注册统计
export function statisticsRegisteruserGet(start: string, end: string) {
  return request({
    url: `/statistics/registeruser/${start}/${end}`,
    method: 'get'
  });
}

// 新建群统计
export function statisticsCreatedgroupGet(start: string, end: string) {
  return request({
    url: `/statistics/createdgroup/${start}/${end}`,
    method: 'get'
  });
}
