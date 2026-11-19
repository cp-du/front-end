<template>
    <div class="setting-page">
        <div class="left-panel">
            <div class="nav-menu-list">
                <div v-for="nav in navs" :key="nav.path" class="nav-menu-item" @click="$router.push(nav.path)"
                    :class="{ active: $route.path === nav.path }">
                    <span class="icon iconfont-base" v-html="nav.icon"></span>
                    <span>{{ nav.title }}</span>
                </div>
            </div>
        </div>
        <div class="main-panel">
            <div style="height: 100%;width: 60%;">
                <router-view />
            </div>
        </div>
        <div class="right-panel"></div>
        <main></main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'Settings' })

const navs = ref([
    { icon: '&#xec39;', title: '外观', path: '/settings/facade' },
    { icon: '&#xe7c9;', title: '账户管理', path: '/settings/user' }
])
</script>

<style scoped lang="scss">
.setting-page {
    height: 100%;
    display: flex;
    padding: 20px 0;

    .left-panel {
        flex: 21;
        min-width: 0;

        .nav-menu-list {
            height: 100%;
            overflow-y: auto;
            width: 248px;

            display: flex;
            flex-direction: column;
            gap: 8px;

            .nav-menu-item {
                padding: 12px 16px 12px 23px;
                display: flex;
                align-items: center;
                font-size: 14px;
                font-weight: 500;
                line-height: 14px;
                display: flex;
                gap: 20px;
                border-radius: 0 20px 20px 0;
                user-select: none;
                cursor: pointer;

                .icon {
                    font-size: 16px;
                }

                &:hover {
                    background-color: var(--el-fill-color-light);
                }

                &.active {
                    background-color: var(--el-color-primary-light-9);
                    color: var(--el-color-primary);
                }
            }
        }
    }

    .main-panel {
        flex: 58;
        min-width: 0;
        display: flex;
        justify-content: center;
    }

    .right-panel {
        flex: 21;
        min-width: 0;
    }
}
</style>