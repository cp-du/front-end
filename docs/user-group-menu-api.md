# 用户组菜单权限接口

本文对应 `artifacts/user-group-menus/backend.patch` 中的后端实现。补丁尚未由本会话应用到后端目录，数据库迁移也尚未执行。

## 通用约定

- 接口前缀：`/api/system/user-groups`。
- 请求头：`Authorization: Bearer <accessToken>`。
- 保存请求头：`Content-Type: application/json`。
- 用户组 `id` 为正整数；菜单 ID 为 UUID 字符串。
- 成功响应：`{ "success": true, "data": ... }`。
- 查询需要 `system:group:read`，保存需要 `system:group:write`；`admin` 角色沿用现有放行逻辑。

| 功能 | 方法 | 路径 |
| --- | --- | --- |
| 查询权限树及已绑定菜单 | GET | `/api/system/user-groups/:id/menus/tree` |
| 全量保存菜单绑定 | PUT | `/api/system/user-groups/:id/menus` |

## 1. 查询菜单权限树

```http
GET /api/system/user-groups/1/menus/tree
Authorization: Bearer <accessToken>
```

无需请求体，无分页参数。返回完整菜单树，包括未绑定及隐藏的菜单，按菜单排序值和 ID 排序。

成功响应 `200` 示例：

```json
{
  "success": true,
  "data": {
    "groupId": 1,
    "rows": [
      {
        "id": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
        "parentId": null,
        "name": "系统管理",
        "path": "/system",
        "appCode": "system",
        "menuType": "menu",
        "menuType_name": "菜单",
        "component": null,
        "icon": null,
        "permissionCode": null,
        "sortOrder": 1,
        "visible": true,
        "children": [
          {
            "id": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
            "parentId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
            "name": "用户组管理",
            "path": "/permissions",
            "appCode": "system",
            "menuType": "menu",
            "menuType_name": "菜单",
            "component": "permissions/index",
            "icon": null,
            "permissionCode": "system:group:read",
            "sortOrder": 1,
            "visible": true,
            "children": []
          }
        ]
      }
    ],
    "checkedKeys": ["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2"]
  }
}
```

| 响应字段 | 类型 | 说明 |
| --- | --- | --- |
| `data.groupId` | number | 当前用户组 ID |
| `data.rows` | MenuNode[] | 完整菜单树，非仅已绑定节点 |
| `data.checkedKeys` | string[] | 该用户组实际绑定的菜单 UUID，按 ID 排序 |
| `rows[].id` | string | 节点唯一标识，作为树的 `node-key` |
| `rows[].parentId` | string 或 null | 父菜单 UUID，根节点为 null |
| `rows[].name` | string | 节点显示名称 |
| `rows[].children` | MenuNode[] | 子节点，结构同父节点；叶子为 `[]` |
| `rows[].path` | string | 菜单路径 |
| `rows[].appCode` | string | 所属应用编码 |
| `rows[].menuType` | string | 菜单类型编码 |
| `rows[].menuType_name` | string 或 null | 菜单类型名称 |
| `rows[].component` | string 或 null | 页面组件 |
| `rows[].icon` | string 或 null | 图标 |
| `rows[].permissionCode` | string 或 null | 菜单配置的权限编码 |
| `rows[].sortOrder` | number | 排序值 |
| `rows[].visible` | boolean | 菜单是否可见，与是否绑定独立 |

用户组没有绑定时，`checkedKeys: []`，仍返回完整菜单树。系统没有菜单时，`rows` 和 `checkedKeys` 都为 `[]`。用户组不存在时返回 `404`。

## 2. 保存菜单绑定

```http
PUT /api/system/user-groups/1/menus
Authorization: Bearer <accessToken>
Content-Type: application/json
```

请求体：

```json
{
  "menuIds": [
    "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
    "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2"
  ]
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `menuIds` | string[] | 是 | 最终绑定的菜单 UUID 集合，0–500 项；不接受额外字段 |

成功响应 `200`：

```json
{
  "success": true,
  "data": {
    "groupId": 1,
    "menuIds": [
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2"
    ],
    "updated": true
  }
}
```

保存规则：

- 全量替换当前组的绑定，每次提交最终完整集合。
- 清空绑定传 `{ "menuIds": [] }`；省略 `menuIds` 会报错。
- UUID 自动转为小写、去重、按 ID 排序；重复提交结果一致。
- 父子节点独立绑定，不自动添加祖先或子节点。
- 用户组或任一菜单不存在时整次保存失败，原绑定保留。
- 数据写入使用事务，同组保存串行执行，不修改其他用户组的绑定。

## 3. 错误响应

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "用户组不存在"
  }
}
```

| HTTP 状态码 | code | 场景 |
| --- | --- | --- |
| 400 | BAD_REQUEST | 非法用户组 ID；缺少 `menuIds`；非法 UUID；超过 500 项；额外请求字段 |
| 401 | UNAUTHORIZED | 未登录或令牌无效 |
| 403 | FORBIDDEN | 缺少查询或保存权限 |
| 404 | NOT_FOUND | 用户组不存在，或保存时包含不存在的菜单 |
| 500 | INTERNAL_ERROR | 数据库等内部异常，保存事务回滚 |

参数校验错误可能额外返回 `error.details`。

## 4. 前端对接

1. 选中用户组后，用其 ID 查询权限树。
2. 将 `data.rows` 绑定为树数据，节点键使用 `id`，名称使用 `name`，子节点字段使用 `children`。
3. 树渲染完成后，用 `data.checkedKeys` 回显选中状态。
4. 保存时将最终选中的 UUID 集合放入 `menuIds`，提交到对应用户组的保存接口。
5. 快速切换用户组时忽略旧请求响应，避免把上一组的勾选状态带到当前组。

Element Plus Tree 可使用 `check-strictly` 保持父子独立选择，通过 `setCheckedKeys()` 回显、`getCheckedKeys()` 读取选择。如需联动勾选，由前端明确计算最终提交的节点集合；不要直接将半选父节点当作全选父节点回显，否则可能勾选原本未绑定的子节点。

## 5. 生效范围与部署

这两个接口维护用户组与菜单的绑定配置。本次补丁未修改现有角色鉴权或 `/api/system/menus/mine` 的菜单聚合逻辑，保存后不会自动改变用户的运行时权限。

启用接口前需应用后端补丁，并执行 `database/migrations/007_user_group_menus.sql`。迁移创建 `user_group_menus`，删除组或菜单时级联删除对应绑定。

完整 [OpenAPI 文档](../artifacts/user-group-menus/files/docs/openapi.yaml) 和 [补丁应用说明](../artifacts/user-group-menus/README.md) 已一并提供。
