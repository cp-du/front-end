import type { I18n } from "vue-i18n";

import zh from "./lang/zh";
import en from "./lang/en";


export const localeMessages = {
  zh,
  en,
} as const;

export type LocaleMessages = keyof typeof localeMessages;

export type EmapTranslate = (key: string, ...args: unknown[]) => string;

// let emapTranslate: EmapTranslate = key => key;



export function mergeLocaleMessage(i18n: I18n) {
  (Object.keys(localeMessages) as LocaleMessages[]).forEach(locale => {
    i18n.global.mergeLocaleMessage(locale, localeMessages[locale]);
  });
}

// export function setEmapTranslator(translator: EmapTranslate) {
//   emapTranslate = translator;
// }

// export function translateEmapMessage(key: string, ...args: unknown[]) {
//   return emapTranslate(key, ...args);
// }
