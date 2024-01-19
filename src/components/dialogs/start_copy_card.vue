<template>
    <Modal :onClickModal="props.onClose" :showModal="props.showModal">
        <div class="start-copy-card-container">
            <div class="dialog-title">开始拷卡任务</div>
            <n-scrollbar style="max-height: calc(80vh);">
                <div style="padding-top: 30px;">
                    <n-space vertical>
                        <h1 class="title">
                            <n-icon size="40" class="icon">
                                <FolderOutline></FolderOutline>
                                <!-- <game-controller-outline /> -->
                            </n-icon>
                            数据源 &nbsp; <span v-if="selectedDisk">({{ selectedDisk }})</span>
                        </h1>
                        <n-collapse-transition :show="Object.keys(disks).length != 0">
                            <n-grid :x-gap="12" :y-gap="8" :cols="2" :style="diskContainerStyle">
                                <n-gi v-for="(value, key) in disks">
                                    <Disk :diskName="(key)" :util="(value.total - value.free) / value.total"
                                        @click="select_disk(key)" :isSeleted="key == selectedDisk"> </Disk>
                                </n-gi>
                            </n-grid>
                        </n-collapse-transition>
                        数据文件夹预设
                        <n-space>
                            <n-tag :bordered="false" v-for="item in sources" @click="() => selectedSource = item"
                                :style="selectedSource == item ? 'background-color: var(--action-btn-color-selected);' : ''">
                                {{ item.name }}
                            </n-tag>
                            <n-tag :bordered="false" @click="() => showCustomizeSource = !showCustomizeSource">
                                自定义...
                            </n-tag>
                        </n-space>
                        <n-collapse-transition :show="Boolean(selectedSource?.path)">
                            {{ selectedSource?.path }}
                        </n-collapse-transition>
                        <n-collapse-transition :show="showCustomizeSource">
                            <n-space vertical style="margin-left: 20px;">
                                <n-space>
                                    <n-space vertical>
                                        <div>
                                            预设名称
                                        </div>
                                        <div>
                                            路径( / 代表驱动器根目录)
                                        </div>
                                    </n-space>
                                    <n-space vertical>
                                        <n-input type="text" size="tiny" placeholder="保命预设" v-model:value="source_name" />
                                        <n-input type="text" size="tiny" placeholder="/AVs" v-model:value="source_path" />
                                    </n-space>
                                </n-space>
                                <n-button strong secondary size="tiny" @click="addSource">添加</n-button>
                            </n-space>
                        </n-collapse-transition>
                        <n-divider />
                        <h1 class="title">
                            <n-icon size="40" class="icon">
                                <OutputRound></OutputRound>
                                <!-- <game-controller-outline /> -->
                            </n-icon>
                            导出目标 &nbsp;
                        </h1>
                        <n-space>
                            <n-button @click="select_folder" strong secondary size="tiny">选择文件夹</n-button>
                            {{ selectedOutputFolder }}
                        </n-space>
                        <span v-if="selectedOutputFolder">
                            文件夹可用空间 {{ byte2text(disks[selectedOutputFolder.split(':')[0] + ":"]?.free) }}
                            <br>
                            <template v-if="selectedDisk">
                                数据来源需要空间 {{ byte2text(disks[selectedDisk]?.total - disks[selectedDisk]?.free) }}
                            </template>
                            <br>
                            <template v-if="selectedDisk && selectedOutputFolder">
                                <template
                                    v-if="(disks[selectedOutputFolder.split(':')[0] + ':']?.free - disks[selectedDisk]?.total + disks[selectedDisk]?.free) < 0">
                                    <div style="color: red">
                                        文件夹空间不足！
                                    </div>
                                </template>
                                <template v-else>
                                    <div style="color: green">
                                        文件夹空间充足！
                                    </div>
                                </template>
                            </template>
                        </span>
                        <n-divider />
                        <h1 class="title">
                            <n-icon size="40" class="icon">
                                <DiamondOutlined></DiamondOutlined>
                                <!-- <game-controller-outline /> -->
                            </n-icon>
                            高级
                        </h1>
                        <n-space vertical>
                            <n-space>
                                使用 ShotNow! 引导导出行为
                                <n-switch size="small" v-model:value="useShotNow" />
                            </n-space>
                            <n-space>
                                校验 Hash (Slow)
                                <n-switch size="small" v-model:value="useHash" />
                            </n-space>
                            <n-space>
                                跳过大疆 LRF 缓存文件
                                <n-switch size="small" v-model:value="skipLRF" />
                            </n-space>
                        </n-space>
                        <template v-if="useShotNow">
                            <n-button size="tiny" @click="select_folder" strong secondary>选择 ShotNow! json 文件</n-button>
                        </template>
                        <n-divider />
                        <!-- <div style="margin-bottom: 20px;"></div> -->

                        <h1 class="title">
                            <n-icon size="40" class="icon">
                                <Timeline20Regular></Timeline20Regular>
                                <!-- <game-controller-outline /> -->
                            </n-icon>
                            Timeline
                        </h1>

                        <n-timeline horizontal style="padding: 16px;">
                            <n-timeline-item type="info" title="了解你的 ShotNow! 😎" v-if="useShotNow"/>
                            <n-timeline-item type="info" title="拷贝文件😉" v-if="!skipLRF" />
                            <n-timeline-item type="info" title="拷贝文件(跳过 LRF)😉" v-else />
                            <n-timeline-item type="info" title="验证 Hash😆" v-if="useHash"/>
                            <n-timeline-item type="success" title="完成😊" />
                            <n-timeline-item type="error" title="不行，你不能离开我😭" />
                        </n-timeline>

                        <h1 class="title">
                            <n-icon size="40" class="icon">
                                <PushOutline></PushOutline>
                                <!-- <game-controller-outline /> -->
                            </n-icon>
                            提交
                        </h1>
                        <div style="padding: 16px;">
                            <div v-if="selectedDisk && selectedSource && selectedOutputFolder">
                                <n-space vertical>
                                    <div>
                                        请确认：
                                    </div>
                                    <div>
                                        {{ selectedDisk + selectedSource?.path }} -> {{
                                            selectedOutputFolder.replaceAll("\\", '/') }}
                                    </div>
                                </n-space>
                            </div>
                            <n-button size="large" strong secondary @click="submit">开始拷卡</n-button>
                        </div>
                    </n-space>
                </div>
            </n-scrollbar>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import { onUpdated, ref } from 'vue';
