import DuRichtext from "./index.vue";
import type { ComponentSize } from 'element-plus'

export type DuRichtextProps = {
  /**
   * 绑定值
   */
  modelValue?: string;
  /**
    * 只读
    */
  readonly?: boolean;
  /**
    * 禁用
    */
  disabled?: boolean;
  /**
   * 控件尺寸
   */
  size?: Exclude<ComponentSize, "">;
}

export type DuRichtextEmit = {
  (e: "update:modelValue", value: DuRichtextProps["modelValue"]): void;
  (e: 'change', v: DuRichtextProps["modelValue"]): void
};

export type DuRichtextExpose = {
};

export default DuRichtext;