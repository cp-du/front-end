import type { RowDataPacket } from 'mysql2';
import { execute, rows, transaction } from '../../db/pool.js';
import { notFound } from '../../shared/http/errors.js';
import { listMenus } from './menu-service.js';
import { getUserGroup } from './user-group-service.js';

export async function getUserGroupMenuTree(groupId: number) {
  await getUserGroup(groupId);
  const [tree, bindings] = await Promise.all([
    listMenus(),
    rows<(RowDataPacket & { menuId: string })[]>(
      'SELECT menu_id AS menuId FROM user_group_menus WHERE group_id = ? ORDER BY menu_id',
      [groupId]
    )
  ]);
  return { groupId, rows: tree, checkedKeys: bindings.map(({ menuId }) => menuId) };
}

export async function saveUserGroupMenus(groupId: number, menuIds: string[]) {
  const ids = [...new Set(menuIds.map((id) => id.toLowerCase()))].sort();
  return transaction(async (connection) => {
    // Serialize saves for this group, including clearing all bindings.
    const groups = await rows<RowDataPacket[]>(
      'SELECT id FROM user_groups WHERE id = ? FOR UPDATE', [groupId], connection
    );
    if (!groups[0]) throw notFound('用户组不存在');

    if (ids.length) {
      const menus = await rows<(RowDataPacket & { id: string })[]>(
        `SELECT id FROM menus WHERE id IN (${ids.map(() => '?').join(', ')}) ORDER BY id FOR SHARE`,
        ids, connection
      );
      const foundIds = new Set(menus.map(({ id }) => id));
      const missingIds = ids.filter((id) => !foundIds.has(id));
      if (missingIds.length) throw notFound(`菜单不存在：${missingIds.join(', ')}`);
    }

    await execute('DELETE FROM user_group_menus WHERE group_id = ?', [groupId], connection);
    if (ids.length) {
      await execute(
        `INSERT INTO user_group_menus (group_id, menu_id) VALUES ${ids.map(() => '(?, ?)').join(', ')}`,
        ids.flatMap((id) => [groupId, id]), connection
      );
    }
    return { groupId, menuIds: ids, updated: true };
  });
}
