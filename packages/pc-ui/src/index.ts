import type { App, Component, Plugin } from 'vue'
import ElementPlus from 'element-plus'
import VxeUITable from 'vxe-table'
import { VxeUI } from 'vxe-table'
import 'vxe-table/lib/style.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.scss'
import "@/styles/iconfont/colorfull/iconfont.js"

import { store } from '@du/utils'

// views
import Login from '@/views/login/index.vue'
import NotFound from '@/views/not-found/index.vue'
import Model from '@/views/model/index.vue'
import ModelView from '@/views/model/view.vue'
// layouts
import { LayoutHeader, LayoutMenu, RootLayout, ToggleTheme, ToggleLanguage, ToggleSize } from '@/layouts'
import {
    ControlWidget,
    DuButton,
    DuCheckbox,
    DuDatePicker,
    DuRichtext,
    DuEmpty,
    DuFormPro,
    DuInput,
    DuInputNumber,
    DuPage,
    DuProvider,
    DuRadio,
    DuSearchPro,
    DuSelect,
    DuSwitch,
    DuTablePro,
    DuTabPane,
    DuTabs,
    DuToolBar,
    DuTitle,
    DuDialog,
    DuIconSelect,
    DuViewer,
    DuUpload,
    DuEditor,
    DuEllipsis
        
} from '@/components'

export * from '@/const'
export * from '@/typings'

const components: Component[] = [
    Login,
    ControlWidget,
    DuButton,
    DuCheckbox,
    DuDatePicker,
    DuRichtext,
    DuEditor,
    DuEmpty,
    DuFormPro,
    DuInput,
    DuInputNumber,
    DuPage,
    DuProvider,
    DuRadio,
    DuSearchPro,
    DuSelect,
    DuSwitch,
    DuTablePro,
    DuTabPane,
    DuTabs,
    DuToolBar,
    DuTitle,
    // layouts
    LayoutHeader,
    LayoutMenu,
    RootLayout,
    ToggleTheme,
    ToggleSize,
    NotFound,
    ModelView,
    Model,
    ToggleLanguage,
    DuDialog,
    DuIconSelect,
    DuViewer,
    DuUpload,
    DuEllipsis
]

// 全局安装只注册运行时组件；模板补全需要同步声明组件类型。
declare module 'vue' {
    export interface GlobalComponents {
        Login: typeof Login
        ControlWidget: typeof ControlWidget
        DuButton: typeof DuButton
        DuCheckbox: typeof DuCheckbox
        DuDatePicker: typeof DuDatePicker
        DuRichtext: typeof DuRichtext
        DuEditor: typeof DuEditor
        DuEmpty: typeof DuEmpty
        DuFormPro: typeof DuFormPro
        DuInput: typeof DuInput
        DuInputNumber: typeof DuInputNumber
        DuPage: typeof DuPage
        DuProvider: typeof DuProvider
        DuRadio: typeof DuRadio
        DuSearchPro: typeof DuSearchPro
        DuSelect: typeof DuSelect
        DuSwitch: typeof DuSwitch
        DuTablePro: typeof DuTablePro
        DuTabPane: typeof DuTabPane
        DuTabs: typeof DuTabs
        DuToolBar: typeof DuToolBar
        DuTitle: typeof DuTitle
        LayoutHeader: typeof LayoutHeader
        LayoutMenu: typeof LayoutMenu
        RootLayout: typeof RootLayout
        ToggleTheme: typeof ToggleTheme
        ToggleSize: typeof ToggleSize
        NotFound: typeof NotFound
        ModelView: typeof ModelView
        Model: typeof Model
        ToggleLanguage: typeof ToggleLanguage
        DuDialog: typeof DuDialog
        DuIconSelect: typeof DuIconSelect
        DuViewer: typeof DuViewer
        DuUpload: typeof DuUpload
        DuEllipsis: typeof DuEllipsis
    }
}


// 全局安装
export function install(app: App) {

    const fontFamily = store.getStorage('fontFamily') || 'Microsoft YaHei'
    document.documentElement.style.fontFamily = `${fontFamily}, system-ui, sans-serif`;
    document.documentElement.style.setProperty('--vxe-ui-font-family', `${fontFamily}, system-ui, sans-serif`);
    store.setStorage('fontFamily', fontFamily)
    app.use(VxeUITable)
    app.use(ElementPlus)

    // 初始化执行一次当前的主题设置
    const theme = (store.getStorage<'light' | 'dark'>('theme') || "light") as 'light' | 'dark'
    VxeUI.setTheme(theme)
    components.forEach(component => {
        if (component.name) {
            app.component(component.name, component)
        }
    })
}

export * from '@/components'
export * from '@/locale'


export { LayoutHeader, LayoutMenu, RootLayout, ToggleTheme, ToggleLanguage, ToggleSize, Login, NotFound, Model, ModelView }

const PcUiPlugin: Plugin = { install }

export default PcUiPlugin
