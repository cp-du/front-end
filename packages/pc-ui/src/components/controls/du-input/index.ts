import DuInput from "./index.vue";
import type { InputProps } from 'element-plus'

export type DuInputProps = {
    /**
     * 绑定值
     */
    modelValue?: InputProps['modelValue'];
    /**
     * 输入类型
     */
    type?: InputProps['type'];
    /**
     * 同原生 maxlength 属性
     */
    maxlength?: InputProps['maxlength'];
    /**
    * 同原生 minlength 属性
    */
    minlength?: InputProps['minlength'];
    /**
     * 是否显示统计字数, 只在 type 为 'text' 或 'textarea' 的时候生效
     */
    showWordLimit?: InputProps['showWordLimit'];
    /**
     * 字数统计的位置，仅当 show-word-limit 为 true 时生效。
     */
    wordLimitPosition?: InputProps['wordLimitPosition'];
    /**
     * 输入框占位文本
     */
    placeholder?: InputProps['placeholder'];
    /**
     * 是否显示清除按钮，只有当 type 不是 textarea时生效
     */
    clearable?: InputProps['clearable'];
    /**
     * 清除按钮的图标
     */
    clearIcon?: InputProps['clearIcon'];
    /**
     * 指定输入值的格式。(只有当 type 是"text"时才能工作)
     */
    formatter?: InputProps['formatter'];
    /**
     * 指定从格式化器输入中提取的值。(仅当 type 是"text"时才起作用)
     */
    parser?: InputProps['parser'];
    /**
     * 是否显示切换密码图标
     */
    showPassword?: InputProps['showPassword'];
    /**
     * 是否禁用
     */
    disabled?: InputProps['disabled'];
    /**
     * 输入框尺寸，只在 type 不为 'textarea' 时有效
     */
    size?: InputProps['size'];
    /**
     * 自定义前缀图标
     */
    prefixIcon?: InputProps['prefixIcon'];
    /**
     * 自定义后缀图标
     */
    suffixIcon?: InputProps['suffixIcon'];
    /**
     * 文本域行数，只在 type 为 'textarea' 时有效
     */
    rows?: InputProps['rows'];

    /**
     * textarea 高度是否自适应，仅 type 为 'textarea' 时生效。可以接受一个对象，比如: { minRows: 2, maxRows: 6 }
     */
    autosize?: InputProps['autosize'];
    /**
     * 原生 autocomplete 属性
     */
    autocomplete?: InputProps['autocomplete'];
    /**
     * 等价于原生 input name 属性
     */
    name?: InputProps['name'];
    /**
     * 原生 readonly 属性，是否只读
     */
    readonly?: InputProps['readonly'];
    /**
     * 控制是否能被用户缩放
     */
    resize?: InputProps['resize'];
    /**
     * 原生属性，自动获取焦点
     */
    autofocus?: InputProps['autofocus'];
    /**
     * 原生 form 属性
     */
    form?: InputProps['form'];
    /**
     * 等价于原生 input aria-label 属性
     */
    ariaLabel?: InputProps['ariaLabel'];
    /**
     * 等价于原生 input tabindex 属性
     */
    tabindex?: InputProps['tabindex'];
    /**
     * 输入时是否触发表单的校验
     */
    validateEvent?: InputProps['validateEvent'];
    /**
     * input 元素或 textarea 元素的 style
     */
    inputStyle?: InputProps['inputStyle'];
    /**
     * 等价于原生 input inputmode 属性
     */
    inputmode?: InputProps['inputmode'];
    /**
     * 自定义函数用于计算字形；设置后，将绕过原生的 maxlength/minlength 约束。组件使用 Intl.Segmenter（Chrome 87+、Firefox 125+、Safari 14.1+）进行正确的字素聚类；旧版浏览器回退到使用 Array.from() 进行码点迭代。
     */
    countGraphemes?: InputProps['countGraphemes'];

}

export type DuInputEmit = {
    (e: "update:modelValue", value: DuInputProps["modelValue"]): void;
    (e: 'change', v: unknown): void
};

export type DuInputExpose = {
};

export default DuInput;