import type { VxeTableInstance, VxeTableProps } from 'vxe-table';
import type { ComponentSize, PaginationPropsPublic } from 'element-plus'
import type { TableControl, QuerySetting } from '@/typings/model';
import DuTablePro from "./index.vue";
import type { DuSearchProProps } from '../du-search-pro/index.js';

type SearchConfig = Omit<DuSearchProProps, 'modelValue' | 'modelName' | 'controls'> & {
    enabled?: boolean;
};

type PaginationConfig = Omit<PaginationPropsPublic, "currentPage" | "pageSize" | "total"> & {
    enabled?: boolean;
};


export type DuTableProProps = Omit<VxeTableProps, 'size' | 'importConfig' | 'exportConfig' | 'printConfig'> & {
    /**
     * 表格数据
     */
    modelValue?: Record<string, unknown>[];
    /**
     * 模型名称
     */
    modelName?: string;
    /**
     * 控件
     */
    controls?: TableControl[];
    /**
     * 模型数据预处理
     */
    beforeRender?: (modelData: TableControl[]) => TableControl[] | Promise<TableControl[]>;
    /**
     *  搜索配置
     */
    searchConfig?: SearchConfig;
    /**
     *查询条件
     */
    querySetting?: QuerySetting;
    /**
     * 表格大小
     */
    size?: ComponentSize;
    /**
     * 数据请求地址
     */
    url?: string;
    /**
     * 数据请求固定参数
     */
    params?: Record<string, unknown>;
    /**
     * 是否自动拉取远程数据
     */
    autoLoad?: boolean;
    /**
     * 分页配置
     */
    paginationConfig?: PaginationConfig;
    /**
     * 选择类型，checkbox 或 radio
     */
    checkType?: 'checkbox' | 'radio';
    /**
     * 是否显示间距
     */
    padding?: boolean;
    /**
     * 刷新配置
     */
    refreshConfig?: {
        enabled?: boolean;
    };
    importConfig?: VxeTableProps['importConfig'] & { enabled?: boolean };
    exportConfig?: VxeTableProps['exportConfig'] & { enabled?: boolean };
    printConfig?: VxeTableProps['printConfig'] & { enabled?: boolean };
    customConfig?: VxeTableProps['customConfig'] & { enabled?: boolean };

    /**
     * 重置时是否恢复初始值
     */
    resetInitValue?: boolean;
}

export type DuTableProEmit = {
    (e: "update:modelValue", value: DuTableProProps["modelValue"]): void;
    (e: "loaded", value: DuTableProProps["modelValue"]): void;
};


export type DuTableProExpose = {
    getCheckedRecords: () => DuTableProProps["modelValue"];
    reload: () => Promise<void>;
    setData: (value: DuTableProProps["modelValue"]) => void;
    getData: () => DuTableProProps["modelValue"];
    getTableRef: () => VxeTableInstance | undefined;
    refresh: () => void;
    getQuerySetting: () => QuerySetting;
    total: number;
    setModelProps: (key: TableControl['name'], props: Partial<TableControl>) => void;
    setEditRow: (row: NonNullable<DuTableProProps['modelValue']>[number]) => Promise<void>;
    clearEdit: () => Promise<void>;
    validate: () => Promise<boolean>;
};


export default DuTablePro;
