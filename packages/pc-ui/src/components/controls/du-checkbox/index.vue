<template>
    <template v-if="props.readonly">
        {{ label || value || '-' }}
    </template>
    <el-checkbox-group v-bind="mergeProps($attrs, props, { options: options })" :modelValue="value"
        @update:modelValue="updateValue" @change="onCheckboxChange">
    </el-checkbox-group>
</template>
<script setup lang="ts">
import { mergeProps, watch, ref } from 'vue';
import { ElCheckboxGroup, type CheckboxGroupValueType } from 'element-plus';
import type { DuCheckboxProps, DuCheckboxEmit } from './index'
import { useDictHook } from '@/hooks'

defineOptions({
    name: 'DuCheckbox'
})


const props = withDefaults(defineProps<DuCheckboxProps>(), {
    props: () => ({
        value: 'value',
        label: 'label',
        disabled: 'disabled',
    }),
})
const emits = defineEmits<DuCheckboxEmit>();

const { options, getLabel } = useDictHook({
    force: true,
    url: props.url,
    props: props.props,
    options: props.options
})

const value = ref<DuCheckboxProps['modelValue']>([])
const label = ref<DuCheckboxProps['modelLabel']>('')



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

function updateValue(val: DuCheckboxProps['modelValue']) {
    value.value = val
    const label = getLabel(val)
    emits('update:modelLabel', label)
    emits('update:modelValue', val)
}

/**
 * 处理 checkbox 值变化
 * @param value unknown
 */
function onCheckboxChange(value: any) {
    const label = getLabel(value)
    emits('change', value, label)
}


</script>
