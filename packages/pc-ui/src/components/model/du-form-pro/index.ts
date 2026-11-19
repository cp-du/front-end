import type { FormProps } from 'element-plus'
import DuFormPro from "./index.vue";
import type { FormControl } from "@/typings/model";

export type FormData = Record<string, unknown>;

export type DuFormProProps = {
    /**
     * 表单数据对象
     */
    modelValue?: FormData;
    /**
     * 模型名称
     */
    modelName?: string;
    /**
     * 控件数组
     */
    controls?: FormControl[];
    /**
     * 表单组件尺寸
     */
    size?: FormProps['size'];
    /**
     * 表单域标签的位置，当设置为 left 或 right 时，则也需要设置 label-width 属性
     */
    labelPosition?: FormProps['labelPosition'];
    /**
     * 标签的长度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。可以使用 auto。
     */
    labelWidth?: FormProps['labelWidth'];
    /**
     * 表单域标签的后缀
     */
    labelSuffix?: FormProps['labelSuffix'];
    /**
     * 是否隐藏必填字段标签旁边的红色星号。
     */
    hideRequiredAsterisk?: FormProps['hideRequiredAsterisk'];
    /**
     * 星号的位置。
     */
    requireAsteriskPosition?: FormProps['requireAsteriskPosition'];
    /**
     * 是否显示校验错误信息
     */
    showMessage?: FormProps['showMessage'];
    /**
     * 是否以行内形式展示校验信息
     */
    inlineMessage?: FormProps['inlineMessage'];
    /**
     * 是否在输入框中显示校验结果反馈图标
     */
    statusIcon?: FormProps['statusIcon'];
    /**
     * 是否在 rules 属性改变后立即触发一次验证
     */
    validateOnRuleChange?: FormProps['validateOnRuleChange'];
    /**
     * 是否禁用该表单内的所有组件。在 2.12.0 以前，如果设置为 true，它将覆盖内部组件的 disabled 属性。在 2.12.0 之后，内部组件的配置优先。
     */
    disabled?: FormProps['disabled'];
    /**
     * 当校验失败时，滚动到第一个错误表单项
     */
    scrollToError?: FormProps['scrollToError'];
    /**
     * 只读
     */
    readonly?: boolean;
    /**
     * 当校验有失败结果时，滚动到第一个失败的表单项目可通过 scrollIntoView
     */
    scrollIntoViewOptions?: FormProps['scrollIntoViewOptions'];
    /**
     * 边框，设置为 true 时，表单显示边框 labelWidth 设置 auto 无效
     */
    border?: boolean;
    /**
     * 是否启用分组显示
     */
    groupable?: boolean;
    /**
     * 列数 默认 3
     */
    column?: number | 'auto';
    /**
     * 每列最小宽度 column 为 auto 时生效
     */
    minColumnWidth?: string;
}



export type DuFormProState = {
    // formData: FormData;
}

export type DuFormProEmit = {
    (e: "update:modelValue", value: FormData): void;
    (e: "item-change", value: unknown, key: string): void;
    (e: "model-done"): void;
};

export type DuFormProExpose = {
    validate(): Promise<false | FormData>;
    getValue(): FormData,
    setValue(value: FormData): void,
    setModelProps: (key: FormControl['name'], props: Partial<FormControl>) => void;
};


export default DuFormPro;
