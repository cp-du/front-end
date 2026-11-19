<template>
    <template v-if="props.readonly">
        {{ props.modelValue || '-' }}
    </template>
    <el-date-picker style="width: 100%;" v-else v-bind="mergeProps($attrs, props)" v-model="value"
        @change="onDatePickerChange" />
</template>
<script setup lang="ts">
import { ElDatePicker } from 'element-plus';
import { mergeProps, ref, watch } from 'vue';
import type { DuDatePickerProps, DuDatePickerEmit } from './index'

defineOptions({
    name: 'DuDatePicker'
})

const props = withDefaults(defineProps<DuDatePickerProps>(), {
    format: "YYYY-MM-DD HH:mm:ss",
    valueFormat: "YYYY-MM-DD h:m:s a",
    teleported: true
})

const emits = defineEmits<DuDatePickerEmit>();

const value = ref<DuDatePickerProps['modelValue']>([])

watch(() => props.modelValue, (newValue) => {
    value.value = newValue
}, {
    deep: true,
    immediate: true
})
/**
 * 处理 date 值变化
 */
function onDatePickerChange(value: DuDatePickerProps['modelValue']) {
    emits('change', value)
}


</script>
