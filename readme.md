只修改 app：

pnpm --filter system-app dev


修改 package，并需要在 app 中联调：

pnpm exec turbo dev --filter=system-app...

这里的 ... 表示把 pc-ui 依赖的 pc 包也启动起来。前提是 pc 中有监听构建脚本.

也可以开两个终端：

# 终端一
pnpm --filter system-app dev

# 终端二
pnpm --filter pc-ui dev