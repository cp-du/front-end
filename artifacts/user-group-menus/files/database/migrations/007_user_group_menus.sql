CREATE TABLE IF NOT EXISTS user_group_menus (
  group_id BIGINT UNSIGNED NOT NULL,
  menu_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (group_id, menu_id),
  KEY idx_user_group_menus_menu (menu_id),
  CONSTRAINT fk_user_group_menus_group FOREIGN KEY (group_id) REFERENCES user_groups(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_group_menus_menu FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
