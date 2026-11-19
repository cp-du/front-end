import DuSwitch from "./index.vue";
import type { SwitchProps } from 'element-plus'
export type DuSwitchProps = {
    /**
     * 绑定值，必须等于 active-value 或 inactive-value，默认为 Boolean 类型
     */
    modelValue?: SwitchProps['modelValue'];
    /**
     * 是否禁用
     */
    disabled?: SwitchProps['disabled'];
    /**
     * 是否只读
     */
    readonly?: boolean;
    /**
     * 是否显示加载中
     */
    loading?: SwitchProps['loading'];
    /**
     * switch 的大小
     */
    size?: SwitchProps['size'];
    /**
     * switch 的宽度
     */
    width?: SwitchProps['width'];
    /**
     * 无论图标或文本是否显示在点内，只会呈现文本的第一个字符
     */
    inlinePrompt?: SwitchProps['inlinePrompt'];
    /**
     * switch 状态为 on 时所显示图标，设置此项会忽略 active-text
     */
    activeIcon?: SwitchProps['activeIcon'];
    /**
     * switch 状态为 off 时所显示图标，设置此项会忽略 inactive-text
     */
    inactiveIcon?: SwitchProps['inactiveIcon'];
    /**
     * on状态下显示的图标组件
     */
    activeActionIcon?: SwitchProps['activeActionIcon'];
    /**
     * switch 打开时的文字描述
     */
    activeText?: SwitchProps['activeText'];
    /**
     * switch 关闭时的文字描述
     */
    inactiveText?: SwitchProps['inactiveText'];
    /**
     * switch的状态为 off 时的值
     */
    inactiveValue?: SwitchProps['inactiveValue'];
    /**
     * switch的状态为 on 时的值
     */
    activeValue?: SwitchProps['activeValue'];
    /**
     * switch 对应的 name 属性
     */
    name?: SwitchProps['name'];
    /**
     * 是否触发表单验证
     */
    validateEvent?: SwitchProps['validateEvent'];
    /**
     * switch 状态改变前的钩子，返回 false 或者返回 Promise 且被 reject 则停止切换
     */
    beforeChange?: SwitchProps['beforeChange'];
    /**
     * input 的 id
     */
    id?: SwitchProps['id'];
    /**
     * input 的 tabindex 属性
     */
    tabindex?: SwitchProps['tabindex'];
    /**
     * 等价于原生 input aria-label 属性
     */
    ariaLabel?: SwitchProps['ariaLabel'];

}

export type DuSwitchEmit = {
    (e: "update:modelValue", value: DuSwitchProps["modelValue"]): void;
    (e: 'change', v: DuSwitchProps["modelValue"]): void
};

export type DuSwitchExpose = {
};

export default DuSwitch;