const hostname = async () => {
    return await window.ipcRenderer.invoke("getHostname");
}

export default hostname;
