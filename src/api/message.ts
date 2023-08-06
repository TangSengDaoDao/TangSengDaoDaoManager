import request from '@/utils/axios';

// 消息记录
export function messageGet(params: any) {
  return request({
    url: '/manager/message',
    method: 'get',
    params
  });
}

// 发消息
export function messageSendPost(data: any) {
  return request({
    url: '/manager/message/send',
    method: 'post',
    data
  });
}

// 删除消息
export function messageDelete(data: any) {
  return request({
    url: '/manager/message',
    method: 'delete',
    data
  });
}

// 发全员消息
export function messageSendAllPost(data: any) {
  return request({
    url: '/manager/message/sendall',
    method: 'post',
    data
  });
}

// 违禁词列表
export function messageProhibitWordsGet(params: any) {
  return request({
    url: '/manager/message/prohibit_words',
    method: 'get',
    params
  });
}
// 新增违禁词
export function messageProhibitWordsPost(params: any) {
  return request({
    url: '/manager/message/prohibit_words',
    method: 'post',
    params
  });
}
// 删除违禁词
export function messageProhibitWordsDelete(params: any) {
  return request({
    url: '/manager/message/prohibit_words',
    method: 'delete',
    params
  });
}

// 单聊天消息
export function messageRecordpersonalGet(params: any) {
  return request({
    url: '/manager/message/recordpersonal',
    method: 'get',
    params
  });
}

// 群聊天消息
export function messageRecordGet(params: any) {
  return request({
    url: '/manager/message/record',
    method: 'get',
    params
  });
}
