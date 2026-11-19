import { RootLayout } from "@du/pc-ui"
import { Login, NotFound } from '@du/pc-ui'
import { Model, ModelView } from '@du/pc-ui'

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
    name: 'root',
    redirect: "/menus",
    component: RootLayout,
    children: [
      {
        path: "/menus",
        name: "menus",
        component: () => import("@/views/menus/index.vue"),
        meta: {
          name: '菜单管理'
        }
      },
      {
        path: "/model",
        name: "model",
        component: Model,
        meta: {
          name: '模型管理',
        }
      },
      {
        path: "/model/view",
        name: "model-view",
        component: ModelView,
        meta: {
          name: '模型详情',
          hidden: true
        }
      },
    ]
  },

];
