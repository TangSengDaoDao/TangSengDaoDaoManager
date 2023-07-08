import type { RouteRecordRaw } from 'vue-router';
import { setupLayouts } from 'virtual:meta-layouts';
import generatedRoutes from 'virtual:generated-pages';
import { staticRouter } from '@/router/staticRouter';

const routes: RouteRecordRaw[] = setupLayouts(
  generatedRoutes.filter(item => {
    return item.meta?.enabled !== false && item.meta?.constant !== true && item.meta?.layout !== false;
  })
);

export default [...staticRouter, ...routes];
