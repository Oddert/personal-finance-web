/**
 * Retrieves and parses data from Local Storage.
 * @param key The storage key to retrieve.
 * @returns The value of that key or null.
 */
export const getFromLocalStore = (key: string) => {
    const res = localStorage.getItem(key);
    if (!res || res === '') {
        return null;
    }
    return JSON.parse(res);
};
/**
 * Writes JSON stringified data to Local Storage.
 * @param key The storage key to write to.
 * @param data The JSON serialisable content to write
 */
export const setToLocalStore = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};
