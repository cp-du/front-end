import { Router } from 'express';
import { authenticate, requirePermission } from '../../shared/auth/middleware.js';
import { asyncHandler } from '../../shared/http/async-handler.js';
import { ok } from '../../shared/http/respond.js';
import { parsePositiveInt, parseStringParam, parseUuid, validateBody } from '../../shared/http/validate.js';
import * as access from './access-service.js';
import * as dictionaries from './dictionary-service.js';
import * as menus from './menu-service.js';
import * as userGroups from './user-group-service.js';
import * as userGroupMenus from './user-group-menu-service.js';
import {
  createDictionaryItemSchema, dictionarySchema, idListSchema, menuIdListSchema, menuSchema,
  roleSchema, queryDictionaryItemSchema, queryDictionarySchema, queryMenuSchema,
  updateDictionaryItemSchema, updateDictionarySchema, updateMenuSchema, updateRoleSchema,
  userStatusSchema, userGroupSchema, updateUserGroupSchema, queryUserGroupUsersSchema,
  addUserGroupUsersSchema, queryUsersSchema, saveUserGroupMenusSchema
} from './schemas.js';

export function createSystemApp() {
  const router = Router();

  router.get('/public/dictionaries/:code/items', asyncHandler(async (request, response) => {
    ok(response, await dictionaries.getItemsByCode(parseStringParam(request.params.code!, 'code'), true));
  }));

  router.use(authenticate);

  router.get('/menus/mine', asyncHandler(async (request, response) => {
    ok(response, await menus.listMyMenus(request.auth!.id, request.auth!.roles.includes('admin')));
  }));

  router.get('/dictionaries', requirePermission('system:dict:read'), asyncHandler(async (_request, response) => {
    ok(response, await dictionaries.listDictionaries());
  }));
  router.post('/dictionaries', requirePermission('system:dict:read'), validateBody(queryDictionarySchema), asyncHandler(async (request, response) => {
    ok(response, await dictionaries.queryDictionaries(request.body));
  }));
  router.get('/dictionaries/:code/items', requirePermission('system:dict:read'), asyncHandler(async (request, response) => {
    ok(response, await dictionaries.getItemsByCode(parseStringParam(request.params.code!, 'code')));
  }));
  router.get('/dictionaries/:id', requirePermission('system:dict:read'), asyncHandler(async (request, response) => {
    ok(response, await dictionaries.getDictionary(parsePositiveInt(request.params.id!)));
  }));
  router.post('/dictionaries/create', requirePermission('system:dict:write'), validateBody(dictionarySchema), asyncHandler(async (request, response) => {
    ok(response, await dictionaries.createDictionary(request.body), 201);
  }));
  router.patch('/dictionaries/:id', requirePermission('system:dict:write'), validateBody(updateDictionarySchema), asyncHandler(async (request, response) => {
    ok(response, await dictionaries.updateDictionary(parsePositiveInt(request.params.id!), request.body));
  }));
  router.delete('/dictionaries/:id', requirePermission('system:dict:write'), asyncHandler(async (request, response) => {
    await dictionaries.deleteDictionary(parsePositiveInt(request.params.id!));
    ok(response, { deleted: true });
  }));
  router.post('/dictionary-items', requirePermission('system:dict:read'), validateBody(queryDictionaryItemSchema), asyncHandler(async (request, response) => {
    ok(response, await dictionaries.queryDictionaryItems(request.body));
  }));
  router.post('/dictionary-items/create', requirePermission('system:dict:write'), validateBody(createDictionaryItemSchema), asyncHandler(async (request, response) => {
    ok(response, await dictionaries.createItem(request.body), 201);
  }));
  router.get('/dictionary-items/:id', requirePermission('system:dict:read'), asyncHandler(async (request, response) => {
    ok(response, await dictionaries.getDictionaryItem(parsePositiveInt(request.params.id!)));
  }));
  router.patch('/dictionary-items/:id', requirePermission('system:dict:write'), validateBody(updateDictionaryItemSchema), asyncHandler(async (request, response) => {
    ok(response, await dictionaries.updateItem(parsePositiveInt(request.params.id!), request.body));
  }));
  router.delete('/dictionary-items/:id', requirePermission('system:dict:write'), asyncHandler(async (request, response) => {
    await dictionaries.deleteItem(parsePositiveInt(request.params.id!));
    ok(response, { deleted: true });
  }));

  router.get('/permissions', requirePermission('system:role:read'), asyncHandler(async (_request, response) => {
    ok(response, await access.listPermissions());
  }));
  router.get('/roles', requirePermission('system:role:read'), asyncHandler(async (_request, response) => {
    ok(response, await access.listRoles());
  }));
  router.post('/roles', requirePermission('system:role:write'), validateBody(roleSchema), asyncHandler(async (request, response) => {
    ok(response, await access.createRole(request.body), 201);
  }));
  router.patch('/roles/:id', requirePermission('system:role:write'), validateBody(updateRoleSchema), asyncHandler(async (request, response) => {
    ok(response, await access.updateRole(parsePositiveInt(request.params.id!), request.body));
  }));
  router.delete('/roles/:id', requirePermission('system:role:write'), asyncHandler(async (request, response) => {
    await access.deleteRole(parsePositiveInt(request.params.id!));
    ok(response, { deleted: true });
  }));
  router.put('/roles/:id/permissions', requirePermission('system:role:write'), validateBody(idListSchema), asyncHandler(async (request, response) => {
    await access.replaceRolePermissions(parsePositiveInt(request.params.id!), request.body.ids);
    ok(response, { updated: true });
  }));
  router.put('/roles/:id/menus', requirePermission('system:role:write'), validateBody(menuIdListSchema), asyncHandler(async (request, response) => {
    await access.replaceRoleMenus(parsePositiveInt(request.params.id!), request.body.ids);
    ok(response, { updated: true });
  }));

  router.get('/user-groups', requirePermission('system:group:read'), asyncHandler(async (_request, response) => {
    ok(response, await userGroups.listUserGroups());
  }));
  router.get('/user-groups/:id/menus/tree', requirePermission('system:group:read'), asyncHandler(async (request, response) => {
    ok(response, await userGroupMenus.getUserGroupMenuTree(parsePositiveInt(request.params.id!)));
  }));
  router.put('/user-groups/:id/menus', requirePermission('system:group:write'), validateBody(saveUserGroupMenusSchema), asyncHandler(async (request, response) => {
    ok(response, await userGroupMenus.saveUserGroupMenus(parsePositiveInt(request.params.id!), request.body.menuIds));
  }));
  router.post('/user-groups/users/query', requirePermission('system:group:read'), validateBody(queryUserGroupUsersSchema), asyncHandler(async (request, response) => {
    ok(response, await userGroups.queryUserGroupUsers(request.body));
  }));
  router.post('/user-groups/:id/users', requirePermission('system:group:write'), validateBody(addUserGroupUsersSchema), asyncHandler(async (request, response) => {
    ok(response, await userGroups.addUserGroupUsers(parsePositiveInt(request.params.id!), request.body.userIds));
  }));
  router.delete('/user-groups/:id/users/:userId', requirePermission('system:group:write'), asyncHandler(async (request, response) => {
    const groupId = parsePositiveInt(request.params.id!);
    const userId = parsePositiveInt(request.params.userId!, 'userId');
    await userGroups.unbindUserGroupUser(groupId, userId);
    ok(response, { groupId, userId, deleted: true });
  }));
  router.get('/user-groups/:id', requirePermission('system:group:read'), asyncHandler(async (request, response) => {
    ok(response, await userGroups.getUserGroup(parsePositiveInt(request.params.id!)));
  }));
  router.post('/user-groups/create', requirePermission('system:group:write'), validateBody(userGroupSchema), asyncHandler(async (request, response) => {
    ok(response, await userGroups.createUserGroup(request.body), 201);
  }));
  router.patch('/user-groups/:id', requirePermission('system:group:write'), validateBody(updateUserGroupSchema), asyncHandler(async (request, response) => {
    ok(response, await userGroups.updateUserGroup(parsePositiveInt(request.params.id!), request.body));
  }));
  router.delete('/user-groups/:id', requirePermission('system:group:write'), asyncHandler(async (request, response) => {
    const id = parsePositiveInt(request.params.id!);
    await userGroups.deleteUserGroup(id);
    ok(response, { id, deleted: true });
  }));

  router.get('/users', requirePermission('system:role:read'), asyncHandler(async (_request, response) => {
    ok(response, await access.listUsers());
  }));
  router.post('/users/query', requirePermission('system:role:read'), validateBody(queryUsersSchema), asyncHandler(async (request, response) => {
    ok(response, await access.queryUsers(request.body));
  }));
  router.put('/users/:id/roles', requirePermission('system:role:write'), validateBody(idListSchema), asyncHandler(async (request, response) => {
    await access.replaceUserRoles(parsePositiveInt(request.params.id!), request.body.ids);
    ok(response, { updated: true });
  }));
  router.patch('/users/:id/status', requirePermission('system:role:write'), validateBody(userStatusSchema), asyncHandler(async (request, response) => {
    ok(response, await access.updateUserStatus(
      parsePositiveInt(request.params.id!), request.body.status, request.auth!.id
    ));
  }));

  router.post('/menus', requirePermission('system:menu:read'), validateBody(queryMenuSchema), asyncHandler(async (request, response) => {
    ok(response, await menus.queryMenus(request.body));
  }));
  router.get('/menus/:id', requirePermission('system:menu:read'), asyncHandler(async (request, response) => {
    ok(response, await menus.getMenu(parseUuid(request.params.id!)));
  }));
  router.post('/menus/create', requirePermission('system:menu:write'), validateBody(menuSchema), asyncHandler(async (request, response) => {
    ok(response, await menus.createMenu(request.body), 201);
  }));
  router.patch('/menus/:id', requirePermission('system:menu:write'), validateBody(updateMenuSchema), asyncHandler(async (request, response) => {
    ok(response, await menus.updateMenu(parseUuid(request.params.id!), request.body));
  }));
  router.delete('/menus/:id', requirePermission('system:menu:write'), asyncHandler(async (request, response) => {
    const id = parseUuid(request.params.id!);
    await menus.deleteMenu(id);
    ok(response, { id, deleted: true });
  }));

  return router;
}
