import { Http } from "@du/utils";

const http = new Http({ baseURL: '/api' });

const API = {
    QUERY_USER_GROUP: '/system/user-groups',
    QUERY_USER_GROUP_BYID: (id: string) => `/system/user-groups/${id}`,
    UPDATE_USER_GROUP_BYID: (id: string) => `/system/user-groups/${id}`,
    CREATE_USER_GROUP: '/system/user-groups/create',
    DELETE_USER_GROUP: (id: string) => `/system/user-groups/delete:${id}`,
    ADD_USER_TO_GROUP: (id: string) => `/system/user-groups/${id}/users`,
    UNBIND_USER_FROM_GROUP: (id: string, userId: string) => `/system/user-groups/${id}/users/${userId}`,
    QUERY_MENU_TREE: '/system/menus',
    QUERY_MENU_BYID: (id: string) => `/system/user-groups/${id}/menus/tree`,
    SAVE_MENU: (id: string) => `/api/system/user-groups/${id}/menus`
} as const

const queryUserGroup = <T = any>() => {
    return http.get<T>(API.QUERY_USER_GROUP);
};
const queryUserGroupById = <T = any>(id: string) => {
    return http.get<T>(API.QUERY_USER_GROUP_BYID(id));
};

const createUserGroup = <T = any>(data: Record<string, unknown>) => {
    return http.post<T>(API.CREATE_USER_GROUP, data);
};
const updateUserGroup = <T = any>(id: string, data: Record<string, unknown>) => {
    return http.patch<T>(API.UPDATE_USER_GROUP_BYID(id), data);
};
const deleteUserGroup = <T = any>(id: string, data: Record<string, unknown>) => {
    return http.delete<T>(API.DELETE_USER_GROUP(id), data);
};


const addUserToGroup = <T = any>(id: string, data: Record<string, unknown>) => {
    return http.post<T>(API.ADD_USER_TO_GROUP(id), data);
};
const unbindUserFromGroup = <T = any>(id: string, userId: string) => {
    return http.delete<T>(API.UNBIND_USER_FROM_GROUP(id, userId));
};

const queryMenuTree = <T = any>(params: Record<string, unknown>) => {
    return http.post<T>(API.QUERY_MENU_TREE, params);
};

const queryMenuById = <T = any>(id: string) => {
    return http.get<T>(API.QUERY_MENU_BYID(id));
};

const saveMenu = <T = any>(id: string, data: Record<string, unknown>) => {
    return http.post<T>(API.SAVE_MENU(id), data);
};
export { queryMenuTree, queryMenuById, saveMenu, queryUserGroup, queryUserGroupById, createUserGroup, updateUserGroup, deleteUserGroup, addUserToGroup, unbindUserFromGroup };
