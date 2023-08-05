import { defineStore } from 'pinia';
import { UserState } from '@/stores/interface';
import piniaPersistConfig from '@/utils/piniaPersist';

export const useUserStore = defineStore({
  id: 'budou-user',
  state: (): UserState => ({
    token: '',
    userInfo: { name: '您好，超管', uid: '' }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState['userInfo']) {
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig('budou-user')
});
