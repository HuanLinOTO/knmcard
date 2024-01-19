<template>
  <div class="sidebar">
    <div class="title">KNMCARD</div>
    <div class="action-btn-container">
        <div class="action-btn" @click="props.onStartCopyCard">
            <div class="icon">
                +
            </div>
            <div class="text">
                开始拷卡
            </div>
        </div>
    </div>
    <template v-for="item in tasks">
        <div
            class="task"
            :style="task_style[item.taskid]" 
        >
            <!-- :style="`background: linear-gradient(115deg, red 0%, red ${item.processed/item.total * 100}%, var(--bg-color-light) ${item.processed/item.total * 100}%, var(--bg-color-light) 100%);`" -->
            <div class="task-title">
                <n-ellipsis style="max-width:90px">{{ item.src }}</n-ellipsis>
                ->
                <n-ellipsis style="max-width:90px">{{ item.dst.replaceAll("\\","/") }}</n-ellipsis>
            </div>
            <div class="speed">
                ⚡ Speed: {{ byte2text(item.speed) }}/S
            </div>
        </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useTasks } from '../utils/task';
import { byte2text } from '../backend/utils/byte2text';

const props = defineProps({
    onStartCopyCard: {
        type: Function,
        required: true
    }
})

const tasks = useTasks()
const task_style = ref<Record<string,string>>({})
const current_progress = ref<Record<string,number>>({})

setInterval(() => {
    for (const task of tasks.value) {
        if (current_progress.value[task.taskid] === undefined) {
            current_progress.value[task.taskid] = task.processed
        }
        if (current_progress.value[task.taskid] < task.processed) {
            current_progress.value[task.taskid] += Math.ceil((task.processed - current_progress.value[task.taskid]) / 10)
        }
        if (current_progress.value[task.taskid] > task.processed) {
            current_progress.value[task.taskid] = task.processed
        }
        let progress = current_progress.value[task.taskid]/task.total * 100
        task_style.value[task.taskid] = `background: linear-gradient(115deg, #4942e4 0%, rgb(0,153,255) ${progress}%, var(--bg-color) ${progress}%, var(--bg-color) 100%);`
    }
}, 16)

watch(tasks, (ntasks) => {

})
</script>

<style lang="less" scoped>
@import url("../styles/colors.css");

.sidebar {
    width: 250px;
    height: 100vh;
    background-color: var(--sidebar-color);
    padding: 10px;

    .title {
        font-size: 30px;
        text-align: center;
        color: #fff;
        font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    }

    .action-btn-container {
        display: flex;
        justify-content: space-around;
        
        .action-btn {
            width: 100%;
            height: 40px;
            margin: 2px;
            font-weight: bold;
            border-radius: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(115deg, #4942e4 0%, var(--primary-color-secondary) 100%);
            cursor: pointer;
            user-select: none;

            .icon {
                font-size: 45px;
                margin-right: 5px;
                font-weight: lighter !important;
            }
            .text {
                font-size: 18px;
                font-weight: bold;
            }
        }
    }

    .task {
        margin-top: 10px;
        border-radius: 5px;
        padding: 10px;
        .task-title {
            font-size: 20px;
            font-weight: bold;
            color: #fff;
        }
        .speed {
            font-size: 12px;
            color: #fff;
        }
    }
}
</style>