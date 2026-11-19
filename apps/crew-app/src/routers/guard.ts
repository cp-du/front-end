

import type { Router } from "vue-router";

import { getUserInfo, getAccessToken } from '@du/utils';
const WHITE_LIST = ['/login', '/not-found', '/not-permission'];

export function createRouterGuard(router: Router) {
    router.beforeEach((to, from) => {
        // 在这里添加路由守卫逻辑
        const accessToken = getAccessToken();
        const userInfo = getUserInfo();
        if (!accessToken || !userInfo) {
            if (WHITE_LIST.includes(to.path)) return true;

            return {
                path: '/login',
                query: {
                    redirect: to.fullPath,
                },
            };
        }



        const routes = router.getRoutes();
        if (routes.find(route => route.name === to.name)) {
            return true
        };

        return { name: 'not-found', query: { path: to.fullPath } };
    });
}