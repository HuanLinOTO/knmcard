import { Task } from "src/backend/utils/FileCopyTaskManager";
import { Ref, ref } from "vue";

let tasks: undefined | Ref<Task[]>

export function useTasks(): Ref<Task[]> {
    if (!tasks) {
        tasks = ref<Task[]>([])
        setInterval(async () => {
            tasks.value = await window.electronAPI.copy_ls_task()
        }, 200)
    }
    return tasks
}