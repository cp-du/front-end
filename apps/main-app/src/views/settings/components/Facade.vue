<template>
    <div class="facade-page">
        <div class="header">
            外观
        </div>

        <div class="card">
            <div class="setting-row">
                <span class="label">主题</span>
                <du-switch v-model="theme" active-value="dark" active-text="深色" inactive-value="light"
                    inactive-text="浅色" @change="onThemeChange"></du-switch>
            </div>
            <div class="setting-row">
                <span class="label">大小</span>
                <el-select style="width: 200px;" v-model="size" placeholder="选择大小" @change="onSizeChange">
                    <el-option label="大" value="large"></el-option>
                    <el-option label="中" value="default"></el-option>
                    <el-option label="小" value="small"></el-option>
                </el-select>
            </div>
            <div class="setting-row">
                <span class="label">语言</span>
                <du-switch v-model="language" active-value="zh" active-text="中文" inactive-value="en" inactive-text="英文"
                    @change="onLanguageChange"></du-switch>
            </div>
            <div class="setting-row">
                <span class="label">字体</span>
                <el-select style="width: 200px;" v-model="font" placeholder="选择字体" @change="onFontChange">
                    <el-option label="Microsoft YaHei" value="Microsoft YaHei"></el-option>
                    <el-option label="DingTalk JinBuTi" value="DingTalk JinBuTi"></el-option>
                </el-select>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { store } from '@du/utils'
import { useGlobalStore } from '@/stores'

defineOptions({ name: 'Facade' })

const globalStore = useGlobalStore()

const theme = ref(store.getStorage('theme') || 'light')
const size = ref(store.getStorage('size') || 'default')
const language = ref(store.getStorage('lang') || 'zh')
const font = ref(store.getStorage('fontFamily') || 'Microsoft YaHei')

function onThemeChange(val: 'light' | 'dark') {
    globalStore.setTheme(val)
}

function onSizeChange(val: 'large' | 'default' | 'small') {
    globalStore.setSize(val)
}

function onLanguageChange(val: 'zh' | 'en') {
    globalStore.setLocale(val)
}

function onFontChange(val: 'Microsoft YaHei' | 'DingTalk JinBuTi') {
    document.documentElement.style.fontFamily = `${val}, system-ui, sans-serif`;
    store.setStorage('fontFamily', val)
}



</script>
<style scoped lang="scss">
.facade-page {
    height: 100%;
    overflow-y: auto;
    padding: 0 12px;
}

.header {
    margin: 21px 0 12px;
    padding: 8px 0px 4px;
    font-size: 15px;
    font-weight: 500;
}

.card {
    background-color: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: color-mix(in srgb, #000000ff 30%, transparent) 0 1px 2px 0, color-mix(in srgb, #000000ff 15%, transparent) 0 2px 6px 2px;
}

.setting-row {
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--el-border-color-lighter);
    border-top: 1px solid var(--el-border-color-lighter);

    &:first-child {
        border-top: none;
    }

    &:last-child {
        border-bottom: none;
    }

    .label {
        padding: 12px 0;
        font-size: 13px;
    }
}
</style>