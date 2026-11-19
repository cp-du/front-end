import DuRadio from "./index.vue";
import type { RadioGroupProps } from 'element-plus'

export type DuRadioProps = {
    /**
     * 绑定值
     */
    modelValue?: RadioGroupProps['modelValue'];
    /**
     * 绑定名称
     */
    modelLabel?: string;
    /**
     * 请求数据的接口地址
     */
    url?: string;
    /**
     * 单选框按钮或边框按钮的大小
     */
    size?: RadioGroupProps['size'];
    /**
     * 是否禁用
     */
    disabled?: RadioGroupProps['disabled'];
    /**
     * 是否只读
     */
    readonly?: boolean;
    /**
     * 输入时是否触发表单的校验
     */
    validateEvent?: RadioGroupProps['validateEvent'];
    /**
     * 按钮形式的 Radio 激活时的文本颜色
     */
    textColor?: RadioGroupProps['textColor'];
    /**
     * 按钮形式的 Radio 激活时的填充色和边框色
     */
    fill?: RadioGroupProps['fill'];
    /**
     * 与 RadioGroup 中的 aria-label 属性相同
     */
    ariaLabel?: RadioGroupProps['ariaLabel'];
    /**
     * 原生 name 属性
     */
    name?: RadioGroupProps['name'];
    /**
     * 原生 id 属性
     */
    id?: RadioGroupProps['id'];
    /**
     * 与 RadioGroup 中的 aria-label 属性相同
     */
    label?: string;
    /**
     * 选项的数据源， value 的 key 和 label 和  disabled可以通过 props自定义.
     */
    options?: RadioGroupProps['options'];
    /**
     * options 的配置
     */
    props?: RadioGroupProps['props'];
    /**
     * 用于渲染选项的组件类型（例如 'button'）
     */
    type?: RadioGroupProps['type'];
}

export type DuRadioEmit = {
    (e: "update:modelValue", value: DuRadioProps["modelValue"]): void;
    (e: "update:modelLabel", value: DuRadioProps["modelLabel"]): void;
    (e: 'change', value: DuRadioProps["modelValue"], label?: DuRadioProps["modelLabel"]): void
};

export type DuRadioExpose = {
};

export default DuRadio;