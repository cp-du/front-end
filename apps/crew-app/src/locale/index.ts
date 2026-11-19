import type { App } from "vue";
import { createI18n, type I18n } from "vue-i18n";
import { mergeLocaleMessage } from "@du/pc-ui";
import en from "./lang/en";
import zh from "./lang/zh";

const language = window.localStorage.getItem("lang") || "zh";

export const i18n: I18n = createI18n({
  legacy: false, // 使用Composition API，这里必须设置为false
  locale: language === "zh" ? "zh" : "en", // 默认显示语言
  globalInjection: true, // 全局注册$t方法
  messages: {
    // 配置语言对应的文件
    zh,
    en,
  }
});

mergeLocaleMessage(i18n);
// setEmapTranslator((key, ...args) => String(i18n.global.t(key, ...(args as []))));

export async function setupLocale(app: App) {
  app.use(i18n);
}
