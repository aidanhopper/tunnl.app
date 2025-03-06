const deviceID = async () => {
    return await window.ipcRenderer.invoke("getDeviceID");
}

export default deviceID;
