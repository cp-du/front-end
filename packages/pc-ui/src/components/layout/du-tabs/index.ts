import DuTabs from "./index.vue";
import type { TabsProps } from 'element-plus'
import type { ExtractPublicPropTypes } from "vue";


export type DuTabsProps = ExtractPublicPropTypes<Omit<TabsProps, "type">> & {
    /**
      * 只读
      */
    readonly?: boolean;
    /**
     * 控件尺寸
     */
    type?: TabsProps['type'] | "title";
}

export type DuTabsEmit = {
    (e: "update:modelValue", value: TabsProps["modelValue"]): void;
    (e: 'tab-change', v: unknown): void
};

export type DuTabsExpose = {
};

export default DuTabs;