# 用户组接口

接口前缀：`/api/system/user-groups`。请求头携带 `Authorization: Bearer <accessToken>`。
查询需要 `system:group:read` 权限，新增、修改、删除需要 `system:group:write` 权限；
`admin` 角色始终放行。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/system/user-groups` | 查询全部用户组，按 ID 倒序，不分页 |
| GET | `/api/system/user-groups/:id` | 查询详情 |
| POST | `/api/system/user-groups/create` | 新增，成功返回 HTTP 201 |
| PATCH | `/api/system/user-groups/:id` | 局部修改，至少提供一个可修改字段 |
| DELETE | `/api/system/user-groups/:id` | 删除 |
| POST | `/api/system/user-groups/users/query` | 分页查询指定用户组绑定的用户，ID 通过请求体 `params.id` 传递 |
| POST | `/api/system/user-groups/:id/users` | 批量添加用户到该组 |
| DELETE | `/api/system/user-groups/:id/users/:userId` | 解除单个用户绑定 |
| GET | `/api/system/user-groups/:id/menus/tree` | 完整菜单树及已绑定菜单 ID |
| PUT | `/api/system/user-groups/:id/menus` | 全量保存菜单绑定，支持清空 |
| POST | `/api/system/users/query` | 分页查询所有用户，需要 `system:role:read` 权限 |

其他成功请求返回 HTTP 200。`id` 为服务端生成的正整数。

## 新增与修改字段

| 字段 | 类型 | 新增必填 | 说明 |
| --- | --- | --- | --- |
| code | string | 是 | 唯一编码，1–50 字符，以英文字母开头，允许字母、数字、下划线和连字符；不区分大小写 |
| name | string | 是 | 用户组名称，1–100 字符 |
| description | string 或 null | 否 | 描述，最多 255 字符；省略默认为 null，修改时可传 null 清空 |
| status | string | 否 | enabled 或 disabled，新增默认 enabled；修改时省略则保持原值 |

新增请求示例：

```json
{
  "code": "crew_team",
  "name": "船员组",
  "description": "船员管理使用的用户组",
  "status": "enabled"
}
```

新增、修改和详情接口返回完整记录：

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "crew_team",
    "name": "船员组",
    "description": "船员管理使用的用户组",
    "status": "enabled",
    "createdAt": "2026-10-23T00:00:00.000Z",
    "updatedAt": "2026-10-23T00:00:00.000Z"
  }
}
```

列表的 `data` 直接为上述记录数组，无数据返回 `[]`；不接受分页参数控制结果数量。
删除响应为 `{ "success": true, "data": { "id": 1, "deleted": true } }`。

参数非法返回 `400 BAD_REQUEST`，未登录返回 `401 UNAUTHORIZED`，权限不足返回
`403 FORBIDDEN`，用户组不存在返回 `404 NOT_FOUND`，编码重复返回 `409 CONFLICT`。

## 分页查询绑定用户

`POST /api/system/user-groups/users/query`，需要 `system:group:read` 权限。
用户组 ID 通过请求体中的 `params.id` 传递，必填，支持正整数或正整数字符串。请求体示例：

```json
{ "params": { "id": 1 }, "pageIndex": 1, "pageSize": 20 }
```

`pageIndex` 默认为 1，必须为正整数；`pageSize` 默认为 20，范围 1–100。
传 `{ "params": { "id": 1 } }` 使用默认分页。按用户 ID 倒序查询，包含已停用但仍绑定的用户。
缺少 `params.id` 或 ID 非法返回 `400 BAD_REQUEST`。

`du-table-pro` 配置：

```vue
<du-table-pro v-if="currentUserGroup" :key="currentUserGroup.id" id="id"
  model-name="userbo" url="/api/system/user-groups/users/query"
  :params="{ id: String(currentUserGroup.id) }" :searchable="false" />
```

```json
{
  "success": true,
  "data": {
    "rows": [
      {
        "id": 42,
        "username": "crew42",
        "email": "crew42@example.com",
        "displayName": "船员42",
        "status": "active",
        "lastLoginAt": null,
        "createdAt": "2026-10-23T00:00:00.000Z",
        "boundAt": "2026-10-23T01:00:00.000Z"
      }
    ],
    "total": 1,
    "pageIndex": 1,
    "pageSize": 20
  }
}
```

`rows[].id` 是用户 ID，`createdAt` 是账号创建时间，`boundAt` 是绑定时间。
用户组无绑定用户时 `rows: []`、`total: 0`；页码超出范围时返回空数组并保留实际总数。
用户组不存在返回 `404 NOT_FOUND`。

## 批量添加用户

`POST /api/system/user-groups/:id/users`，需要 `system:group:write` 权限。
`id` 是用户组 ID，请求体中 `userIds` 是用户 ID 数组，要求 1–500 项，每项为正整数：

```json
{ "userIds": [41, 42, 43] }
```

重复 ID 会去重，已绑定用户会跳过，已有绑定时间保持不变。启用和停用账号均可添加。
成功返回 `200`，例如 42 已绑定时：

```json
{
  "success": true,
  "data": {
    "groupId": 1,
    "userIds": [41, 42, 43],
    "addedCount": 2,
    "existingCount": 1
  }
}
```

`userIds` 为去重后升序排列的 ID，`addedCount` 是新增绑定数，`existingCount` 是已绑定数。
批量添加使用事务：用户组或任一用户不存在时返回 `404 NOT_FOUND`，本次请求不新增任何绑定；
重复提交全部已绑定的用户也返回成功，`addedCount` 为 0。

## 分页查询所有用户

