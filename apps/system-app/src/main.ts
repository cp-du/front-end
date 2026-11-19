import { createApp } from "vue";
import App from "./App.vue";
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

import { router, setupRouter } from "./routers/index.js";
import { setupStore, useGlobalStore } from "./stores/index.js";

import { install } from "@du/pc-ui";

import { setupLocale } from "./locale/index.js";

import "@du/pc-ui/dist/pc-ui.css";


let app: ReturnType<typeof createApp> | null = null;

const bootstrap = async (props: any) => {
  app = createApp(App);
  install(app);

  // 2. 安装 Router 、Pinia、i18n
  await setupLocale(app)
  await setupRouter(app)
  await setupStore(app)


  props.actions?.onGlobalStateChange((state: any) => {
    console.log('system app onGlobalStateChange', state);
    const globalStore = useGlobalStore();
    if (state.locale && globalStore.locale !== state.locale) {
      globalStore.setLocale(state.locale);
    }
    if (state.theme && globalStore.theme !== state.theme) {
      globalStore.setTheme(state.theme);
    }
    if (state.size && globalStore.size !== state.size) {
      globalStore.setSize(state.size);
    }
    if (state.fontFamily && globalStore.fontFamily !== state.fontFamily) {
      globalStore.setFontFamily(state.fontFamily);
    }
  }, true)

  app.mount(props.container?.querySelector('#app') || '#app');

  // 接收主应用传入 initRoute，自动跳转子应用内路由（适配你首页卡片需求）
  if (props.initRoute) {
    router.push(props.initRoute);
  }
}

// qiankun生命周期
renderWithQiankun({
  mount(props) {
    console.log('system app mount', props);

    bootstrap(props);
  },
  bootstrap() {
    console.log('system app bootstrap');
  },
  unmount() {
    console.log('system app unmount');
    app?.unmount();
    app = null;
  },
  update(props) {
    console.log('system app update', props);
  }
})

// 独立运行时直接渲染
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  bootstrap({});
}

