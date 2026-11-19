<template>
    <template v-if="props.readonly">
        {{ props.modelValue || '-' }}
    </template>
    <el-input v-else v-bind="mergeProps($attrs, props)" v-model="value" @change="onInputChange" />
</template>
<script setup lang="ts">
import { mergeProps, computed } from 'vue';
import { ElInput } from 'element-plus';
import type { DuInputProps, DuInputEmit } from './index'

defineOptions({
    name: 'DuInput'
})

const props = withDefaults(defineProps<DuInputProps>(), {
    readonly: false,
    disabled: false,
})


const emit = defineEmits<DuInputEmit>();

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
