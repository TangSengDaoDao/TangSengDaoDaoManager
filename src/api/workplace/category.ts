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

// 分类编辑
export function categoryPut(data: any, category_no: string) {
  return request({
    url: `/manager/workplace/categorys/${category_no}`,
    method: 'put',
    data
  });
}

// 删除分类
export function categoryDelete(category_no: string) {
  return request({
    url: `/manager/workplace/categorys/${category_no}`,
    method: 'delete'
  });
}

// 分类排序
export function categoryReorderPut(data: any) {
  return request({
    url: '/manager/workplace/category/reorder',
    method: 'put',
    data
  });
}

// 分类获取应用
export function categoryAppGet(category_no: string) {
  return request({
    url: `/manager/workplace/categorys/${category_no}/app`,
    method: 'get'
  });
}

// 分类新增应用
export function categoryAppPost(data: any, category_no: string) {
  return request({
    url: `/manager/workplace/categorys/${category_no}/app`,
    method: 'post',
    data
  });
}

// 分类删除应用
export function categoryAppDelete(category_no: string, app_id: string) {
  return request({
    url: `/manager/workplace/categorys/${category_no}/apps/${app_id}`,
    method: 'delete'
  });
}

// 分类应用排序
export function categorysAppsReorderPut(data: any, category_no: string) {
  return request({
    url: `/manager/workplace/categorys/${category_no}/app/reorder`,
    method: 'put',
    data
  });
}
