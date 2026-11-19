<template>
  <router-view v-slot="{ Component }">
    <DuProvider appCode="system" appName="系统管理" :size="globalStore.size" :locale="globalStore.locale"
      :theme="globalStore.theme" :standalone="standalone" :set-size="globalStore.setSize"
      :set-locale="globalStore.setLocale" :set-theme="globalStore.setTheme">
      <component :is="Component" />
    </DuProvider>
  </router-view>

</template>
<script setup lang="ts">
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import { useGlobalStore } from "./stores";

const globalStore = useGlobalStore();

const standalone = !qiankunWindow.__POWERED_BY_QIANKUN__

</script>
