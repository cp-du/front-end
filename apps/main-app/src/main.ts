import { createApp, nextTick, createRenderer, h } from 'vue'
import App from './App.vue'
import { router, setupRouter } from './routers/index.ts';
import { setupStore } from './stores/index.ts';

import { setupMicroApps } from './micro-apps/index.ts';
import { installDynamicRoutes } from "./routers/dynamic.ts";
import type { MenuNode } from "@du/typings";

import "@du/pc-ui/dist/pc-ui.css";
import { install } from '@du/pc-ui'
import { store } from '@du/utils'
import { setupLocale } from "@/locale"
import { ElTooltip, ElButton } from 'element-plus';

import './style.scss'

// Node：所有节点类型，包含元素、文本、注释
// Element：元素及容器类型
const renderer = createRenderer<Node, Element>({
    // 创建元素
    createElement(tag) {
        return document.createElement(tag);
    },

    // 插入或移动节点
    insert(node, parent, anchor = null) {
        parent.insertBefore(node, anchor);
    },

    // 删除节点
    remove(node) {
        node.parentNode?.removeChild(node);
    },

    // 更新属性：此示例仅支持普通 HTML attribute
    patchProp(el, key, prevValue, nextValue) {
        if (nextValue == null) {
            el.removeAttribute(key);
        } else {
            el.setAttribute(key, String(nextValue));
        }
    },

    createText(text) {
        return document.createTextNode(text);
    },

    createComment(text) {
        return document.createComment(text);
    },

    setText(node, text) {
        node.nodeValue = text;
    },

    setElementText(el, text) {
        el.textContent = text;
    },

    parentNode(node) {
        return node.parentElement;
    },

    nextSibling(node) {
        return node.nextSibling;
    },
});



async function bootstrap() {
    const app = createApp(App);

    app.directive('title', {
        mounted(el: HTMLInputElement, binding) {
            // el.style.overflow = 'hidden';
            // el.style.textOverflow = 'ellipsis';
            // el.style.whiteSpace = 'nowrap';
            const elHtml = el.innerHTML;
            el.innerHTML = ""
            renderer.render(
                h(ElButton, { content: binding.value, trigger: 'hover' }, { default: () => elHtml }),
                el
            )
        }
    })
    install(app)
    const menus = store.getStorage<MenuNode[]>('menus') || []

    // 1. 先注册动态路由
    installDynamicRoutes(router, menus);

    // 2. 安装 Router 和 Pinia
    await setupStore(app);
    await setupRouter(app);
    await setupLocale(app);

    // 3. 挂载主应用
    app.mount("#app");

    // 4. 等待初始路由和异步路由组件加载完成
    await router.isReady();
    await nextTick();

    // 5. 此时 #sub-container 已经存在，再启动 qiankun
    setupMicroApps(menus);
}

void bootstrap();
