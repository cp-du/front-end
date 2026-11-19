export interface MicroAppConfig {
    name: string;
    entry: string;
    basePath: string;
}

export const microAppRegistry: Record<string, MicroAppConfig> = {
    "crew-app": {
        name: "crew-app",
        entry: import.meta.env.VITE_CREW_APP_ENTRY || "http://localhost:5174",
        basePath: "/crew",
    },
    "system-app": {
        name: "system-app",
        entry: import.meta.env.VITE_SYSTEM_APP_ENTRY || "http://localhost:5175",
        basePath: "/system",
    },
} as const;





// export function installDynamicRoutes(menus: MenuNode[]) {
//   const appCodes = [...new Set(menus.map(menu => menu.appCode))];

//   for (const appCode of appCodes) {
//     const config = microAppRegistry[appCode];
//     if (!config || router.hasRoute(`micro:${appCode}`)) continue;

//     router.addRoute("root", {
//       path: `${config.basePath}/:pathMatch(.*)*`,
//       name: `micro:${appCode}`,
//       component: () => import("@/views/micro-app/index.vue"),
//       meta: { appCode },
//     });
//   }
// }
