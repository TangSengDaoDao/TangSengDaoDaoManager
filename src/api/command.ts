import request from '@/utils/axios';

// 获取口令列表
export function commandGet(params?: any) {
  return request({
    url: '/manager/web3/laboratory',
    method: 'get',
    params
  });
}

// 新增口令
export function commandPost(data: any) {
  return request({
    url: '/manager/web3/laboratory',
    method: 'post',
    data
  });
}

// 编辑口令
export function commandPut(data: any, id: string) {
  return request({
    url: `/manager/web3/laboratory/${id}`,
    method: 'put',
    data
  });
}

// 删除口令
export function commandDelete(id: string) {
  return request({
    url: `/manager/web3/laboratory/${id}`,
    method: 'delete'
  });
}
