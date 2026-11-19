import assert from 'node:assert/strict';
import { test, type TestContext } from 'node:test';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';
import { pool } from '../src/db/pool.js';
import { saveUserGroupMenusSchema } from '../src/apps/system-app/schemas.js';
import { getUserGroupMenuTree, saveUserGroupMenus } from '../src/apps/system-app/user-group-menu-service.js';

const parent = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1';
const child = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2';
const sibling = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3';
const other = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4';

function mockSave(t: TestContext, options: { missingGroup?: boolean; missingMenu?: boolean; failInsert?: boolean } = {}) {
  const events: string[] = [];
  const state = new Map<number, string[]>([[7, [other]], [8, [sibling]]]);
  let pending: string[] = [];
  const connection = {
    beginTransaction: async () => { events.push('begin'); pending = [...state.get(7)!]; },
    commit: async () => { events.push('commit'); state.set(7, pending); },
    rollback: async () => { events.push('rollback'); },
    release: () => { events.push('release'); },
    execute: async (sql: string, values: Array<string | number>) => {
      if (sql.includes('FROM user_groups')) {
        assert.deepEqual(values, [7]);
        assert.match(sql, /FOR UPDATE/);
        return [options.missingGroup ? [] : [{ id: 7 }], []];
      }
      if (sql.includes('FROM menus')) {
        assert.match(sql, /FOR SHARE/);
        return [values.filter(id => !options.missingMenu || id !== child).map(id => ({ id })), []];
      }
      if (sql.startsWith('DELETE')) {
        assert.equal(sql, 'DELETE FROM user_group_menus WHERE group_id = ?');
        assert.deepEqual(values, [7]);
        events.push('delete');
        pending = [];
        return [{ affectedRows: 1 }, []];
      }
      assert.match(sql, /^INSERT INTO user_group_menus/);
      events.push('insert');
      if (options.failInsert) throw new Error('write failed');
      for (let i = 0; i < values.length; i += 2) {
        assert.equal(values[i], 7);
        pending.push(values[i + 1] as string);
      }
      return [{ affectedRows: pending.length }, []];
    }
  };
  t.mock.method(pool, 'getConnection', async () => connection);
  return { state, events };
}

test('save schema requires explicit UUID menuIds, supports clearing, normalizes case and limits input', () => {
  assert.deepEqual(saveUserGroupMenusSchema.parse({ menuIds: [] }), { menuIds: [] });
  assert.deepEqual(saveUserGroupMenusSchema.parse({ menuIds: [parent.toUpperCase(), child] }), { menuIds: [parent, child] });
  for (const body of [{}, { ids: [parent] }, { menuIds: null }, { menuIds: [1] },
    { menuIds: ['invalid'] }, { menuIds: Array(501).fill(parent) }, { menuIds: [], typo: true }]) {
    assert.equal(saveUserGroupMenusSchema.safeParse(body).success, false);
  }
});

test('query returns the full hierarchy with exact bindings, including hidden menus and over 20 roots', async (t) => {
  const menus = [
    { id: parent, parentId: null, name: '父节点', visible: 1 },
    { id: child, parentId: parent, name: '已选子节点', visible: 1 },
    { id: sibling, parentId: parent, name: '未选子节点', visible: 0 },
    ...Array.from({ length: 25 }, (_, i) => ({ id: `root-${i}`, parentId: null, name: `根${i}`, visible: 1 }))
  ];
  t.mock.method(pool, 'execute', async (sql: string, values: unknown[]) => {
    if (sql.includes('FROM user_groups')) return [[{ id: 7 }], []];
    if (sql.includes('FROM user_group_menus')) {
      assert.deepEqual(values, [7]);
      return [[{ menuId: parent }, { menuId: child }], []];
    }
    assert.match(sql, /FROM menus m/);
    assert.doesNotMatch(sql, /LIMIT|WHERE m.visible/);
    return [menus, []];
  });
  const result = await getUserGroupMenuTree(7);
  assert.equal(result.groupId, 7);
  assert.equal(result.rows.length, 26);
  assert.deepEqual(result.checkedKeys, [parent, child]);
  assert.deepEqual(result.rows[0]!.children.map(m => [m.id, m.visible]), [[child, true], [sibling, false]]);
});

test('query handles missing groups and an empty menu tree', async (t) => {
  let exists = false;
  t.mock.method(pool, 'execute', async (sql: string) => {
    if (sql.includes('FROM user_groups')) return [exists ? [{ id: 7 }] : [], []];
    assert.equal(exists, true);
    return [[], []];
  });
  await assert.rejects(getUserGroupMenuTree(7), { status: 404 });
  exists = true;
  assert.deepEqual(await getUserGroupMenuTree(7), { groupId: 7, rows: [], checkedKeys: [] });
});

