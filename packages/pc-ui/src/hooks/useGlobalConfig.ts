import { computed, inject, toValue, watch, type MaybeRefOrGetter } from "vue"
import type { ComponentSize } from "element-plus";

export type ConfigProviderProps = {
    locale?: string;
    size?: ComponentSize;
    appCode: string;
    appName: string;
    standalone?: boolean;
}

export type UseGlobalConfigProps = {
    size?: MaybeRefOrGetter<ComponentSize | undefined>;
}

export function useGlobalConfig(props: UseGlobalConfigProps) {
    const config = inject<ConfigProviderProps>("du-global-config");
    const configSize = computed(() => config?.size);


    const size = computed<ComponentSize>(() => {
        const currentSize = toValue(props.size);

        if (currentSize) {
            return currentSize;
        }

        if (configSize.value) {
            return configSize.value;
        }

        return 'default';
    });
    return {
        size,
        ...config
    };
}
