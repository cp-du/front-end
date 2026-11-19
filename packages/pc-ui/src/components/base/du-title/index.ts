import type { ComponentSize } from "element-plus";
import DuTitle from "./index.vue";
export interface DuTitleProps {
  /**
   * 表格组件尺寸
   */
  size?: Exclude<ComponentSize, "">;
  /**
   * 是否有左侧边框
   */
  line?: boolean;
  /**
   * 标题文本
   */
  title?: string;
}

export type DuTitleEmits = {};

export type DuTitleExpose = {};

export type DuTitleState = {};


export default DuTitle;
