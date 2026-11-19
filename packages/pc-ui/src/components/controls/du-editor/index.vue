<template>
    <template v-if="props.readonly">
        <du-button link type="primary">查看</du-button>
    </template>
    <template v-else>
        <du-button link type="primary" :disabled="props.disabled" @click="dialogRef?.open()">编辑</du-button>
    </template>
    <du-dialog ref="dialogRef" width="1000" title="组件参数" @confirm="onConfirm">
        <MonacoEditor v-bind="mergeProps($attrs, props)" :value="value" @update:value="updateValue"
            style="height:800px" />
    </du-dialog>
</template>
<script setup lang="ts">
import { mergeProps, watch, ref, useTemplateRef } from 'vue';
import MonacoEditor from '@guolao/vue-monaco-editor'
import DuButton from '@/components/base/du-button';
import DuDialog from '@/components/feedback/du-dialog';
import type { DuEditorProps, DuEditorEmits } from './index'
defineOptions({ name: 'DuEditor' })

const props = withDefaults(defineProps<DuEditorProps>(), {
})

const emits = defineEmits<DuEditorEmits>()

const dialogRef = useTemplateRef<typeof DuDialog>('dialogRef')
const value = ref<DuEditorProps['modelValue']>('')
watch(() => props.modelValue, (newValue) => {
    value.value = newValue
}, {
    deep: true,
    immediate: true
})

function updateValue(val: DuEditorProps['modelValue']) {
    value.value = val
}

function onConfirm(close: () => void) {
    emits('update:modelValue', value.value)
    emits('change', value.value)
    close()
}

</script>
