<template>
    <div :class="['du-editor', props.readonly ? 'du-editor--readonly' : '']">
        <Toolbar v-if="!props.readonly" style="border-bottom: 1px solid var(--el-border-color)" :editor="editorRef"
            :defaultConfig="toolbarConfig" mode="default" />
        <Editor @onChange="onEditorChange" style="height: 500px; overflow-y: hidden;" :modelValue="value"
            @update:modelValue="updateValue" :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated"
            :readOnly="true" />
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, shallowRef, computed, ref, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import type { DuRichtextProps, DuRichtextEmit } from './index'

defineOptions({ name: 'DuRichtext' })

const props = withDefaults(defineProps<DuRichtextProps>(), {
})

const emits = defineEmits<DuRichtextEmit>();


const value = ref<DuRichtextProps['modelValue']>('')

watch(() => props.modelValue, (newValue) => {
    value.value = newValue
}, {
    deep: true,
    immediate: true
})

function updateValue(val: DuRichtextProps['modelValue']) {
    value.value = val
    emits('update:modelValue', val)
}

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()


const toolbarConfig = {}
const editorConfig = computed(() => {
    return { readOnly: props.readonly || props.disabled, placeholder: '请输入内容...' }
})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor: IDomEditor): void => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

const onEditorChange = (editor: IDomEditor): void => {
    const html = editor.getHtml()
    emits('change', html)
}

</script>

<style scoped lang="scss">
/* .du-editor--readonly {
    width: 100%;
    border-radius: 8px;
    background-color: var(--el-color-info-light-9);
    padding: 12px;

    div {
        line-height: 22px;
    }

} */

.du-editor {
    width: 100%;
    background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    border: var(--el-border);

    &.du-editor--readonly {
        /* background-color: var(--el-color-info-light-9); */
        border: none;

        &::v-deep(.w-e-text-container) {
            background-color: var(--el-bg-color-page) !important;
            border-radius: 8px;
        }

    }

}
</style>
