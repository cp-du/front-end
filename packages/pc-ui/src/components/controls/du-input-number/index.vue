<template>
    <template v-if="props.readonly">
        {{ props.modelValue || '-' }}
    </template>
    <el-input-number v-else v-bind="mergeProps($attrs, props)" v-model="value" @change="onInputChange" />
</template>
<script setup lang="ts">
import { mergeProps, computed } from 'vue';
import { ElInputNumber } from 'element-plus';
import type { DuInputNumberProps, DuInputNumberEmit } from './index'

defineOptions({
    name: 'DuInputNumber'
})

const props = withDefaults(defineProps<DuInputNumberProps>(), {
    readonly: false,
    disabled: false,
    controls: true,
    controlsPosition: "right",
    align: 'left'
})


const emit = defineEmits<DuInputNumberEmit>();

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

/**
 * 处理 input 值变化
 * @param value unknown
 */
function onInputChange(value: unknown) {
    emit('change', value)
}



</script>
