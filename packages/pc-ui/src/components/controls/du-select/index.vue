<template>
    <template v-if="props.readonly">
        {{ label || value || '-' }}
    </template>

    <el-select style="width: 100%;" v-else v-bind="mergeProps($attrs, props, { loading: loading, options: options })"
        :modelValue="value" @update:modelValue="updateValue" @change="onSelectChange"
        @visible-change="onDropdownVisible">
    </el-select>
</template>
<script setup lang="ts">
import { mergeProps, watch, ref } from 'vue';
import { ElSelect } from 'element-plus';
import type { DuSelectProps, DuSelectEmit } from './index'
import { useDictHook } from '@/hooks'

defineOptions({
    name: 'DuSelect'
})

const props = withDefaults(defineProps<DuSelectProps>(), {
    props: () => ({
        value: 'value',
        label: 'label',
        disabled: 'disabled',
        options: "options"
    }),
    clearable: true,
    collapseTags: true,
    collapseTagsTooltip: true,
    teleported: true,
    persistent: true,
    appendTo: 'body'
})


const { options, loading, fetchDictData, getLabel } = useDictHook({
    force: false,
    url: props.url,
    modelValue: props.modelValue,
    modelLabel: props.modelLabel,
    props: props.props,
    options: props.options
})

const emits = defineEmits<DuSelectEmit>();

const value = ref<DuSelectProps['modelValue']>('')


function updateValue(val: DuSelectProps['modelValue']) {
    value.value = val
    const label = getLabel(val)
    emits('update:modelValue', val)
    emits('update:modelLabel', label)
}

const label = ref<DuSelectProps['modelLabel']>('')

watch(() => props.modelValue, (newValue) => {
    value.value = newValue
}, {
    deep: true,
    immediate: true
})
watch(() => props.modelLabel, (newValue) => {
    label.value = newValue
}, {
    deep: true,
    immediate: true
})




/**
 * select 下拉框显示时加载数据
 * @param visible 是否显示下拉框
 */
function onDropdownVisible(visible: boolean) {
    if (visible) {
        fetchDictData()
    }
}

/**
 * 处理 select 选中值变化
 * @param value unknown
 */
function onSelectChange(value: DuSelectProps['modelValue']) {
    const label = getLabel(value)
    emits('change', value, label)
}

</script>
