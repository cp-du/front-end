import { VxeColumnProps } from "vxe-table"

import { DuInputProps, DuInputNumberProps, DuSelectProps, DuSwitchProps, DuRadioProps, DuCheckboxProps, DuDatePickerProps, DuRichtextProps, DuEditorProps } from "@/components"
export type ControlProps = DuInputProps | DuInputNumberProps | DuSelectProps | DuSwitchProps | DuRadioProps | DuCheckboxProps | DuDatePickerProps | DuRichtextProps | DuEditorProps
export type ControlType = "input" | "select" | "radio" | "checkbox" | "date-picker" | "number" | "switch" | "richtext" | "upload" | "editor";
export type Builder = "include" | "m_value_equal" | "equal"
export type ControlMode = "table" | "form" | "search" | "card";

export interface Control {
    /**
     * 控件的标题或说明
     */
    caption: string;
    /**
     * 控件的唯一标识，用于表单数据绑定
     */
    name: string;
    /**
     * 控件的构建方式，可选值为 "include"、"m_value_equal" 或 "equal"
     */
    builder: Builder,
    /**
     * 构建方式的显示文本
     */
    builder_display?: string;
    /**
     * 是否隐藏控件
     */
    hidden?: boolean;
    /**
     * 控件是否为必填项
     */
    required?: boolean;
    /**
     * 控件的类型，可选值为 ControlType
     */
    type?: ControlType;
    /**
     * 控件是否为只读
     */
    readonly?: boolean;
    /**
     * 控件是否为禁用
     */
    disabled?: boolean;
    /**
     * 控件的属性
     */
    controlProps?: ControlProps;
    /**
     * 是否移除
     */
    omitted?: boolean;
    /**
     * 控件的描述信息
     */
    description?: string;
    /**
     * 控件的占位列数
     */
    span?: number;
    /**
     * 正则表达式，用于校验控件的输入值
     */
    pattern?: string;
}



export interface TableColmun extends Control {
    /**
     * 控件在表格区域是否隐藏
     */
    "table.hidden"?: boolean;
    /**
     * 控件在表格区域是否为必填项
     */
    "table.required"?: boolean;
    /**
     * 控件在表格区域的类型，可选值为 ControlType
     */
    "table.type"?: ControlType;
    /**
     * 控件在表格区域是否为只读
     */
    "table.readonly"?: boolean;
    /**
     * 控件在表格区域是否为禁用
     */
    "table.disabled"?: boolean;
    /**
     * 控件在表格区域的属性
     */
    'table.controlProps'?: ControlProps;
    /**
     * 是否移除
     */
    "table.omitted"?: boolean;
    /**
     * 控件在表格区域的占位列数
     */
    'span'?: never;
    /**
     * 控件的描述信息
     */
    'table.description'?: string;
    /**
     * 正则表达式，用于校验控件的输入值
     */
    'table.pattern'?: string;

}

export type TableControl = TableColmun & Omit<VxeColumnProps, 'type'>;

export interface FormControl extends Control {
    /**
     * 控件在搜索区域是否隐藏
     */
    "form.hidden"?: boolean;
    /**
    * 控件在表单区域是否为必填项
    */
    "form.required"?: boolean;
    /**
     * 控件在表单区域的类型，可选值为 ControlType
     */
    "form.type"?: ControlType;
    /**
     * 控件的占位列数
     */
    'form.span'?: number;
    /**
     * 控件在表单区域是否为只读
     */
    "form.readonly"?: boolean;
    /**
     * 控件在表单区域是否为禁用
     */
    "form.disabled"?: boolean;
    /**
     * 控件所属的分组名称
     */
    groupName?: string;
    /**
     * 控件在表单区域的属性
     */
    'form.controlProps'?: ControlProps;
    /**
     * 是否移除
     */
    'form.omitted'?: boolean;
    /**
     * 控件的描述信息
     */
    'form.description'?: string;
    /**
     * 正则表达式，用于校验控件的输入值
     */
    'form.pattern'?: string;
}


export interface SearchControl extends Control {
    /**
     * 控件在搜索区域是否隐藏
     */
    "search.hidden"?: boolean;
    /**
     * 控件在搜索区域是否为必填项
     */
    "search.required"?: boolean;
    /**
     * 控件在搜索区域的类型，可选值为 ControlType
     */
    "search.type"?: ControlType;
    /**
     * 控件在搜索区域是否为只读
     */
    "search.readonly"?: boolean;
    /**
     * 控件在搜索区域是否为禁用
     */
    "search.disabled"?: boolean;
    /**
     * 控件的占位列数
     */
    'search.span'?: number;
    /**
     * 是否为模糊搜索控件
     */
    fuzzySearch?: boolean;
    /**
     * 模糊搜索字段列表
     */
    fuzzySearchField?: string[];
    /**
     * 控件在搜索区域的属性
     */
    'search.controlProps'?: ControlProps;
    /**
     * 是否移除
     */
    "search.omitted"?: boolean;
    /**
     * 控件的描述信息
     */
    'search.description'?: string;
    /**
     * 正则表达式，用于校验控件的输入值
     */
    'search.pattern'?: string;
}


export interface CardControl extends Control {
    /**
     * 控件在卡片区域是否隐藏
     */
    "card.hidden"?: boolean;
    /**
     * 控件在卡片区域是否为必填项
     */
    "card.required"?: boolean;
    /**
     * 控件在卡片区域的类型，可选值为 ControlType
     */
    "card.type"?: ControlType;
    /**
     * 控件在卡片区域是否为只读
     */
    "card.readonly"?: boolean;
    /**
     * 控件在卡片区域是否为禁用
     */
    "card.disabled"?: boolean;
    /**
     * 控件在卡片区域的属性
     */
    'card.controlProps'?: ControlProps;
    /**
     * 控件的占位列数
     */
    'card.span'?: number;
    /**
     * 是否移除
     */
    "card.omitted"?: boolean;
    /**
     * 正则表达式，用于校验控件的输入值
     */
    'card.pattern'?: string;
}


export type QuerySettingItem = {
    name: string;
    value: string;
    value_display?: string;
    caption?: string;
    linkOpt?: "and" | "or";
    builder: "include" | "m_value_equal" | "equal"
    builder_display?: string;
}
export type QuerySetting = (QuerySettingItem | QuerySettingItem[])[]
export type FuzzySearchquerySetting = QuerySettingItem[]
