import type { Router } from "vue-router";
import type { MenuNode } from "@du/typings";
import { microAppRegistry } from "@/micro-apps/registry";

const registeredRoutes = new Set<string>();

export function installDynamicRoutes(
    router: Router,
    menus: MenuNode[],
) {
    const appCodes = new Set<string>();

    function collect(items: MenuNode[]) {
        for (const item of items) {
            if (item.visible && item.appCode) {
                appCodes.add(item.appCode);
            }

            if (item.children?.length) {
                collect(item.children);
            }
        }
    }

    collect(menus);

    for (const appCode of appCodes) {
        const config = microAppRegistry[appCode];
        const routeName = `micro-app:${appCode}`;

        if (!config || registeredRoutes.has(routeName)) continue;

        router.addRoute("root", {
            path: `${config.basePath}/:pathMatch(.*)*`,
            name: routeName,
            component: () => import("@/views/micro-app/index.vue"),
            meta: {
                appCode,
                requiresAuth: true,
            },
        });

        registeredRoutes.add(routeName);
    }

    console.log(router.getRoutes())
}
