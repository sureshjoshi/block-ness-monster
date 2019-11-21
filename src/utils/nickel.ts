// export interface Nickel {
// storage: {
//     local: {

//     }
//     // NickelStorage;
// }

// addAsync(xml: string): Promise<Office.AsyncResult<Office.CustomXmlPart>>;
// getByNamespaceAsync(namespace: string): Promise<Office.AsyncResult<Office.CustomXmlPart[]>>;
// getByIdAsync(id: string): Promise<Office.AsyncResult<Office.CustomXmlPart>>;

// getXmlAsync(xmlPart: Office.CustomXmlPart): Promise<Office.AsyncResult<string>>;
// deleteAsync(xmlPart: Office.CustomXmlPart): Promise<Office.AsyncResult<void>>;
// }

export interface StorageArea {
    set(items: object): Promise<void>;
    // remove(keys: string | string[]): Promise<void>;
    // get(callback: (items: { [key: string]: any }) => void): Promise<void>;
    get(keys: string | string[] | object | null): Promise<{ [key: string]: any }>;
}

export interface Tabs {
    query(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]>;
}

export interface Nickel {
    storage: StorageArea;
    tabs: Tabs;
}

export class Nickel1 implements Nickel {
    public storage: StorageArea = {
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
