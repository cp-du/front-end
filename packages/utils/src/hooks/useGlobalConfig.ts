import { computed, inject, toValue, type MaybeRefOrGetter } from "vue"
import type { ComponentSize } from "element-plus";

export type ConfigProviderProps = {
    locale?: string;
    size?: ComponentSize;
    appCode: string;
    appName: string;
    standalone?: boolean;
}

export function useGlobalConfig(size?: MaybeRefOrGetter<ComponentSize | undefined>) {
    const config = inject<ConfigProviderProps>("du-global-config");

    const comSize = computed<Exclude<ComponentSize, "">>(() => {
        const currentSize = toValue(size);

        if (currentSize) {
            return currentSize;
        }

        if (config?.size) {
            return config.size;
        }

        return 'default';
    });
    return {
        comSize,
        ...config
    };
}