import Modal from '../modal.vue';
import FolderOutline from "@vicons/ionicons5/FolderOutline";
import PushOutline from "@vicons/ionicons5/PushOutline";
import DiamondOutlined from "@vicons/material/DiamondOutlined";
import Timeline20Regular from "@vicons/fluent/Timeline20Regular";
import OutputRound from "@vicons/material/OutputRound";
import Disk from '../disk.vue';
import { useMessage } from 'naive-ui';
import { byte2text } from '../../backend/utils/byte2text';

const message = useMessage()

const props = defineProps({
    onClose: {
        type: Function,
        required: true
    },
    showModal: {
        type: Boolean,
        required: true
    }
});

const disks = ref<Record<string, any>>({});
const sources = ref([]);

const selectedDisk = ref();
const selectedOutputFolder = ref();
const selectedSource = ref();
const useShotNow = ref(false);
const useHash = ref(false);
const skipLRF = ref(false);

const showCustomizeSource = ref(false);
const source_name = ref('');
const source_path = ref('');

const diskContainerStyle = ref("transform: translateY(-10px);opacity: 0;");

onUpdated(async () => {
    const r_disks = await window.electronAPI.partitions_get()
    disks.value = r_disks
    diskContainerStyle.value = 'transform: translateY(0px);'
    const r_sources = await window.electronAPI.copy_get_sources()
    sources.value = r_sources
})

const addSource = async () => {
    if (!source_name.value) {
        message.error('请输入预设名称')
        return
    }
    if (!source_path.value) {
        message.error('请输入路径')
        return
    }
    // 如果路径不是以 / 开头，自动补全
    if (source_path.value[0] != '/') {
        source_path.value = '/' + source_path.value
    }
    await window.electronAPI.copy_add_customize_source(source_name.value, source_path.value)
    message.success('添加成功')
    setTimeout(async () => {
        sources.value = await window.electronAPI.copy_get_sources()
    }, 200);
    showCustomizeSource.value = false
}

const select_disk = (disk: string) => {
    selectedDisk.value = disk
    console.log(disk);
}

const select_folder = async () => {
    const res = await window.electronAPI.fs_select_folder()
    if (res) {
        selectedOutputFolder.value = res;
        return
    }
    message.error('已取消')
}

const submit = async () => {
    if (!selectedDisk.value) {
        message.error('请选择数据源')
        return
    }
    if (!selectedOutputFolder.value) {
        message.error('请选择导出目标')
        return
    }
    if (selectedDisk.value == selectedOutputFolder.value.split(':')[0] + ':') {
        message.error('数据源和导出目标不能相同')
        return
    }
    // const res = await window.electronAPI.start_copy_card(selectedDisk.value, selectedOutputFolder.value, useShotNow.value, useHash.value)
    // 拼接 src
    let src = selectedDisk.value + selectedSource.value.path
    let res = await window.electronAPI.copy_add_task(src, selectedOutputFolder.value)
    message.success('开始拷卡')
    console.log(res);

    props.onClose()
}
</script>

<style lang="less" scoped>
@import url("../../styles/colors.css");

.start-copy-card-container {
    width: 80vw;
    height: 80vh;
    background-color: var(--bg-color-deeper);
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    align-items: center;

    .dialog-title {
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        position: absolute;
        z-index: 999;
        width: calc(80vw - 20px);
        margin-left: -20px;
        margin-top: -20px;
        padding: 10px 0px 5px 15px;
        background-color: var(--bg-color-deeper);
        border-bottom: 1px solid var(--bg-color-light);
    }

    .title {
        margin: 0;
        color: #fff;
        font-size: 24px;
        font-weight: bold;
        display: flex;
        align-items: center;

        .icon {
            margin: 5px;
        }
    }

    .content {
        font-size: 16px;
        color: #999;
    }

    .btn {
        width: 100%;
        height: 40px;
        background-color: #11009E;
        color: #fff;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
}
</style>