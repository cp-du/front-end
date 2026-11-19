import type { App } from "vue";
import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import { basicRoutes } from "./basic";
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import { createRouterGuard } from "./guard";
export const router = createRouter({
    history: qiankunWindow.__POWERED_BY_QIANKUN__
        ? createWebHistory('/system')
        : createWebHashHistory(import.meta.env.BASE_URL),
    routes: basicRoutes
});

export async function setupRouter(app: App<Element>) {
    app.use(router);
    createRouterGuard(router);
}
