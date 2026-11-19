import type { FormControl, TableControl } from '@/typings';

type ModelControl = FormControl | TableControl;
export const ModelControls: ModelControl[] = [
    {
        "name": "id",
        "caption": "模型ID",
        "builder": "equal",
        "type": "input",
        "omitted": true,
        "table.readonly": true
    },
    {
        "name": "name",
        "caption": "模型名称",
        "builder": "equal",
        "type": "input",
        required: true,
        "table.readonly": true
    },
    {
        "name": "code",
        "caption": "模型编码",
        "builder": "include",
        "type": "input",
        required: true,
        "table.readonly": true
    },
    {
        "name": "status",
        "caption": "模型状态",
        "builder": "include",
        "type": "select",
        "form.type": 'radio',
        required: true,
        "table.readonly": true,
        'controlProps': {
            options: [
                { label: '启用', value: '1' },
                { label: '禁用', value: '0' }
            ]
        }
    },
    {
        "name": "createTime",
        "caption": "创建时间",
        "builder": "include",
        "type": "date-picker",
        "form.hidden": true,
        "table.readonly": true
    },
    {
        "name": "updateTime",
        "caption": "修改时间",
        "builder": "include",
        "type": "date-picker",
        "form.hidden": true,
        "table.readonly": true
    },
    {
        "name": "description",
        "caption": "描述",
        "builder": "include",
        "type": "input",
        "table.readonly": true,
        "form.controlProps": {
            type: 'textarea'
        }
    },
]

const TypeOptions = [
    {
        label: '输入框',
        value: 'input'
    },
    {
        label: '数字输入框',
        value: 'number'
    },
    {
        label: '选择器',
        value: 'select'
    },
    {
        label: '单选框',
        value: 'radio'
    },
    {
        label: '多选框',
        value: 'checkbox'
    },
    {
        label: '日期选择器',
        value: 'date-picker'
    },
    {
        label: '开关',
        value: 'switch'
    },
    {
        label: '富文本编辑器',
        value: 'editor'
    },
    {
        label: '上传',
        value: 'upload'
    },
    {
        label: '编辑器',
        value: 'editor'
    },
]



export const addFieldControls: FormControl[] = [
    {
        name: "name",
        caption: "字段名",
        builder: 'equal',
        type: 'input',
        required: true,
    },
    {
        name: "caption",
        caption: "显示名称",
        builder: 'equal',
        type: 'input',
        required: true,
    }
]

export const baseControls: FormControl[] = [
    {
        name: "name",
        caption: "字段名",
        builder: 'equal',
        type: 'input',
        required: true,
        disabled: true
    },
    {
        name: "type",
        caption: "字段类型",
        builder: 'equal',
        type: 'select',
        required: true,
        controlProps: {
            options: TypeOptions
        }
    },
    {
        name: "length",
        caption: "字段长度",
        builder: 'equal',
        type: 'number',
        required: true,
    },
    {
        name: "caption",
        caption: "显示名称",
        builder: 'equal',
        type: 'input',
        required: true,
    },
    {
        name: "required",
        caption: "是否必填",
        builder: 'equal',
        type: 'switch'
    },
    {
        name: "readonly",
        caption: "是否只读",
        builder: 'equal',
        type: 'switch'
    },
    {
        name: "disabled",
        caption: "是否禁用",
        builder: 'equal',
        type: 'switch'
    },
    {
        name: "omitted",
        caption: "是否移除",
        builder: 'equal',
        type: 'switch'
    },
    {
        name: "description",
        caption: "描述",
        builder: 'equal',
        type: 'input',
        controlProps: {
            type: 'textarea'
        }
    },
    {
        name: "span",
        caption: "字段占位列数",
        builder: 'equal',
        type: 'number',

    },
    {
        name: "pattern",
        caption: "正则表达式",
        builder: 'equal',
        type: 'input',
    },
    {
        name: "controlProps",
        caption: "组件附加参数",
        builder: 'equal',
        type: 'editor',
        controlProps: {
            language: 'json',
            options: { minimap: { enabled: false }, fontSize: 14 },
        }
    },
]

export const tableControls: FormControl[] = [
    {
        name: "table.hidden",
        caption: "是否隐藏",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "table.required",
        caption: "是否必填",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "table.readonly",
        caption: "是否只读",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "table.disabled",
        caption: "是否禁用",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "table.omitted",
        caption: "是否移除",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "table.type",
        caption: "字段类型",
        builder: 'equal',
        type: 'select',
        controlProps: {
            options: TypeOptions
        },

    },
    {
        name: "table.description",
        caption: "描述",
        builder: 'equal',
        type: 'input',
        controlProps: {
            type: 'textarea'
        }
    },
    {
        name: "table.controlProps",
        caption: "组件附加参数",
        builder: 'equal',
        type: 'editor',
        controlProps: {
            language: 'json',
            options: { minimap: { enabled: false }, fontSize: 14 },
        }
    },
    {
        name: "table.pattern",
        caption: "正则表达式",
        builder: 'equal',
        type: 'input',
    }

]

export const formControls: FormControl[] = [
    {
        name: "form.hidden",
        caption: "是否隐藏",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "form.required",
        caption: "是否必填",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "form.readonly",
        caption: "是否只读",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "form.disabled",
        caption: "是否禁用",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "form.omitted",
        caption: "是否移除",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "form.type",
        caption: "字段类型",
        builder: 'equal',
        type: 'select',
        controlProps: {
            options: TypeOptions
        },

    },
    {
        name: "form.span",
        caption: "字段占位列数",
        builder: 'equal',
        type: 'number',

    },
    {
        name: "form.description",
        caption: "描述",
        builder: 'equal',
        type: 'input',
        controlProps: {
            type: 'textarea'
        }
    },
    {
        name: "groupName",
        caption: "分组名称",
        builder: 'equal',
        type: 'input',
    },
    {
        name: "form.pattern",
        caption: "正则表达式",
        builder: 'equal',
        type: 'input',
    },
    {
        name: "form.controlProps",
        caption: "组件附加参数",
        builder: 'equal',
        type: 'editor',
        controlProps: {
            language: 'json',
            options: { minimap: { enabled: false }, fontSize: 14 },
        }
    },
]


export const searchControls: FormControl[] = [
    {
        name: "search.hidden",
        caption: "是否隐藏",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "search.required",
        caption: "是否必填",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "search.readonly",
        caption: "是否只读",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "search.disabled",
        caption: "是否禁用",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "search.omitted",
        caption: "是否移除",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "fuzzySearch",
        caption: "是否模糊搜索",
        builder: 'equal',
        type: 'switch',

    },
    {
        name: "search.type",
        caption: "字段类型",
        builder: 'equal',
        type: 'select',
        controlProps: {
            options: TypeOptions
        },

    },
    {
        name: "search.span",
        caption: "字段占位列数",
        builder: 'equal',
        type: 'number',
    },
    {
        name: "search.description",
        caption: "描述",
        builder: 'equal',
        type: 'input',
        controlProps: {
            type: 'textarea'
        }
    },
    {
        name: "search.pattern",
        caption: "正则表达式",
        builder: 'equal',
        type: 'input',
    },
    {
        name: "search.controlProps",
        caption: "组件附加参数",
        builder: 'equal',
        type: 'editor',
        controlProps: {
            language: 'json',
            options: { minimap: { enabled: false }, fontSize: 14 },
        }
    },
]

export const defaultControls = {
    "table.readonly": true
}