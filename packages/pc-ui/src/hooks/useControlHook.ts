
import type { Control, ControlType } from '@du/typings';
type Props<T> = {
    control: Control;
    mode: "table" | "form" | "search" | "card";
    widgetProps: T;
}

export function getControlProperty<T = unknown>(
    control: Control,
    prop: string,
    mode: "table" | "form" | "search" | "card"
): T {
    const key = `${mode}.${prop}` as keyof Control;
    if (control.hasOwnProperty(key)) {
        return control[key] as T;
    }
    return control[prop as keyof Control] as T;
}

export function useControlHook<T extends Record<string, any>>(props: Props<T>): { type: ControlType; disabled: boolean; readonly: boolean } {
    const { control, mode, widgetProps } = props;
    return {
        type: getControlProperty(control, 'type', mode) || 'text',
        disabled: widgetProps.disabled || getControlProperty(control, 'disabled', mode) || false,
        readonly: widgetProps.readonly || getControlProperty(control, 'readonly', mode) || false,
    }
}