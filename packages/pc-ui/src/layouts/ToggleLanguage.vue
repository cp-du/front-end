<template>
    <du-button text @click="ToggleLanguage">
        <span style="font-size: 14px;">{{ locale === 'zh' ? '中' : 'En' }}</span>
    </du-button>
</template>
<script setup lang="ts">
import { inject } from 'vue';
import { useI18n } from "vue-i18n";
import { store } from '@du/utils'
import DuButton from '../components/base/du-button';
import type { DuProviderProps } from '../components/layout/du-provider';
defineOptions({ name: 'ToggleLanguage' })

const { locale } = useI18n();

function ToggleLanguage() {
    const currentLang = store.getStorage<'zh' | 'en'>('lang') || "zh";
    const newLang = currentLang === "zh" ? "en" : "zh";
    store.setStorage('lang', newLang);
    globalConfig?.setLocale?.(newLang)
}

const globalConfig = inject<DuProviderProps>('du-global-config')


</script>
