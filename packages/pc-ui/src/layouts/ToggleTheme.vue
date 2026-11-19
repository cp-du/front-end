<template>
    <du-button text @click="ToggleTheme">
        <el-icon size="18">
            <component :is="isDark ? Moon : Sunny" />
        </el-icon>
    </du-button>
</template>
<script setup lang="ts">
import DuButton from '../components/base/du-button';
import { Sunny, Moon } from '@element-plus/icons-vue';
import { useDark } from '@vueuse/core'
import { inject } from 'vue'
import type { DuProviderProps } from '../components/layout/du-provider'

defineOptions({ name: 'ToggleTheme' })

const isDark = useDark()
const ToggleTheme = () => {
    globalConfig?.setTheme?.(!isDark.value ? 'dark' : 'light')
}

const globalConfig = inject<DuProviderProps>('du-global-config')
</script>
