// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    partitions_get: () => ipcRenderer.invoke('partitions:get'),
    fs_select_folder: () => ipcRenderer.invoke('fs:select_folder'),
    copy_add_task: (...arg: any) => ipcRenderer.invoke('copy_task:add_task',...arg),
    copy_check_task: (...arg: any) => ipcRenderer.send('copy_task:check',...arg),
    copy_add_customize_source: (...arg: any) => ipcRenderer.send('copy:add_customize_source',...arg),
    copy_get_sources: () => ipcRenderer.invoke('copy:get_sources'),
    copy_ls_task: () => ipcRenderer.invoke('copy_task:ls'),
})