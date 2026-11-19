<template>
    <template v-if="props.readonly">
        {{ props.modelLabel || props.modelValue || '-' }}
    </template>

    <el-radio-group v-else v-bind="mergeProps($attrs, props, { options: options })" :modelValue="value"
        @update:modelValue="updateValue" @change="onRadioChange">
    </el-radio-group>
</template>
<script setup lang="ts">
import { mergeProps, watch, ref } from 'vue';
import { ElRadioGroup } from 'element-plus';
import type { DuRadioProps, DuRadioEmit } from './index'
import { useDictHook } from '@/hooks'

defineOptions({
    name: 'DuRadio'
})

const props = withDefaults(defineProps<DuRadioProps>(), {
    props: () => ({
        value: 'value',
        label: 'label',
        disabled: 'disabled',
    }),
})

const { options, getLabel } = useDictHook({
    force: true,
    url: props.url,
    props: props.props,
    options: props.options
})

const emits = defineEmits<DuRadioEmit>();
const value = ref<DuRadioProps['modelValue']>('')
const label = ref<DuRadioProps['modelLabel']>('')


function updateValue(val: DuRadioProps['modelValue']) {
    value.value = val
    const label = getLabel(val)
    emits('update:modelLabel', label)
    emits('update:modelValue', val)
}

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
 * 处理 radio 选中值变化
 * @param value unknown
 */
function onRadioChange(value: DuRadioProps['modelValue']) {
    const label = getLabel(value)
    emits('change', value, label)
}

</script>
