export * from './model'
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


export interface MenuNode {
    id: string;
    parentId: number | null;
    name: string;
    path: string;
    appCode: string;
    component: string | null;
    icon: string | null;
    permissionCode: string | null;
    sortOrder: number;
    visible: boolean;
    children: MenuNode[];
}