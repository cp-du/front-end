<template>
    <el-menu :default-active="route.path" :collapse="true" :router="true" class="root-menu">
        <root-menu-item v-for="menu in menus" :key="menu.id" :menu="menu" :level="1" />
    </el-menu>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ElMenu } from "element-plus";
import type { MenuNode } from "@du/typings";
import RootMenuItem from "./RootMenuItem.vue";
import { store } from '@du/utils'

defineOptions({
    name: "RootMenu",
});

const route = useRoute();

const menus = computed(() => {
    const menus = store.getStorage<MenuNode[]>('menus') || []
    return menus.sort((left, right) => left.sortOrder - right.sortOrder)
});
</script>

<style scoped lang="scss">
.root-menu {
    width: 100%;
    height: 100%;
}
</style>
