<template>
    <el-config-provider :locale="locale === 'zh' ? zh : en" :size="props.size">
        <slot></slot>
    </el-config-provider>
</template>

<script setup lang="ts">
import { provide, computed, watch, toValue } from "vue";
import { ElConfigProvider } from 'element-plus'
import { store } from '@du/utils'
import zh from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import type { DuProviderProps } from './index';


defineOptions({
    name: "DuProvider"
});

const props = withDefaults(defineProps<DuProviderProps>(), {
    locale: (store.getStorage<'zh' | 'en'>('lang') || "zh") as DuProviderProps['locale'],
    theme: (store.getStorage<'light' | 'dark'>('theme') || "light") as DuProviderProps['theme'],
    size: (store.getStorage<'large' | 'default' | 'small'>('size') || "default") as DuProviderProps['size'],
});

watch(() => props.size, (newVal) => {
    console.log('vide size changed:', newVal)
})


const locale = computed(() => props.locale);
provide<DuProviderProps>("du-global-config", props);
</script>
