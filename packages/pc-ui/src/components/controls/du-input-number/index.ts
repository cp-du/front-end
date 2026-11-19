import DuInputNumber from "./index.vue";
import type { InputNumberProps } from 'element-plus'


export type DuInputNumberProps = {
    /**
     * 选中项绑定值
     */
    modelValue?: InputNumberProps['modelValue'];
    /**
     * 设置计数器允许的最小值
     */
    min?: InputNumberProps['min'];
    /**
     * 设置计数器允许的最大值
     */
    max?: InputNumberProps['max'];
    /**
     * 计数器步长
     */
    step?: InputNumberProps['step'];
    /**
     * 是否只能输入 step 的倍数
     */
    stepStrictly?: InputNumberProps['stepStrictly'];
    /**
     * 数值精度
     */
    precision?: InputNumberProps['precision'];
    /**
     * 控件尺寸
     */
    size?: InputNumberProps['size'];
    /**
     * 原生 readonly 属性，是否只读
     */
    readonly?: InputNumberProps['readonly'];
    /**
     * 是否禁用状态
     */
    disabled?: InputNumberProps['disabled'];
    /**
     * 是否使用控制按钮
     */
    controls?: InputNumberProps['controls'];
    /**
     * 控制按钮的位置
     */
    controlsPosition?: InputNumberProps['controlsPosition'];
    /**
     * 原生 name 属性
     */
    name?: InputNumberProps['name'];
    /**
     * 原生 aria-label 属性
     */
    ariaLabel?: InputNumberProps['ariaLabel'];
    /**
     * 等价于原生 input placeholder 属性
     */
    placeholder?: InputNumberProps['placeholder'];
    /**
     * 等价于原生 input id 属性
     */
    id?: InputNumberProps['id'];
    /**
     * 当输入框被清空时显示的值
     */
    valueOnClear?: InputNumberProps['valueOnClear'];
    /**
     * 原生 inputmode 属性
     */
    inputmode?: InputNumberProps['inputmode'];
    /**
     * 内部输入文本对齐
     */
    align?: InputNumberProps['align'];
    /**
     * 禁用科学计数法的输入（例如输入 'e'）
     */
    disabledScientific?: InputNumberProps['disabledScientific'];
    /**
     * 输入框的 tabindex
     */
    tabindex?: InputNumberProps['tabindex'];
    /**
     * 指定输入值的格式
     */
    formatter?: InputNumberProps['formatter'];
    /**
     * 指定从格式化输入中提取的值
     */
    parser?: InputNumberProps['parser'];
}

export type DuInputNumberEmit = {
    (e: "update:modelValue", value: DuInputNumberProps["modelValue"]): void;
    (e: 'change', v: unknown): void
};

export type DuInputNumberExpose = {
};

export default DuInputNumber;