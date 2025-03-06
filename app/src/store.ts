const Store = class {
    static get(key: string) {
        return window.ipcRenderer.invoke("store:get", key);
    }

    static set(key: string, object: any) {
        window.ipcRenderer.invoke("store:set", key, object);
    }

    static delete(key: string) {
        window.ipcRenderer.invoke("store:delete", key);
    }
}

export default Store;
