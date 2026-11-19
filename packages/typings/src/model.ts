export type ControlType = "input" | "select" | "radio" | "checkbox" | "date" | "datetime" | "time" | "textarea" | "number" | "switch" | "slider" | "rate" | "colorpicker" | "cascader" | "transfer" | "upload" | "editor" | string;
export type ControlOption = {
    /**
     * 表单、可编辑表格
     */
    placeholder?: string;
    /**
     * 字典请求url
     */
    url?: string;
    /**
     * 字典id映射值
     */
    valueKey?: string;
    /**
     * 字典名称映射值
     */
    labelKey?: string;
    /**
     * 字典值
     */
    options?: Record<string, unknown>[];

    // type?: string;
    /**
     * 日期时间组件format
     */
    format?: string;
    /**
     * 日期时间组件valueFormat
     */
    valueFormat?: string;
    /**
     * 控件是否可清空 select
     */
    clearable?: boolean;
    /**
     * 表格冻结
     */
    fixed?: 'left' | 'right',
    /**
     * 表格column宽度
     */
    width?: string;
}


export type Control = {
    caption: string;
    hidden?: boolean;
    name: string;
    builder: "include" | "m_value_equal" | "equal",
    builder_display?: string;
    /**
     * 模糊搜索 输入框使用
     */
    fuzzySearch?: boolean;
    /**
     * 模糊搜索对应的字段数组
     */
    fuzzySearchField?: string[];
    required?: boolean;
    "form.required"?: boolean;
    "table.required"?: boolean;
    "search.required"?: boolean;
    type?: ControlType;
    "form.type"?: ControlType;
    "table.type"?: ControlType;
    "search.type"?: ControlType;
    readonly?: boolean;
    "form.readonly"?: boolean;
    "table.readonly"?: boolean;
    "search.readonly"?: boolean;

    disabled?: boolean;
    "form.disabled"?: boolean;
    "table.disabled"?: boolean;
    "search.disabled"?: boolean;
    controlOption?: ControlOption;
    span?: number;
    'form.span'?: number;
    'table.span'?: number;
    'search.span'?: number;


    [key: string]: any;
}

