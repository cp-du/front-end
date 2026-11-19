<template>
    <div v-if="!props.readonly" class="icon-select" @click="openDialog">
        <template v-if="value">
            <span v-if="getIconType(value) === 'base'" :style="`font-size: ${props.size};user-select: none;`"
                class="iconfont-base" v-html="value ? value : '&#xe730;'"></span>
            <svg v-else-if="getIconType(value) === 'colorfull'" :style="`font-size: ${props.size};`" class="icon"
                aria-hidden="true">
                <use :xlink:href="value"></use>
            </svg>
        </template>
        <span v-else :style="`font-size: ${props.size};`" class="iconfont-base"
            v-html="value ? value : '&#xe730;'"></span>
    </div>
    <template v-else>

        <span v-if="getIconType(value) === 'base'" :style="`font-size: ${props.size};user-select: none;`"
            class="iconfont-base" v-html="value ? value : '&#xe730;'"></span>
        <svg v-else-if="getIconType(value) === 'colorfull'" :style="`font-size: ${props.size};`" class="icon"
            aria-hidden="true">
            <use :xlink:href="value ? value : '#icon-default'"></use>
        </svg>
    </template>


    <du-dialog v-model="visible" title="选择图标" width="1000px" @confirm="onConfirm">
        <div style="height: 100%;display: flex;flex-direction: column;overflow-y: auto;">
            <div class="pedding-select">
                <div class="current-selection">
                    <span>当前选择:</span>
                    <span v-if="!peddingValue">未选择图标</span>
                    <template v-else>
                        <span v-if="getIconType(peddingValue) === 'base'" style="font-size: 20px;user-select: none;"
                            class="iconfont-base" v-html="peddingValue ? peddingValue : '&#xe730;'"></span>
                        <svg v-else-if="getIconType(peddingValue) === 'colorfull'" style="font-size: 20px;" class="icon"
                            aria-hidden="true">
                            <use :xlink:href="peddingValue ? peddingValue : '#icon-default'"></use>
                        </svg>
                        {{ peddingValue }}

                    </template>
                </div>
                <du-button v-if="props.clearable && peddingValue" type="text"
                    @click="() => peddingValue = ''">清除</du-button>


            </div>
            <div style="flex: 1;min-height: 0;">
                <du-tabs v-model="currentTab">
                    <du-tab-pane label="基础图标" name="base">
                        <div class="icon-container">
                            <div class="icon-item" v-for="icon in baseIcons.glyphs"
                                @click="() => peddingValue = `&#x${icon.unicode};`" :key="icon.icon_id">
                                <span class="item-icon iconfont-base" :title="icon.name"
                                    v-html="`&#x${icon.unicode};`"></span>
                                <span class="icon-name">{{ icon.name }}</span>
                            </div>
                        </div>
                    </du-tab-pane>
                    <du-tab-pane label="彩色图标" name="colorfull">
                        <div class="icon-container">
                            <div class="icon-item" v-for="icon in colorIcons.glyphs"
                                @click="() => setPeddingValue(icon.name)" :key="icon.icon_id">
                                <svg style="font-size: 28px;" class="icon" aria-hidden="true">
                                    <use :xlink:href="`#${colorIcons.css_prefix_text}${icon.name}`"></use>
                                </svg>
                                <span class="icon-name">{{ icon.name }}</span>
                            </div>
                        </div>
                    </du-tab-pane>
                </du-tabs>
            </div>

        </div>

    </du-dialog>
</template>
<script setup lang="ts">

import { ref, computed } from 'vue';
import type { DuIconSelectProps, DuIconSelectEmits } from './index.js';

import DuTabPane from '../../layout/du-tabs/du-tab-pane/index.js';
import DuTabs from '../../layout/du-tabs/index.js';
import DuButton from '../../base/du-button/index.js';

import baseIcons from '@/styles/iconfont/base/iconfont.json';
import colorIcons from '@/styles/iconfont/colorfull/iconfont.json';

defineOptions({ name: 'DuIconSelect' })

const props = withDefaults(defineProps<DuIconSelectProps>(), {
    disabled: false,
    readonly: false,
    size: '20px',
    clearable: true,
    multiple: false
});

const value = computed({
    get: () => props.modelValue,
    set: (val: DuIconSelectProps['modelValue']) => {
        emits('update:modelValue', val);
        emits('change', val);
    }
});

const peddingValue = ref<DuIconSelectProps['modelValue']>(props.modelValue)

function getIconType(value: DuIconSelectProps['modelValue']) {
    if (value.startsWith('&#x')) {
        return 'base';
    }
    if (value.startsWith('#icon-')) {
        return 'colorfull';
    }
    return '';
}


const emits = defineEmits<DuIconSelectEmits>();

const visible = ref(false);
const currentTab = ref('base');

function openDialog() {
    if (props.disabled || props.readonly) return;
    visible.value = true;
}

function setPeddingValue(val: DuIconSelectProps['modelValue']) {
    peddingValue.value = `#${colorIcons.css_prefix_text}${val}`;
}

function onConfirm(done: () => void) {
    value.value = peddingValue.value;
    done();
}

</script>
<style scoped lang="scss">
.icon-select {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5f6266;
    text-align: center;
    cursor: pointer;
    background: var(--el-fill-color);
    border: 1px dashed var(--el-border-color);
    border-radius: 4px;
    user-select: none;

    &:hover {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
    }

}

.pedding-select {
    height: 44px;
    padding: 6px 12px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
    color: var(--el-text-color-regular);
    font-size: 12px;
    line-height: normal;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    .current-selection {
        display: flex;
        align-items: center;
        gap: 12px;
    }
}

.icon-container {
    width: 100%;
    border-radius: 4px;
    border: 1px solid var(--el-border-color);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 16px;
    padding: 16px;

    .icon-item {
        width: 90px;
        height: 90px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        border-radius: 8px;
        padding: 8px;

        &:hover {
            transform: translateY(2px);
            transition: transform 0.4s;
            background-color: var(--app-fill-hover);
        }

        .item-icon {
            font-size: 28px;
            user-select: none;
        }

        .icon-name {
            font-size: 11px;
            color: var(--el-text-color-secondary);
            line-height: normal;
        }
    }
}
</style>