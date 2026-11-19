import type { App } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { basicRoutes } from "./basic";
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import { createRouterGuard } from "./guard";
export const router = createRouter({
    history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? "/crew" : "/"),
    routes: basicRoutes
});

export async function setupRouter(app: App<Element>) {
    app.use(router);
    createRouterGuard(router);
}
