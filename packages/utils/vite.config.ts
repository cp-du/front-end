import { defineConfig } from 'vite'
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
        dts({
            // 输出ts类型声明
            tsconfigPath: resolve(__dirname, './tsconfig.json'),
            outDirs: resolve(__dirname, './dist/types'),
            insertTypesEntry: true
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: 'utils',
            formats: ['es', 'cjs'],
            fileName: (format) => `utils.${format}.js`
        },
        rollupOptions: {
            // 外部化，不要把vue打包进组件库，交给业务应用提供
            external: ['vue', "element-plus", "axios", "es-toolkit", "crypto-js"],
            output: {
                exports: 'named',
                globals: {
                    vue: 'Vue',
                    "element-plus": "ElementPlus",
                    "axios": "Axios",
                    "es-toolkit": "EsToolkit",
                    "crypto-js": "CryptoJS"
                }
            }
        }
    }
})
