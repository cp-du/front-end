<template>
    <el-sub-menu v-if="visibleChildren.length" :index="menu.path">
        <template #title>
            <div class="root-nav-item-level-1" v-if="props.level === 1">
                <du-icon-select :modelValue="menu.icon || '&#xe670;'" readonly size="16px" />
                <span>{{ menu.name }}</span>
            </div>
            <div v-else class="root-nav-item">
                <el-icon>
                    <component :is="menuIcon" />
                </el-icon>
                <div>{{ menu.name }}</div>
            </div>

        </template>

        <root-menu-item v-for="child in visibleChildren" :key="child.id" :menu="child" :level="props.level + 1" />
    </el-sub-menu>

    <el-menu-item v-else :index="menu.path">

        <div class="root-nav-item">

            <du-icon-select :modelValue="menu.icon || '&#xe670;'" readonly size="16px" />

            <div>{{ menu.name }}</div>
        </div>
    </el-menu-item>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ElIcon, ElMenuItem, ElSubMenu } from "element-plus";
import {
    Collection,
    Document,
    Menu as MenuIcon,
    Setting,
    User,
} from "@element-plus/icons-vue";
import type { MenuNode } from "@du/typings";

defineOptions({
    name: "RootMenuItem",
});

const props = defineProps<{
    menu: MenuNode;
    level: number;
}>();

const iconMap = {
    users: User,
    contact: User,
    settings: Setting,
    "book-open": Collection,
    menu: MenuIcon,
} as const;

const visibleChildren = computed(() =>
    (props.menu.children ?? [])
        .filter((child) => child.visible)
        .sort((left, right) => left.sortOrder - right.sortOrder),
);

const menuIcon = computed(() => {
    if (!props.menu.icon) return Document;
    return iconMap[props.menu.icon as keyof typeof iconMap] ?? Document;
});
</script>

<style scoped lang="scss">
.root-nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.root-nav-item-level-1 {
    width: 100%;
    display: flex;
    flex-direction: column;
    line-height: normal;
    align-items: center;
    gap: 4px;
}
</style>