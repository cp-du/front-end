import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
export default defineConfig({
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "~": fileURLToPath(new URL(".", import.meta.url))
        }
    },
    plugins: [
        vue(),
        dts({
            // 输出ts类型声明
            processor: 'vue',
            tsconfigPath: resolve(__dirname, './tsconfig.json'),
            outDirs: resolve(__dirname, './dist/types'),
            insertTypesEntry: true,
            // 保留 .vue，避免 index.vue 与 index.ts 的声明文件同名覆盖。
            cleanVueFileName: false
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: 'pc-ui',
            formats: ['es', 'cjs'],
            fileName: (format) => `pc-ui.${format}.js`
        },
        rollupOptions: {
            // 外部化，不要把vue打包进组件库，交给业务应用提供
            external: ['vue', "vue-router", "vue-i18n", "v-viewer", "vue-draggable-plus", "element-plus", "@element-plus/icons-vue", "@vueuse/core", "@wangeditor/editor", "@wangeditor/editor-for-vue", "es-toolkit", "vxe-pc-ui", "vxe-table", "@vue-office/docx/lib/v3", "@vue-office/excel/lib/v3", "@vue-office/pdf/lib/v3", "@vue-office/pptx/lib/v3", "vue-demi"],
            output: {
                exports: 'named',
                globals: {
                    vue: 'Vue',
                    "vue-router": "VueRouter",
                    "element-plus": "ElementPlus",
                    "@element-plus/icons-vue": "ElementPlusIconsVue",
                    "@vueuse/core": "VueUse",
                    "@wangeditor/editor": "WangEditor",
                    "@wangeditor/editor-for-vue": "WangEditorForVue",
                    "es-toolkit": "EsToolkit",
                    "vxe-pc-ui": "VxePcUi",
                    "vxe-table": "VxeTable",
                    "vue-i18n": "VueI18n",
                    "vue-draggable-plus": "VueDraggablePlus",
                    "@vue-office/docx/lib/v3": "VueOfficeDocx",
                    "@vue-office/excel/lib/v3": "VueOfficeExcel",
                    "@vue-office/pdf/lib/v3": "VueOfficePdf",
                    "@vue-office/pptx/lib/v3": "VueOfficePptx",
                    "v-viewer": "Viewer",
                    "vue-demi": "VueDemi"
                }
            }
        }
    }
})
