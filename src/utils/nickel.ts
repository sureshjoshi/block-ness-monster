export interface StorageArea {
    get(keys: string | string[] | object | null): Promise<{ [key: string]: any }>;
    getValue<T>(key: string): Promise<T | undefined>;

    set(items: object): Promise<void>;
    setValue<T>(key: string, value: T): Promise<void>;

    // remove(keys: string | string[]): Promise<void>;
    // removeValue(key: string): Promise<void>;
}

export interface Tabs {
    query(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]>;
}

export interface Nickel {
    storage: StorageArea;
    tabs: Tabs;
}

// Promise-centric wrapper for the used Chrome Storage APIs
// Also extending the local storage API to facilitate a typed key-value store
export class Nickel1 implements Nickel {
    public storage: StorageArea = {
        get(keys: string | string[] | object | null): Promise<{ [key: string]: any }> {
            return new Promise((resolve, reject) => {
                chrome.storage.local.get(keys, (items) => {
                    const err = chrome.runtime.lastError;
                    if (err) {
                        return reject(err);
                    }
                    return resolve(items);
                });
            });
        },
        async getValue<T>(key: string): Promise<T> {
            const value = await this.get(key);
            return value[key];
        },
        set(items: object): Promise<void> {
            return new Promise((resolve, reject) => {
                chrome.storage.local.set(items, () => {
                    const err = chrome.runtime.lastError;
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
            });
        },
        setValue<T>(key: string, value: T): Promise<void> {
            return this.set({ [key]: value });
        },
    };

    public tabs: Tabs = {
        query(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]> {
            return new Promise((resolve, reject) => {
                chrome.tabs.query(queryInfo, (result) => {
                    const err = chrome.runtime.lastError;
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                });
            });
        },
    };
}
