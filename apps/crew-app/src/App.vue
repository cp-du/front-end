<template>
  <router-view v-slot="{ Component }">
    <DuProvider :size="size" appCode="crew" :standalone="standalone" appName="船员管理">
      <component :is="Component" />
    </DuProvider>
  </router-view>

</template>
<script setup lang="ts">
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import type { ComponentSize } from 'element-plus';
import { ref } from 'vue'

const size = ref<ComponentSize>('default')

const standalone = !qiankunWindow.__POWERED_BY_QIANKUN__

</script>