`POST /api/system/users/query`，需要 `system:role:read` 权限。请求体：

```json
{ "pageIndex": 1, "pageSize": 20 }
```

分页默认值和上限与绑定用户查询一致，`{}` 使用默认值。查询所有用户，包含停用账号，
按用户 ID 倒序。此接口可用于添加成员前选择用户；用户组维护人员还需具备上述用户查询权限。

响应为 `{ "success": true, "data": { "rows": [], "total": 0, "pageIndex": 1, "pageSize": 20 } }`。
`rows` 每项包含 `id`、`username`、`email`、`displayName`、`status`、`lastLoginAt`、
`createdAt` 和 `roles`（每个角色包含 `id`、`code`、`name`）；不返回密码或令牌。
无角色时 `roles: []`；无用户或超出页码时 `rows: []`，保留实际总数。

## 解除用户绑定

`DELETE /api/system/user-groups/:id/users/:userId`，需要 `system:group:write` 权限，
无需请求体。两个路径参数均为正整数，分别表示用户组 ID 和用户 ID。

成功响应 `200`：

```json
{ "success": true, "data": { "groupId": 1, "userId": 42, "deleted": true } }
```

仅删除指定组与用户的关联，保留用户账号、角色和其他组的绑定。
用户组不存在，或用户未绑定到该组（包括重复解除绑定），均返回 `404 NOT_FOUND`。

## 用户组字段模型

成员列表使用用户信息模型 `userbo`，读取接口为 `GET /api/system/model/userbo`。
该模型包含用户名、姓名、邮箱、账号状态、最后登录时间和创建时间，用户 ID 隐藏。
完整说明见 [页面模型接口文档](model-api.md)。

模型种子文件：`database/seeds/system-usergroupbo.model.json`，应用编码为 `system`，
模型名称为 `usergroupbo`。运行 `npm run db:init` 会幂等创建或更新该启用模型。

- 运行时控件数组：`GET /api/system/model/usergroupbo`
- 完整模型详情：`GET /api/system/model/usergroupbo/detail`

字段包括 `id`、`code`、`name`、`description`、`status`、`createdAt`、`updatedAt`。
ID 在表格和表单中隐藏；创建时间、更新时间只读且不参与表单编辑。编码、名称和状态为
必填项，状态选项使用接口实际值 `enabled` / `disabled`。新增表单可初始化
`status: 'enabled'`。当前列表接口返回全部记录、不处理查询条件，因此模型隐藏搜索控件。

## 数据库初始化

运行 `npm run db:init` 应用 `database/migrations/005_user_groups.sql`、
`database/migrations/006_user_group_users.sql` 并初始化用户组权限。
该命令沿用项目现有初始化流程，也会更新基础种子及管理员配置。
`user_group_users` 使用 `(group_id, user_id)` 联合主键，避免重复绑定；删除用户组或用户时
级联清理对应关联。初始化不会自动绑定用户，可通过批量添加接口维护成员。

## 查询用户组菜单权限树

`GET /api/system/user-groups/:id/menus/tree`，需要 `system:group:read` 权限。
`id` 为用户组正整数 ID，无需请求体。

```json
{
  "success": true,
  "data": {
    "groupId": 1,
    "rows": [],
    "checkedKeys": []
  }
}
```

以上仅展示响应结构；实际 `rows` 为完整菜单树（包含未绑定、隐藏菜单，不分页），
节点字段与菜单查询一致，使用 `id`、`name`、`children` 展示树。
`checkedKeys` 为当前用户组实际绑定的菜单 UUID 数组，未绑定时为空数组。
无菜单时 `rows` 和 `checkedKeys` 均为空数组；用户组不存在返回 `404 NOT_FOUND`。

## 保存用户组菜单权限

`PUT /api/system/user-groups/:id/menus`，需要 `system:group:write` 权限。
请求体必须明确提供 `menuIds`，仅接受该字段，最多 500 项；每项为菜单 UUID：

```json
{ "menuIds": ["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1"] }
```

成功响应：

```json
{
  "success": true,
  "data": {
    "groupId": 1,
    "menuIds": ["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1"],
    "updated": true
  }
}
```

全量替换指定用户组的绑定，`{ "menuIds": [] }` 清空全部绑定。
UUID 统一为小写、去重并按 ID 排序，重复保存结果一致。
用户组或任一菜单不存在返回 `404 NOT_FOUND`；缺少字段、非法 UUID、超出数量上限
返回 `400 BAD_REQUEST`。保存使用事务并锁定用户组，发生错误时保留原绑定，
同组并发保存串行执行，其他用户组不受影响。

父子节点按提交 ID 独立绑定，不会自动补全祖先或授予所有子节点。
前端如使用 Element Plus Tree，可使用 `node-key="id"` 和 `check-strictly`，
通过 `checkedKeys` 回显、`getCheckedKeys()` 提交，避免勾选父节点导致未授权子节点被自动选中。
如果产品需要联动勾选，应由前端明确计算并提交最终菜单 ID 集合。

这两个接口维护用户组与菜单的绑定配置；现有登录权限仍由角色权限计算，
`/api/system/menus/mine` 仍按角色菜单过滤，本次未调整运行时鉴权与菜单聚合逻辑。

### 菜单绑定表迁移

新增 `database/migrations/007_user_group_menus.sql`，创建 `user_group_menus`。
联合主键避免重复绑定，删除组或菜单时级联清理绑定。
已有数据库可单独执行该迁移；`npm run db:init` 也已纳入迁移，但同时会执行原有的
种子数据及管理员初始化流程。迁移需在启用新接口前应用。
