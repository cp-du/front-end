<template>
    <template v-if="props.readonly">
        {{ value === props.activeValue ? props.activeText : value === props.inactiveValue ? props.inactiveText : '-' }}
    </template>
    <el-switch v-else v-bind="mergeProps($attrs, props)" :modelValue="value" @update:modelValue="updateValue"
        @change="onSwitchChange" />
</template>
<script setup lang="ts">
import { mergeProps, watch, ref } from 'vue';
import { ElSwitch } from 'element-plus';
import type { DuSwitchProps, DuSwitchEmit } from './index'
defineOptions({
    name: 'DuSwitch'
})


const props = withDefaults(defineProps<DuSwitchProps>(), {
    activeText: '是',
    inactiveText: '否',
    activeValue: true,
    inactiveValue: false,
    inlinePrompt: true
})


const emits = defineEmits<DuSwitchEmit>();

const value = ref<DuSwitchProps['modelValue']>('')


watch(() => props.modelValue, (newValue) => {
    value.value = newValue
}, {
    deep: true,
    immediate: true
})
function updateValue(val: DuSwitchProps['modelValue']) {
    value.value = val
    emits('update:modelValue', val)
}

/**
 * 处理 switch 值变化
 * @param value unknown
 */
function onSwitchChange(value: DuSwitchProps['modelValue']) {
    emits('change', value)
}



</script>
