import { RootLayout } from "@du/pc-ui"
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
    name: 'root',
    redirect: "/cyxxgl",
    component: RootLayout,
    children: [
      {
        path: "/cyxxgl",
        name: "cyxxgl",
        component: () => import("@/pages/cyxxgl/index.vue"),
        meta: {
          name: '船员信息管理'
        }
      },

    ]
  },

];
