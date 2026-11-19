import type { EditorProps } from '@guolao/vue-monaco-editor'
import DuEditor from './index.vue'
export type DuEditorProps = Partial<Omit<EditorProps, 'value'>> & {
    /**
     * 绑定值
     */
    modelValue?: EditorProps['value']
    /**
     * 是否禁用
     */
    disabled?: boolean
    /**
     * 是否只读
     */
    readonly?: boolean
}

export type DuEditorEmits = {
    (e: 'update:modelValue', value: EditorProps['value']): void
    (e: 'change', value: EditorProps['value']): void
}

export default DuEditor