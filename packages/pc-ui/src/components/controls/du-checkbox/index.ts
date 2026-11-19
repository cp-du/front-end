import DuCheckbox from "./index.vue";
import type { CheckboxGroupProps } from 'element-plus'

export type DuCheckboxProps = {
    /**
     * 绑定值
     */
    modelValue?: CheckboxGroupProps['modelValue'];
    /**
     * 绑定标签值
     */
    modelLabel?: string;
    /**
     * 请求数据的接口地址
     */
    url?: string;
    /**
     * 多选框组尺寸
     */
    size?: CheckboxGroupProps['size'];
    /**
     * 是否禁用
     */
    disabled?: CheckboxGroupProps['disabled'];
    /**
     * 是否只读
     */
    readonly?: boolean;
    /**
     * 最小可选数量
     */
    min?: CheckboxGroupProps['min'];
    /**
     * 最大可选数量
     */
    max?: CheckboxGroupProps['max'];
    /**
     * 原生 aria-label属性
     */
    ariaLabel?: CheckboxGroupProps['ariaLabel'];
    /**
     * 当按钮为活跃状态时的字体颜色
     */
    textColor?: CheckboxGroupProps['textColor'];
    /**
     * 当按钮为活跃状态时的边框和背景颜色
     */
    fill?: CheckboxGroupProps['fill'];
    /**
     * 复选框组元素标签
     */
    tag?: CheckboxGroupProps['tag'];
    /**
     * 是否触发表单验证
     */
    validateEvent?: CheckboxGroupProps['validateEvent'];
    /**
     * 复选框组选项
     */
    options?: CheckboxGroupProps['options'];
    /**
     * options 的配置
     */
    props?: CheckboxGroupProps['props'];
    /**
     * 用于渲染选项的组件类型（例如 'button'）
     */
    type?: CheckboxGroupProps['type'];

}

export type DuCheckboxEmit = {
    (e: "update:modelValue", value: DuCheckboxProps['modelValue']): void;
    (e: "update:modelLabel", value: DuCheckboxProps['modelLabel']): void;
    (e: 'change', value: DuCheckboxProps['modelValue'], label: DuCheckboxProps['modelLabel']): void
};

export type DuCheckboxExpose = {
};

export default DuCheckbox;