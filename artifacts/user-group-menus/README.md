# 用户组菜单权限接口后端补丁

本目录保存可应用到 `/Users/cpdu/Documents/workspace/du/back-end` 的后端改动。由于当前会话只有前端目录写权限，后端原目录尚未修改。前端源码未修改。

## 应用

在 `/Users/cpdu/Documents/workspace/du/back-end` 中执行：

```sh
git apply --check ../fornt-end/artifacts/user-group-menus/backend.patch
git apply ../fornt-end/artifacts/user-group-menus/backend.patch
npm run typecheck
npm test
```

然后对实际数据库执行 `database/migrations/007_user_group_menus.sql`。迁移尚未在真实数据库执行。
`npm run db:init` 也包含新迁移，但会同时执行现有种子数据与管理员初始化。

## 接口

独立对接文档：[用户组菜单权限接口](../../docs/user-group-menu-api.md)。

- `GET /api/system/user-groups/:id/menus/tree`：`data = { groupId, rows, checkedKeys }`。
- `PUT /api/system/user-groups/:id/menus`：请求 `{ menuIds: string[] }`；响应 `data = { groupId, menuIds, updated: true }`。
- 保存全量替换，空数组清空，最多 500 项 UUID，大小写规范化、去重、事务回滚。
- 查询/保存分别需要 `system:group:read` / `system:group:write`；管理员沿用现有放行逻辑。
- 父子节点独立绑定，不隐式补全。详情见 `files/docs/user-group-api.md`。
- 此补丁仅维护绑定配置，不修改现有角色鉴权或 `/menus/mine` 的菜单聚合逻辑。

## 验证

在后端源码的临时副本运行类型检查，通过。
全量测试共 54 项，50 项通过，4 个 HTTP 测试因沙箱禁止监听本地端口（`listen EPERM`）无法执行，包括 1 个新增 HTTP 测试。
新增的数据层测试全部通过，覆盖完整树、隐藏菜单、超过 20 个根节点、空结果、不存在的组/菜单、清空、重复提交、跨组隔离、失败回滚。
