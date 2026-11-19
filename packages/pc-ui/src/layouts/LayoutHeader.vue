<template>
    <div class="layout-header">
        <div class="left-panel">
            <div class="logo"></div>
            <div class="app-title">{{ name }}</div>
        </div>
        <nav>
            <layout-menu />
        </nav>

        <div class="right-panel">
            <toggle-theme />
            <toggle-language />
            <toggle-size />
        </div>
    </div>

</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useGlobalConfig } from '@du/utils';


import LayoutMenu from './LayoutMenu.vue';
import ToggleTheme from './ToggleTheme.vue';
import ToggleLanguage from './ToggleLanguage.vue';
import ToggleSize from './ToggleSize.vue';

defineOptions({ name: 'LayoutHeader' })

const { appName } = useGlobalConfig("");

const name = computed(() => appName);


</script>
<style scoped lang="scss">
.layout-header {
    padding: 0 16px;
    display: flex;
    align-items: center;
    height: 56px;
    gap: 24px;
    background-color: var(--el-bg-color);



    .left-panel,
    .right-panel {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .right-panel {
        gap: 0;
    }

    .left-panel {
        .app-title {
            font-size: 16px;
            font-weight: 900;
            color: var(--el-text-color-primary);
        }
    }

    nav {
        flex: 1;
        min-width: 0;
    }


}
</style>