// prettier.config.js

/**
 * @type {import('prettier').Config}
 * @see https://www.prettier.cn/docs/options.html
 */

export default {
  /* 指定最大换行长度 */
  printWidth: 120,
  /* 指定缩进宽度 */
  tabWidth: 2,
  /* 使用制表符而不是空格缩进（true: 制表符, false: 空格）*/
  useTabs: false,
  /* 是否使用分号 */
  semi: true,
  /* 是否使用单引号 (true: 单引号, false: 双引号) */
  singleQuote: false,
  /* 在对象字面量中绝对是否将属性名用引号括起来，可选值"<as-needed|conistent|preserve>" */
  quoteProps: "as-needed",
  /* 是否在JSX中使用单引号 (true: 单引号, false: 双引号) */
  jsxSingleQuote: false,
  /* 是否在数组、对象、函数参数等中添加尾随逗号 可选值"<none|es5|all>" */
  trailingComma: "none",
  /* 是否在括号内添加空格 "{ foo: bar }" (true: 添加, false: 不添加空格) */
  bracketSpacing: true,
  /* 将 > 多行元素放在最后一行末尾，而不是单独放在下一行 (true: 放末尾, false: 单独一行) */
  bracketSameLine: true,
  /* (x) => {} 箭头函数参数只有一个时是否要有括号 (avoid: 省略括号, always: 不省略括号) */
  arrowParens: "avoid",
  /* 指定要使用的解析器，不需要写文件开头的 @prettier */
  requirePragma: false,
  /* 是否在文件开头添加 @prettier-ignore, 指定该文件已使用Prettier格式化 (true: 添加, false: 不添加) */
  insertPragma: false,
  /* 用于控制文本是否应该被换行以及如何进行换行 */
  proseWrap: "preserve",
  /* 在html中空格是否是敏感的 "css" - 遵守 CSS 现实属性的默认值， "strict" - 空格被认为是敏感的, "ignore" - 空格被认为是不敏感的 */
  htmlWhitespaceSensitivity: "css",
  /* 是否在vue中缩进script和style标签 (true: 缩进, false: 不缩进) */
  vueIndentScriptAndStyle: false,
  /* 换行符使用lf结尾 可选值"<lf|cr|crlf|auto>" */
  endOfLine: "auto"
};
