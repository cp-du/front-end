import type { Control, QuerySetting } from "@/typings/model";
import DuSearchPro from "./index.vue";
import type { FormProps } from 'element-plus'

export type SearchData = Record<string, unknown>;

export type DuSearchProProps = {
    /**
     * 搜索表单数据
     */
    modelValue?: QuerySetting;
    /**
     * 模型名称
     */
    modelName?: string;
    /**
     * 控件
     */
    controls?: Control[];
    /**
     * 控件尺寸
     */
    size?: FormProps['size'];
    /**
     * 标签的长度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。可以使用 auto。
     */
    labelWidth?: FormProps['labelWidth'];
    /**
     * 列数 默认 5
     */
    column?: number | 'auto';
    /**
     * 每列最小宽度 column 为 auto 时生效
     */
    minColumnWidth?: string;
    /**
     * 重置时是否恢复初始值
     */
    resetInitValue?: boolean;

}

export type DuSearchProEmit = {
    (e: "update:modelValue", value: QuerySetting): void;
    (e: 'search'): void;
    (e: 'reset'): void;
};

export type DuSearchProExpose = {
};

export default DuSearchPro;