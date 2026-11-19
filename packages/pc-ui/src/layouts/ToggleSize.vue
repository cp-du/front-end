<template>

    <el-dropdown>
        <du-button text>
            <span style="font-size: 14px;" class="iconfont-base">&#xeb17;</span>
        </du-button>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="toggleSize('large')">大</el-dropdown-item>
                <el-dropdown-item @click="toggleSize('default')">中</el-dropdown-item>
                <el-dropdown-item @click="toggleSize('small')">小</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script setup lang="ts">
import DuButton from '../components/base/du-button';
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';
import { inject, onMounted } from 'vue'
import { store } from '@du/utils'
import type { DuProviderProps } from '../components/layout/du-provider'

defineOptions({ name: 'ToggleSize' })


const toggleSize = (size: 'large' | 'default' | 'small') => {
    globalConfig?.setSize(size)
}

const globalConfig = inject<DuProviderProps>('du-global-config')

onMounted(() => {
    const size = store.getStorage('size') as 'large' | 'default' | 'small'
    if (size) {
        toggleSize(size)
    }
})
</script>
