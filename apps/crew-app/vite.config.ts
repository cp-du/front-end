import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import qiankun from 'vite-plugin-qiankun'
export default defineConfig({
  plugins: [vue(), qiankun('crew-app', { useDevMode: true })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL(".", import.meta.url))
    }
  },
  server: {
    port: 5174,
    headers: {
      'Access-Control-Allow-Origin': '*' //开发跨域，qiankun必须
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true
      }
    }
  }
});
