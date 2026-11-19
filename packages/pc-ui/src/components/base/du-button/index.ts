import DuButton from "./index.vue";
import type { ButtonProps } from 'element-plus'

export type ChildrenButton = Omit<DuButtonProps, 'name'> & Required<Pick<DuButtonProps, 'name'>>
export type DuButtonProps = ButtonProps & {
    /**
     * 按钮名称
     */
    name?: string;
    /**
     * 子按钮
     */
    children?: ChildrenButton[];
    /**
     * 是否阻止原生点击事件冒泡，默认不阻止
     */
    stopPropagation?: boolean;
}

export type DuButtonEmit = {
    (e: "click", btn?: ChildrenButton): void
};

export type DuButtonExpose = {
};

export default DuButton;
