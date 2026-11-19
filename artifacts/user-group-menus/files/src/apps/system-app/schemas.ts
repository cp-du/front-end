import { z } from 'zod';

const queryValueSchema = z.union([
  z.string().max(5000),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.union([z.string().max(5000), z.number(), z.boolean()])).max(100)
]);

const menuQuerySettingItemSchema = z.object({
  name: z.string().trim().min(1).max(100),
  value: queryValueSchema.optional(),
  value_display: z.string().max(5000).optional(),
  caption: z.string().max(100).optional(),
  linkOpt: z.enum(['and', 'or']).default('and'),
  builder: z.enum(['include', 'm_value_equal', 'equal']),
  builder_display: z.string().max(100).optional()
});

const menuQuerySettingGroupSchema = z.array(menuQuerySettingItemSchema).min(1).max(100);

const tableQuerySchema = z.object({
  pageIndex: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  params: z.record(z.string(), queryValueSchema).optional(),
  querySetting: z.array(
    z.union([menuQuerySettingItemSchema, menuQuerySettingGroupSchema])
  ).max(100).default([])
});

export const queryMenuSchema = tableQuerySchema;
export const queryDictionarySchema = tableQuerySchema;
export const queryDictionaryItemSchema = tableQuerySchema.extend({
  params: z.object({
    dictionaryId: z.coerce.number().int().positive()
  }).catchall(queryValueSchema)
});

const dictionaryStatusSchema = z.union([
  z.literal('1'), z.literal('0'), z.literal('enabled'), z.literal('disabled')
]).transform((value): 'enabled' | 'disabled' =>
  value === '1' || value === 'enabled' ? 'enabled' : 'disabled'
);

const editableSchema = z.union([
  z.boolean(), z.literal(1), z.literal(0), z.literal('1'), z.literal('0')
]).transform((value) => value === true || value === 1 || value === '1');

export const dictionarySchema = z.object({
  code: z.string().trim().min(1).max(80).regex(/^[a-zA-Z][a-zA-Z0-9_]*$/),
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(255).nullable().optional(),
  editable: editableSchema.default(true),
  status: dictionaryStatusSchema.default('enabled')
});
export const updateDictionarySchema = dictionarySchema.partial();

export const dictionaryItemSchema = z.object({
  code: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(100),
  enName: z.string().trim().max(100).nullable().optional(),
  status: dictionaryStatusSchema.default('enabled')
});
export const createDictionaryItemSchema = dictionaryItemSchema.extend({
  dictionaryId: z.coerce.number().int().positive()
});
export const updateDictionaryItemSchema = dictionaryItemSchema.partial();

export const roleSchema = z.object({
  code: z.string().trim().min(2).max(50).regex(/^[a-z][a-z0-9_-]*$/),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(255).nullable().optional()
});
export const updateRoleSchema = roleSchema.omit({ code: true }).partial();
export const userGroupSchema = z.object({
  code: z.string().trim().min(1).max(50).regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/),
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(255).nullable().optional(),
  status: z.enum(['enabled', 'disabled']).default('enabled')
});
export const updateUserGroupSchema = userGroupSchema.partial().extend({
  status: z.enum(['enabled', 'disabled']).optional()
}).refine(
  (input) => Object.values(input).some((value) => value !== undefined),
  { message: '至少提供一个需要修改的字段' }
);
export type UserGroupInput = z.infer<typeof userGroupSchema>;
const userPaginationSchema = tableQuerySchema.pick({ pageIndex: true, pageSize: true }).refine(
  (input) => Number.isSafeInteger((input.pageIndex - 1) * input.pageSize),
  { message: '分页偏移量超出允许范围', path: ['pageIndex'] }
);
export const queryUserGroupUsersSchema = userPaginationSchema.safeExtend({
  params: z.object({
    id: z.union([z.number(), z.string().regex(/^[1-9][0-9]*$/)])
      .transform(Number).pipe(z.number().int().positive())
  })
});
export const queryUsersSchema = userPaginationSchema;
export type QueryUsersInput = z.infer<typeof queryUsersSchema>;
export const addUserGroupUsersSchema = z.object({
  userIds: z.array(z.number().int().positive()).min(1).max(500)
});
export type QueryUserGroupUsersInput = z.infer<typeof queryUserGroupUsersSchema>;
export const idListSchema = z.object({ ids: z.array(z.number().int().positive()).max(500) });
const uuidSchema = z.uuid().transform((value) => value.toLowerCase());
export const menuIdListSchema = z.object({ ids: z.array(uuidSchema).max(500) });
export const saveUserGroupMenusSchema = z.object({ menuIds: z.array(uuidSchema).max(500) }).strict();
export const userStatusSchema = z.object({ status: z.enum(['active', 'disabled']) });

export const menuSchema = z.object({
  parentId: uuidSchema.nullable().optional(),
  name: z.string().trim().min(1).max(100),
  path: z.string().trim().startsWith('/').max(255),
  appCode: z.string().trim().min(1).max(50),
  menuType: z.string().trim().min(1).max(50).default('menu'),
  component: z.string().trim().max(255).nullable().optional(),
  icon: z.string().trim().max(80).nullable().optional(),
  permissionCode: z.string().trim().max(100).nullable().optional(),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true)
});
export const updateMenuSchema = menuSchema.partial();

export type QueryMenuInput = z.infer<typeof queryMenuSchema>;
export type MenuQuerySettingItem = z.infer<typeof menuQuerySettingItemSchema>;
export type TableQueryInput = z.infer<typeof tableQuerySchema>;
export type TableQuerySettingItem = z.infer<typeof menuQuerySettingItemSchema>;
export type QueryDictionaryItemInput = z.infer<typeof queryDictionaryItemSchema>;
export type DictionaryInput = z.infer<typeof dictionarySchema>;
export type DictionaryItemInput = z.infer<typeof dictionaryItemSchema>;
export type CreateDictionaryItemInput = z.infer<typeof createDictionaryItemSchema>;
