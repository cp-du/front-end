import DuIconSelect from './index.vue';

export type DuIconSelectProps = {
    modelValue: string;
    disabled?: boolean;
    readonly?: boolean;
    size?: string;
    clearable?: boolean;
    multiple?: boolean;

};

export type DuIconSelectEmits = {
    (e: 'update:modelValue', value: DuIconSelectProps['modelValue']): void
    (e: 'change', value: DuIconSelectProps['modelValue']): void
}

export default DuIconSelect;