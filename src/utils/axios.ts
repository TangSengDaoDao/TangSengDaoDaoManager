import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { BU_DOU_CONFIG } from '@/config';
import { useUserStore } from '@/stores/modules/user';
import router from '@/router';
const userStore = useUserStore();

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BU_DOU_CONFIG.APP_URL, // BASE_MAIN_URL
  withCredentials: false // 跨域请求时是否需要使用凭证
});

// request 拦截器
axiosInstance.interceptors.request.use(
  config => {
    // 添加token
    if (userStore.token) {
      (config as any).headers['token'] = userStore.token;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// respone 拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return Promise.resolve(response.data);
  },
  (error: any) => {
    const code = error.response.status;
    if (code == 401) {
      userStore.setToken('');
      userStore.setUserInfo({ name: '您好，超管', uid: '' });
      router.replace('/login');
    }
    if (code == 400) {
      return Promise.reject(error.response.data);
    }
    // 响应失败
    return Promise.reject(error);
  }
);

export default axiosInstance;
