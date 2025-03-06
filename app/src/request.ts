import { AxiosRequestConfig } from 'axios'
const request = (args: AxiosRequestConfig) => window.ipcRenderer.invoke('request', args);
export default request;
