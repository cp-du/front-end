<template>
    <el-menu :default-active="currentRouteName" size="large" mode="horizontal" @select="toggleRouter">
        <el-menu-item v-for="menu in menus" :key="menu.name" :index="getMenuIndex(menu)">{{ menu.meta?.name || menu.name
        }}</el-menu-item>
    </el-menu>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute, type RouteRecordRaw } from 'vue-router';
import { ElMenu, ElMenuItem } from 'element-plus';
defineOptions({ name: 'LayoutMenu' })

const router = useRouter();
const route = useRoute();

const currentRouteName = computed(() => route?.name as string);

const menus = computed<RouteRecordRaw[]>(() => {
    const routes = router.getRoutes()
    const rootRoute = routes.find(route => route.name === 'root'); // Replace 'app' with your actual root route name
    return (rootRoute?.children || []).filter(child => !child.meta?.hidden);
})


function toggleRouter(name: RouteRecordRaw['name']) {
    router.push({ name });
};

function getMenuIndex(menu: RouteRecordRaw) {
    return menu.name as string;
}

</script>
<style scoped lang="scss">
.layout-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 8px;

    .menu-item {
        padding: 8px 16px;
        color: var(--el-button-text-color);
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        line-height: 22px;

        &.active {
            background-color: var(--el-color-primary);
            color: #fff;
        }

        &:hover {
            background-color: var(--el-color-primary-light-3);
            color: #fff;

        }
    }
}
</style>