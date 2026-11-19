import { createApp } from "vue";
import App from "./App.vue";
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

import { router, setupRouter } from "./routers/index.js";

import { install } from "@du/pc-ui";

import { setupLocale } from "./locale/index.js";

import "@du/pc-ui/dist/pc-ui.css";


let app: ReturnType<typeof createApp> | null = null;

const render = async (props: any) => {
  app = createApp(App);
  install(app);

  // 2. 安装 Router 和 Pinia
  await setupLocale(app)
  await setupRouter(app)

  app.mount(props.container?.querySelector('#app') || '#app');

  // 接收主应用传入 initRoute，自动跳转子应用内路由（适配你首页卡片需求）
  if (props.initRoute) {
    router.push(props.initRoute);
  }
}

// qiankun生命周期
renderWithQiankun({
  mount(props) {
    console.log('sub-app1 mount', props);
    render(props);
  },
  bootstrap() {
    console.log('sub-app1 bootstrap');
  },
  unmount() {
    console.log('sub-app1 unmount');
    app?.unmount();
    app = null;
  },
  update(props) {
    console.log('sub-app1 update', props);
  }
})

// 独立运行时直接渲染
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}

