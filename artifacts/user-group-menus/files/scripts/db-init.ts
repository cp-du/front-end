import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2';
import mysql from 'mysql2/promise';
import { createModelSchema } from '../src/apps/model-app/schemas.js';
import { env } from '../src/config/env.js';

const connection = await mysql.createConnection({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  multipleStatements: true,
  charset: 'utf8mb4'
});

interface ColumnTypeRow extends RowDataPacket {
  dataType: string;
}

const modelSeedFiles = [
  'database/seeds/crew-crewbo.model.json',
  'database/seeds/system-menubo.model.json',
  'database/seeds/system-dictbo.model.json',
  'database/seeds/system-dictitembo.model.json',
  'database/seeds/system-usergroupbo.model.json',
  'database/seeds/system-userbo.model.json'
];

async function applySql(file: string) {
  const sql = await readFile(resolve(file), 'utf8');
  await connection.query(sql);
  console.log(`Applied ${file}`);
}

async function applyModelSeed(file: string) {
  const modelSeed = JSON.parse(
    await readFile(resolve(file), 'utf8')
  ) as Record<string, unknown>;
  const appCode = String(modelSeed.appCode ?? '');
  if (!/^[a-zA-Z][a-zA-Z0-9_-]{0,49}$/.test(appCode)) {
    throw new Error(`Invalid appCode in model seed: ${file}`);
  }
  const model = createModelSchema.parse(Object.fromEntries(
    Object.entries(modelSeed).filter(([key]) => key !== 'appCode')
  ));
  await connection.execute(
    `INSERT INTO ui_models
     (app_code, name, display_name, description, controls_json, status, created_by, updated_by)
     SELECT ?, ?, ?, ?, ?, ?, u.id, u.id FROM users u WHERE u.username = ?
     ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), description = VALUES(description),
       controls_json = VALUES(controls_json), status = VALUES(status), updated_by = VALUES(updated_by)`,
    [appCode, model.name, model.displayName, model.description ?? null,
      JSON.stringify(model.controls), model.status, env.ADMIN_USERNAME]
  );
  console.log(`Seeded model ${appCode}/${model.name}`);
}

try {
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.query(`USE \`${env.DB_NAME}\``);

  await applySql('database/migrations/001_init.sql');

  const [menuIdColumns] = await connection.query<ColumnTypeRow[]>(
    `SELECT DATA_TYPE AS dataType FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'menus' AND COLUMN_NAME = 'id'
     LIMIT 1`
  );
  if (['tinyint', 'smallint', 'mediumint', 'int', 'bigint'].includes(menuIdColumns[0]?.dataType ?? '')) {
    await applySql('database/migrations/002_menu_uuid.sql');
  } else {
    console.log('Skipped database/migrations/002_menu_uuid.sql (menus.id is already UUID)');
  }

  await applySql('database/migrations/003_dictionary_maintenance.sql');
  await applySql('database/migrations/004_menu_type.sql');
  await applySql('database/migrations/005_user_groups.sql');
  await applySql('database/migrations/006_user_group_users.sql');
  await applySql('database/migrations/007_user_group_menus.sql');

  await applySql('database/seeds/001_base.sql');

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  await connection.execute(
    `INSERT INTO users (username, email, password_hash, display_name)
     VALUES (?, ?, ?, '系统管理员')
     ON DUPLICATE KEY UPDATE email = VALUES(email), password_hash = VALUES(password_hash), status = 'active'`,
    [env.ADMIN_USERNAME, env.ADMIN_EMAIL, passwordHash]
  );
  await connection.execute(
    `INSERT IGNORE INTO user_roles (user_id, role_id)
     SELECT u.id, r.id FROM users u CROSS JOIN roles r WHERE u.username = ? AND r.code = 'admin'`,
    [env.ADMIN_USERNAME]
  );

  for (const file of modelSeedFiles) {
    await applyModelSeed(file);
  }
  await connection.execute(
    'DELETE FROM ui_models WHERE app_code = ? AND name = ?',
    ['mtgl', 'auditbo']
  );
  console.log(`Database ready. Admin username: ${env.ADMIN_USERNAME}`);
} finally {
  await connection.end();
}
