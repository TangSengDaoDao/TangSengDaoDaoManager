import { createApp } from 'vue';
import App from '@/App.vue';
import ElementPlus from 'element-plus';
import VueGridLayout from 'vue-grid-layout';
// icon-park
import { install } from '@icon-park/vue-next/es/all';
// element icons
import * as Icons from '@element-plus/icons-vue';
// custom directives
import directives from '@/directives';
// vue Router
import router from '@/router';
// pinia store
import pinia from '@/stores';
// vue i18n
import I18n from '@/i18n';
import 'vue-global-api';
// 额外引入图标库
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import '@icon-park/vue-next/styles/index.css';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import '@/styles/index.scss';
import 'uno.css';

import '@/utils/system-copyright';

const app = createApp(App);
install(app, 'i-bd');
// register the element Icons component
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons]);
});
app.use(ElementPlus);
app.use(VueGridLayout);
app.use(directives);
app.use(router);
app.use(I18n);
app.use(pinia);
app.mount('#app');
