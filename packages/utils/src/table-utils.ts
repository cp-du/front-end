import type { QuerySetting } from "@du/typings";

type TableProInstance = {
    getCheckedRecords: () => Record<string, unknown>[];
    getQuerySetting: () => QuerySetting;
    total: number;
}
/**
 * 获取批量操作提示
 * @param tableProInstance 子组件实例
 * @param key 要显示的字段名
 * @param limit 显示的最大条数
 */
export function getBatchOperationTip(tableProInstance: TableProInstance | null, key: string, limit: number = 5): string {
    if (!tableProInstance) return ""
    const checkRecords = tableProInstance.getCheckedRecords();
    if (checkRecords.length > 0) {
        let tip = checkRecords.slice(0, limit).map(row => row[key]).join('、');
        if (checkRecords.length > limit) {
            tip += '...';
        }
        return '已选数据【' + tip + '】共<span style="padding: 0 4px;color: var(--wis-base-color-brand-3);font-weight: 600;">' + checkRecords.length + '</span>条';
    } else {
        const querySetting = tableProInstance.getQuerySetting()
        const total = tableProInstance.total

        if (querySetting && querySetting.length > 0) {
            const tips = getQuerySettingTips(querySetting);
            let tip = tips.slice(0, limit).join('、');
            if (tips.length > limit) {
                tip += '...';
            }


            return '筛选条件【' + tip + '】共<span style="padding: 0 4px;color: var(--wis-base-color-brand-3);font-weight: 600;">' + total + '</span>条';
        } else {
            return `当前无筛选条件，将操作全部<span style="padding: 0 4px;color: var(--wis-base-color-brand-3);font-weight: 600;">${total}</span>条数据`

        }

    }

}

function getQuerySettingTips(querySetting: QuerySetting, tips: string[] = []) {
    for (let i = 0; i < querySetting.length; i++) {
        const item = querySetting[i];
        if (Array.isArray(item)) {
            getQuerySettingTips(item, tips);
        } else {
            tips.push(`【${item.caption}:${item.value_display || item.value}】`);
        }
    }
    return tips;
}
