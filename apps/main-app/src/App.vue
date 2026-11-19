<template>
  <router-view v-slot="{ Component }">
    <DuProvider appCode="system" appName="系统管理" :size="globalStore.size" :locale="globalStore.locale"
      :theme="globalStore.theme" :standalone="true" :set-size="globalStore.setSize" :set-locale="globalStore.setLocale"
      :set-theme="globalStore.setTheme">
      <component :is="Component" />
    </DuProvider>
  </router-view>
</template>


<script setup lang="ts">
import { useGlobalStore } from './stores'
const globalStore = useGlobalStore();
</script>
