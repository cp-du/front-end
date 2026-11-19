import { Http } from "@du/utils";

const http = new Http({ baseURL: '/api' });

const API = {
    QUERY_DICT_BY_ID: (id: string) => `/system/dictionaries/${id}`,
    QUERY_DICT_ITEM_BY_ID: (id: string) => `/system/dictionary-items/${id}`,
} as const

const queryDictById = <T = any>(id: string) => {
    return http.get<T>(API.QUERY_DICT_BY_ID(id));
};

const patchDictById = <T = any>(id: string, data: Record<string, unknown>) => {
    return http.patch<T>(API.QUERY_DICT_BY_ID(id), data);
};

const createDict = <T = any>(data: Record<string, unknown>) => {
    return http.post<T>(`/system/dictionaries/create`, data);
};


const deleteDictById = <T = any>(id: string, data: Record<string, unknown>) => {
    return http.delete<T>(API.QUERY_DICT_BY_ID(id), data);
};

const queryDictItemById = <T = any>(id: string) => {
    return http.get<T>(API.QUERY_DICT_ITEM_BY_ID(id));
};

const patchDictItemById = <T = any>(id: string, data: Record<string, unknown>) => {
    return http.patch<T>(API.QUERY_DICT_ITEM_BY_ID(id), data);
}

const createDictItem = <T = any>(data: Record<string, unknown>) => {
    return http.post<T>(`/system/dictionary-items/create`, data);
};

const deleteDictItemById = <T = any>(id: string, data: Record<string, unknown>) => {
    return http.delete<T>(API.QUERY_DICT_ITEM_BY_ID(id), data);
};

export { queryDictById, patchDictById, deleteDictById, createDict, queryDictItemById, patchDictItemById, deleteDictItemById, createDictItem };