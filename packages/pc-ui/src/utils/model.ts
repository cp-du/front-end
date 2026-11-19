import { Control, ControlMode } from "@/typings/model"

/**
 * 获取控件在指定使用场景下的属性值
 * @param control 控件对象
 * @param property 控件的属性名称
 * @param mode 控件的使用场景，可选值为 "table"、"form"、"search" 或 "card"
 * @returns 控件在指定使用场景下的属性值，如果未指定使用场景或该属性在指定使用场景下不存在，则返回控件的默认属性值
 */
export function getControlProperty<T extends Control>(control: T, property: keyof T, mode?: ControlMode): T[keyof T] {
    const modeProperty = `${mode}.${String(property)}` as keyof T;
    if (control.hasOwnProperty(modeProperty)) return control[modeProperty];
    return control[property];
}