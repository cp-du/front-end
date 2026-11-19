import ControlWidget from "./index.vue";
import type { FormControl, SearchControl, CardControl, TableControl, ControlMode } from '@/typings/model.ts'
import type { ComponentSize } from 'element-plus'
export type ControlWidgetProps = {
    /**
     * 绑定值
     */
    modelValue: unknown;
    /**
     * 显示的字段名称
     */
    modelLabel?: string;
    /**
     * 控件配置
     */
    control: FormControl | SearchControl | CardControl | TableControl;
    /**
     * 表单数据
     */
    formData: Record<string, unknown>;
    /**
     * 只读
     */
    readonly?: boolean;
    /**
     * 禁用
     */
    disabled?: boolean;
    /**
     * 控件尺寸
     */
    size?: ComponentSize;
    /**
     * 使用场景
     */
    mode: ControlMode;
}

export type ControlWidgettEmit = {
    (e: 'change', v: unknown, ctl: ControlWidgetProps['control']): void
    (e: 'update:modelValue', v: unknown): void
    (e: 'update:modelLabel', v: ControlWidgetProps['modelLabel']): void
};

export type ControlWidgettExpose = {
};

export default ControlWidget;