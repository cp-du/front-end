<template>
    <div class="layout-root">
        <header v-if="standalone">
            <layout-header />
        </header>
        <main :style="{ padding: standalone ? '12px' : '0' }">
            <div>

                <router-view v-slot="{ Component }">
                    <keep-alive include="Mtsq">
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </div>
        </main>
    </div>
</template>
<script setup lang="ts">
import { useGlobalConfig } from '@/hooks/useGlobalConfig';
import LayoutHeader from './LayoutHeader.vue'
defineOptions({ name: 'RootLayout' })

const { standalone } = useGlobalConfig({});

</script>
<style scoped lang="scss">
.layout-root {
    height: 100%;
    display: flex;
    flex-direction: column;

    &>header {
        flex: 0 0 auto;
    }

    &>main {
        flex: 1;
        min-height: 0;
        background-color: var(--el-bg-color-page);

        &>div {
            height: 100%;
            border-radius: 12px;
            background-color: var(--el-bg-color);
            overflow-y: auto;
        }
    }
}
</style>