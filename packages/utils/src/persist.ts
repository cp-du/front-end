export class Store {
    private prefix = 'store_';
    constructor(prefix?: string) {
        if (prefix) {
            this.prefix = prefix;
        }
    }

    setStorage(key: string, value: any, timeout?: number) {
        const cacheKey = this.prefix + key;
        const data = {
            signature: cacheKey,
            data: value,
            timestamp: Date.now(),
            timeout: timeout,
        };
        localStorage.setItem(cacheKey, JSON.stringify(data));
    }

    getStorage<T>(key: string) {
        const cacheKey = this.prefix + key;
        const item = localStorage.getItem(cacheKey);
        if (!item) return null;
        const parsed = JSON.parse(item);
        if (parsed.timeout && Date.now() - parsed.timestamp > parsed.timeout) {
            localStorage.removeItem(cacheKey);
            return null;
        }
        return parsed.data as T;
    }
}


export const store = new Store();
