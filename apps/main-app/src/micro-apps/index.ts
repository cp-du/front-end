import { registerMicroApps, start, initGlobalState, type MicroAppStateActions } from "qiankun";
import { microAppRegistry } from "./registry";
import type { MenuNode } from "@du/typings";
import { useGlobalStore } from "../stores";

let qiankunStarted = false;
const registeredApps = new Set<string>();

function collectAppCodes(menus: MenuNode[]) {
    const appCodes = new Set<string>();

    const walk = (items: MenuNode[]) => {
        for (const item of items) {
            if (item.visible && item.appCode) {
                appCodes.add(item.appCode);
            }

            if (item.children?.length) {
                walk(item.children);
            }
        }
    };

    walk(menus);

    return appCodes;
}

// 初始化全局状态
// type GlobalState = {
//     locale: 'zh' | 'en';
//     theme: 'light' | 'dark';
// };

export let globalState: MicroAppStateActions;

export function setupMicroApps(menus: MenuNode[]) {
    const appCodes = collectAppCodes(menus);

    const apps = [...appCodes].flatMap((appCode) => {
        const config = microAppRegistry[appCode];

        if (!config || registeredApps.has(config.name)) {
            return [];
        }

        registeredApps.add(config.name);

        const globalStore = useGlobalStore();
        globalState = initGlobalState({
            size: globalStore.size,
            locale: globalStore.locale,
            theme: globalStore.theme
        });

        return [
            {
                name: config.name,
                entry: config.entry,
                container: "#sub-container",

                activeRule: (location: Location) =>
                    location.pathname === config.basePath ||
                    location.pathname.startsWith(`${config.basePath}/`),

                props: { actions: globalState },
            },
        ];
    });

    if (apps.length > 0) {
        registerMicroApps(apps, {
            beforeLoad: [
                async (app) => {
                    console.log(`[qiankun] 开始加载 ${app.name}`);
                },
            ],
            beforeMount: [
                async (app) => {
                    console.log(`[qiankun] 开始挂载 ${app.name}`);
                },
            ],
            afterUnmount: [
                async (app) => {
                    console.log(`[qiankun] 已卸载 ${app.name}`);
                },
            ],
        });
    }

    // start 只能初始化一次
    if (!qiankunStarted) {
        start({
            sandbox: {
                strictStyleIsolation: false,
            },
            prefetch: false,
        });

        qiankunStarted = true;
    }
}