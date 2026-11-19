import { Login, NotFound } from '@du/pc-ui'
export const basicRoutes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/not-found",
    name: "not-found",
    component: NotFound,
  },
  {
    path: "/",
    name: "root",
    component: () => import("@/layouts/RootLayout.vue"),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        meta: { title: "主页" },
        component: () => import("@/views/home/index.vue"),
      },
      {
        path: "/settings",
        name: "settings",
        meta: { title: "设置" },
        component: () => import("@/views/settings/index.vue"),
        redirect: "/settings/facade",
        children: [
          {
            path: "/settings/facade",
            name: "facade",
            meta: { title: "外观" },
            component: () => import("@/views/settings/components/Facade.vue"),
          },
          {
            path: "/settings/user",
            name: "user",
            meta: { title: "用户" },
            component: () => import("@/views/settings/components/User.vue"),
          }
        ]
      },
    ],
  },
];
