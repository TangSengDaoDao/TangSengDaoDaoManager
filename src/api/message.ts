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
