import { ipcMain, dialog } from "electron";
import { getPartitionSpace, getWindowsPartitions } from "./utils/windowsPartitions";
import { FileCopyTaskManager } from "./utils/FileCopyTaskManager";
import fs from "fs/promises"
import { isFileExists } from "./utils/isFileExists";
const fctaskmgr = new FileCopyTaskManager();

export function registerIpcMain() {
    ipcMain.handle('partitions:get', async () => {
        const disks = await getWindowsPartitions()
        let result = {} as any;
        for (const disk of disks) {
            result[disk] = await getPartitionSpace(disk)
        }
        return result;
    })
    ipcMain.handle('fs:select_folder', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory']
        })
        if (!canceled) {
          return filePaths[0]
        }
    })
    ipcMain.on('copy:add_customize_source', async (event, name, path) => {
        const customize_source_path = `customize_source.json`
        // 如果不存在，就写入 []
        if (!await isFileExists(customize_source_path)) {
            await fs.writeFile(customize_source_path, "[]")
        }
        // 读取文件
        const customize_sources = JSON.parse(await fs.readFile(customize_source_path, "utf-8"))
        customize_sources.push({ path, name })
        await fs.writeFile(customize_source_path, JSON.stringify(customize_sources))
    })
    ipcMain.handle("copy:get_sources", async (event, arg) => {
        // 读取 customize_source.json
        const customize_source_path = `customize_source.json`
        // 如果不存在，就写入 []
        if (!await isFileExists(customize_source_path)) {
            await fs.writeFile(customize_source_path, "[]")
        }
        // 读取文件
        const customize_sources = JSON.parse(await fs.readFile(customize_source_path, "utf-8"))
        return customize_sources;
    })
    ipcMain.handle("copy_task:add_task", async (event, src, dst, options) => {
        const res = await fctaskmgr.addTask(src, dst, options)
        console.log("copy_task:add_task", src, dst, options, res);
        
        return res;
    })
    ipcMain.handle("copy_task:ls", async (event, src, dst, options) => {
        const tasks = fctaskmgr.tasks
        // 删去 process
        const tasks_without_process = [] as any
        for (const taskid in tasks) {
            const task = tasks[taskid]
            tasks_without_process.push({
                ...task,
                process: undefined
            })
        }
        return tasks_without_process;
    })
    ipcMain.handle("copy_task:check", async (event, taskid) => {
        const res = await fctaskmgr.checkTask(taskid)
        return res;
    })
}