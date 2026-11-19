import { defineStore } from 'pinia'
import { i18n } from "@/locale";
import { VxeUI } from 'vxe-table'
import { store } from '@du/utils'
import { space } from '@du/pc-ui'
import { useDark, useToggle } from '@vueuse/core'
const SPACE_MAP = {
    'large': 'comfortable',
    'default': 'default',
    'small': 'compact'
}

export interface GlobalState {
    locale: 'zh' | 'en';
    theme: 'light' | 'dark';
    size: 'large' | 'default' | 'small';
    fontFamily: string;
}
export const useGlobalStore = defineStore('global', {
    state: (): GlobalState => ({
        locale: store.getStorage<'zh' | 'en'>('lang') || 'zh',
        theme: store.getStorage<'light' | 'dark'>('theme') || 'light',
        size: store.getStorage<'large' | 'default' | 'small'>('size') || 'default',
        fontFamily: store.getStorage<string>('fontFamily') || 'Arial',
    }),
    actions: {
        setLocale(locale: GlobalState['locale']) {
            this.locale = locale;
            store.setStorage('lang', locale);
            // @ts-ignore
            i18n.global.locale.value = locale;

        },
        setTheme(theme: GlobalState['theme']) {
            const isDark = useDark()
            console.log('useDark isDark', isDark.value, theme)
            store.setStorage('theme', theme)
            this.theme = theme;
            VxeUI.setTheme(theme)
            store.setStorage('theme', theme);
            useToggle(isDark)()
        },
        setSize(size: GlobalState['size']) {
            this.size = size;
            store.setStorage('size', size);
            const key = SPACE_MAP[size] as keyof typeof space
            const vars = space[key]
            for (let key in vars) {
                document.documentElement.style.setProperty(key, vars[key as keyof typeof vars])
            }
        },
        setFontFamily(fontFamily: string) {
            document.documentElement.style.fontFamily = `${fontFamily}, system-ui, sans-serif`;
            document.documentElement.style.setProperty('--vxe-ui-font-family', fontFamily);
            this.fontFamily = fontFamily;
            store.setStorage('fontFamily', fontFamily);
        }
    },
    persist: true

});
