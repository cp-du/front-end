import DuDatePicker from "./index.vue";
import type { DatePickerProps } from 'element-plus'

export type DuDatePickerProps = {
    /**
     * 绑定值
     */
    modelValue?: DatePickerProps['modelValue'];
    /**
     * 只读
     */
    readonly?: DatePickerProps['readonly'];
    /**
     * 文本框可输入
     */
    editable?: DatePickerProps['editable'];
    /**
     * 是否显示清除按钮
     */
    clearable?: DatePickerProps['clearable'];
    /**
     * 输入框尺寸
     */
    size?: DatePickerProps['size'];
    /**
     * 输入框尺寸
     */
    placeholder?: DatePickerProps['placeholder'];
    /**
     * 范围选择时开始日期的占位内容
     */
    startPlaceholder?: DatePickerProps['startPlaceholder'];
    /**
     * 范围选择时结束日期的占位内容
     */
    endPlaceholder?: DatePickerProps['endPlaceholder'];
    /**
     * 是否使用箭头进行时间选择
     */
    arrowControl?: DatePickerProps['arrowControl'];
    /**
     * 显示类型
     */
    type?: DatePickerProps['type'];
    /**
     * 显示在输入框中的格式
     */
    format?: DatePickerProps['format'];
    /**
     * DateTimePicker 下拉框的类名
     */
    popperClass?: DatePickerProps['popperClass'];
    /**
     * 弹出内容的自定义样式
     */
    popperStyle?: DatePickerProps['popperStyle'];
    /**
     * 自定义 popper 选项，更多请参考 popper.js
     */
    popperOptions?: DatePickerProps['popperOptions'];
    /**
     * Tooltip 可用的 positions 请查看popper.js 文档
     */
    fallbackPlacements?: DatePickerProps['fallbackPlacements'];
    /**
     * 可选，选择器打开时默认显示的时间
     */
    defaultValue?: DatePickerProps['defaultValue'];
    /**
     * 选择日期后的默认时间值。如未指定则默认时间值为 00:00:00
     */
    defaultTime?: DatePickerProps['defaultTime'];
    /**
     * 可选，绑定值的格式。不指定则绑定值为 Date 对象
     */
    valueFormat?: DatePickerProps['valueFormat'];
    /**
     * 可选，输入框内部面板中显示的日期格式
     */
    dateFormat?: DatePickerProps['dateFormat'];
    /**
     * 可选，输入框内部面板中显示的时间格式
     */
    timeFormat?: DatePickerProps['timeFormat'];
    /**
     * 等价于原生 input id 属性
     */
    id?: DatePickerProps['id'];
    /**
     * 等价于原生 input name 属性
     */
    name?: DatePickerProps['name'];
    /**
     * 在范围选择器里取消两个日期面板之间的联动
     */
    unlinkPanels?: DatePickerProps['unlinkPanels'];
    /**
     * 在范围选择器中只显示一个面板
     */
    singlePanel?: DatePickerProps['singlePanel'];
    /**
     * 可选，选择器打开时默认显示的时间
     */
    prefixIcon?: DatePickerProps['prefixIcon'];
    /**
     * 自定义清除图标
     */
    clearIcon?: DatePickerProps['clearIcon'];
    /**
     * 设置快捷选项，需要传入数组对象
     */
    shortcuts?: DatePickerProps['shortcuts'];
    /**
     * 一个用来判断该日期是否被禁用的函数，接受一个 Date 对象作为参数。应该返回一个 Boolean 值。
     */
    disabledDate?: DatePickerProps['disabledDate'];
    /**
     * 禁止选择部分小时选项
     */
    disabledHours?: DatePickerProps['disabledHours'];
    /**
     * 禁止选择部分分钟选项
     */
    disabledMinutes?: DatePickerProps['disabledMinutes'];
    /**
     * 禁止选择部分秒选项
     */
    disabledSeconds?: DatePickerProps['disabledSeconds'];
    /**
     * 设置自定义类名
     */
    cellClassName?: DatePickerProps['cellClassName'];
    /**
     * 是否将 datetime-picker 的下拉列表插入至 body 元素
     */
    teleported?: boolean;
    /**
     * 组件的空值配置
     */
    emptyValues?: DatePickerProps['emptyValues'];
    /**
     * 清空选项的值
     */
    valueOnClear?: DatePickerProps['valueOnClear'];
    /**
     * 是否显示 now 按钮
     */
    showNow?: DatePickerProps['showNow'];
    /**
     * 是否在日期选择器中显示页脚 ^[enum]`'datetime'
     */
    showFooter?: DatePickerProps['showFooter'];
    /**
     * 是否显示确定按钮
     */
    showConfirm?: DatePickerProps['showConfirm'];
    /**
     * 显示周数(除周外)
     */
    showWeekNumber?: DatePickerProps['showWeekNumber'];

}

export type DuDatePickerEmit = {
    (e: "update:modelValue", value: DuDatePickerProps['modelValue']): void;
    (e: 'change', v: DuDatePickerProps['modelValue']): void
};

export type DuDatePickerExpose = {
};

export default DuDatePicker;