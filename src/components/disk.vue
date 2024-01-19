<template>
  <div class="disk-container" :style="bg">
    <n-icon size="40" class="icon">
        <VmdkDisk></VmdkDisk>   
    </n-icon>
    <div class="info">
        <div class="name">
            {{ props.diskName }} ({{ util }}%)
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import VmdkDisk from "@vicons/carbon/VmdkDisk";
import { computed, ref, watch } from 'vue';
const props = defineProps({
    diskName: {
        type: String,
        required: true
    },
    util: {
        type: Number,
        required: true
    },
    isSeleted: {
        type: Boolean,
        required: false,
        default: false
    }
})

const util = Number((props.util * 100).toFixed())

const progress_color = computed(() => {
    if (props.isSeleted) {
        return 'var(--action-btn-color-selected)'
    } else {
        return 'var(--action-btn-color)'
    }
})

watch(progress_color, (val) => {
    bg.value = `background: linear-gradient(115deg, ${progress_color.value} 0%, ${progress_color.value} ${progress}%, var(--bg-color-light) ${progress}%, var(--bg-color-light) 100%);`

})

var progress = 0

const bg = ref(`background: linear-gradient(115deg, ${progress_color.value} 0%, ${progress_color.value} ${10}%, var(--bg-color-light) ${10}%, var(--bg-color-light) 100%);`)

function easeInOutProgress(linearProgress: number): number {
    return 0.5 - 0.5 * Math.cos(linearProgress * Math.PI);
}


const animate = (cur_util: number = 10) => {
    setTimeout(() => {
        // 计算 0.6s 内完成动画的步长
        const step = (util - cur_util) / 20
        cur_util += step
        progress = easeInOutProgress(cur_util / 100) * 100
        
        bg.value = `background: linear-gradient(115deg, ${progress_color.value} 0%, ${progress_color.value} ${progress}%, var(--bg-color-light) ${progress}%, var(--bg-color-light) 100%);`
        if ((util - cur_util) > 0.5) {
            return animate(cur_util)
        }
    }, 16);
}
animate()
</script>

<style lang="less" scoped>
.disk-container {
    border-radius: 9px;
    cursor: pointer;
    display: flex;
    flex-direction: row; 
    align-items: center;
    user-select: none;
    .icon {
        margin: 5px;
    }
    .info {
        display: flex;
        width: 100%;
        flex-direction: column;
        .name {
            font-size: 24px;
            color: #fff;
        }
    }
}
</style>