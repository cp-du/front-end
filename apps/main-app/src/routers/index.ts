/**********************************
 * @Author: cpdu
 * @LastEditor: cpdu
 * @LastEditTime: 2025/09/18
 **********************************/
import type { App } from "vue";
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { basicRoutes } from "./basic";
import { createRouterGuard } from "./guard";
export const router = createRouter({
    history: import.meta.env.VITE_USE_HASH === 'true' ? createWebHashHistory() : createWebHistory(import.meta.env.VITE_PUBLIC_PATH || '/'),
    routes: basicRoutes
});

export async function setupRouter(app: App<Element>) {
    app.use(router);
    createRouterGuard(router);
}
