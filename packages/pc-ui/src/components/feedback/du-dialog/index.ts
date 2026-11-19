import DuDialog from "./index.vue";
import type { DialogPropsPublic } from 'element-plus'

export type DuDialogProps = DialogPropsPublic & {
    confirmButtonAble?: boolean;
    cancelButtonAble?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButton?: {
        enable?: boolean;
        text?: string;
        type?: string;
    }
    cancelButton?: {
        enable?: boolean;
        text?: string;
        type?: string;
    }

}

export type DuDialogEmit = {
    (e: 'update:modelValue', value: DuDialogProps['modelValue']): void;
    (e: 'confirm', done: () => void): void;
    (e: 'cancel'): void;
};

export type DuDialogExpose = {
    open: () => void;
    close: () => void;
};

export default DuDialog;