import { Http } from "@du/utils";

const http = new Http({ baseURL: '/api' });

const API = {
    QUERY_MENU_BY_ID: (id: string) => `/system/menus/${id}`,
    CREATE_MENU: `/system/menus/create`
} as const

const queryMenuById = <T = any>(id: string) => {
    return http.get<T>(API.QUERY_MENU_BY_ID(id));
};

const patchMenuById = <T = any>(id: string, data: Record<string, unknown>) => {
    return http.patch<T>(API.QUERY_MENU_BY_ID(id), data);
};

const createMenu = <T = any>(data: Record<string, unknown>) => {
    return http.post<T>(API.CREATE_MENU, data);
};


const deleteMenuById = <T = any>(id: string, data: Record<string, unknown>) => {
    return http.delete<T>(API.QUERY_MENU_BY_ID(id), data);
};

export { queryMenuById, patchMenuById, deleteMenuById, createMenu };