test('save replaces only the target group, deduplicates and is repeatable without selecting extra nodes', async (t) => {
  const { state } = mockSave(t);
  t.mock.method(pool, 'execute', () => { throw new Error('Must use transaction'); });
  const expected = { groupId: 7, menuIds: [parent, child], updated: true };
  assert.deepEqual(await saveUserGroupMenus(7, [child, parent, child]), expected);
  assert.deepEqual(await saveUserGroupMenus(7, [parent, child]), expected);
  assert.deepEqual(state.get(7), [parent, child]);
  assert.deepEqual(state.get(8), [sibling]);
  assert.deepEqual(await saveUserGroupMenus(7, []), { groupId: 7, menuIds: [], updated: true });
  assert.deepEqual(state.get(7), []);
});

test('missing groups or menus and failed inserts preserve previous bindings and roll back', async (t) => {
  for (const options of [{ missingGroup: true }, { missingMenu: true }, { failInsert: true }]) {
    await t.test(JSON.stringify(options), async (childTest) => {
      const { state, events } = mockSave(childTest, options);
      await assert.rejects(saveUserGroupMenus(7, [parent, child]),
        'failInsert' in options ? { message: 'write failed' } : { status: 404 });
      assert.deepEqual(state.get(7), [other]);
      assert.deepEqual(events.slice(-2), ['rollback', 'release']);
      if (!('failInsert' in options)) assert.equal(events.includes('delete'), false);
    });
  }
});

test('HTTP routes enforce login, read/write permissions, validation and response shapes', async (t) => {
  let permissions: string[] = [];
  let exists = true;
  t.mock.method(pool, 'execute', async (sql: string) => {
    if (sql.includes('FROM users WHERE')) return [[{ id: 1, username: 'tester', status: 'active' }], []];
    if (sql.includes('FROM roles r JOIN')) return [[{ code: 'tester' }], []];
    if (sql.includes('FROM permissions p')) return [permissions.map(code => ({ code })), []];
    if (sql.includes('FROM user_groups')) return [exists ? [{ id: 7 }] : [], []];
    if (sql.includes('FROM user_group_menus')) return [[{ menuId: child }], []];
    if (sql.includes('FROM menus m')) return [[{ id: child, parentId: null, name: '菜单', visible: 1 }], []];
    throw new Error(`Unexpected SQL: ${sql}`);
  });
  const { state } = mockSave(t);
  const app = createApp();
  const auth = { Authorization: `Bearer ${jwt.sign({ sub: '1', type: 'access' }, env.JWT_ACCESS_SECRET, { expiresIn: '5m' })}` };
  const treePath = '/api/system/user-groups/7/menus/tree';
  const savePath = '/api/system/user-groups/7/menus';
  assert.equal((await request(app).get(treePath)).status, 401);
  assert.equal((await request(app).put(savePath).send({ menuIds: [] })).status, 401);
  assert.equal((await request(app).get(treePath).set(auth)).status, 403);
  assert.equal((await request(app).put(savePath).set(auth).send({ menuIds: [] })).status, 403);
  permissions = ['system:group:read'];
  const tree = await request(app).get(treePath).set(auth);
  assert.equal(tree.status, 200);
  assert.equal(tree.body.success, true);
  assert.equal(tree.body.data.groupId, 7);
  assert.deepEqual(tree.body.data.checkedKeys, [child]);
  assert.equal(tree.body.data.rows[0].id, child);
  assert.equal((await request(app).put(savePath).set(auth).send({ menuIds: [] })).status, 403);
  permissions.push('system:group:write');
  for (const body of [{}, { menuIds: ['bad'] }, { menuIds: [1] }]) {
    assert.equal((await request(app).put(savePath).set(auth).send(body)).status, 400);
  }
  assert.equal((await request(app).get('/api/system/user-groups/bad/menus/tree').set(auth)).status, 400);
  assert.equal((await request(app).put('/api/system/user-groups/0/menus').set(auth).send({ menuIds: [] })).status, 400);
  const save = await request(app).put(savePath).set(auth).send({ menuIds: [child, child] });
  assert.equal(save.status, 200);
  assert.deepEqual(save.body, { success: true, data: { groupId: 7, menuIds: [child], updated: true } });
  assert.deepEqual(state.get(7), [child]);
  exists = false;
  assert.equal((await request(app).get(treePath).set(auth)).status, 404);
});
