import type { ExtractPublicPropTypes } from "vue";
import type { TabPaneProps } from "element-plus";
import DuTabPane from "./index.vue";

export type DuTabPaneProps = ExtractPublicPropTypes<TabPaneProps> & {
  permissionCode?: string;
};

export type DuTabPaneEmits = {};
export type DuTabPaneExpose = {};
export type DuTabPaneState = {};

export default DuTabPane;;
