import type { ComponentSize } from 'element-plus';
import DuProvider from "./index.vue";
export type DuProviderProps = {
    locale: 'zh' | 'en';
    theme: 'light' | 'dark';
    size: 'large' | 'default' | 'small';
    appCode: string;
    appName: string;
    standalone?: boolean;
    setLocale: (locale: 'zh' | 'en') => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setSize: (size: 'large' | 'default' | 'small') => void;
}

export default DuProvider;