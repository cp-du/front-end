<template>
    <div class="layout-root">
        <nav class="nav-bar">
            <root-nav />
        </nav>
        <main>
            <div class="main-wrap">
                <div class="container">
                    <router-view v-slot="{ Component }">
                        <component :is="Component" />
                    </router-view>
                </div>
            </div>
        </main>
    </div>
</template>
<script setup lang="ts">
import RootNav from './RootNav.vue'
defineOptions({ name: 'RootLayout' })
</script>
<style scoped lang="scss">
.layout-root {
    height: 100%;
    display: flex;
    flex-direction: row;
    background-color: var(--el-bg-color);

    &>nav {
        flex: 0 0 64px;
        background-color: var(--el-bg-color);
        overflow: hidden;
    }

    &>main {
        flex: 1 1 0;
        min-width: 0;
        padding: var(--space-3, 12px) 0;
        border-radius: var(--radius-lg) 0 0 var(--radius-lg);
        background-color: var(--el-bg-color);

        .main-wrap {
            height: 100%;
            border-radius: var(--radius-lg);
            background-color: var(--el-bg-color-page);
            padding: var(--space-3, 12px);

            .container {
                height: 100%;
                border-radius: var(--radius-lg);
                background-color: var(--el-bg-color);
                overflow-y: auto;
            }

        }
    }
}
</style>