<template>
  <teleport to="body">
    <div class="modal" v-show="props.showModal" @click="clickModal">
      <transition name="light-up">
          <div class="close-icon" v-show="props.showModal" @click="props.onClickModal"></div>
      </transition>

      <transition name="slide-up">
        <div @click.stop="null" v-show="props.showModal" @mousedown="() => antiSelectText = true" @mouseup="() => antiSelectText = false">
          <!-- 最右侧显示X -->
          <slot></slot>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { ref  } from 'vue';

const props = defineProps({
  onClickModal: {
    type: Function,
    required: true,
  },
  showModal: {
    type: Boolean,
    required: true,
  },
});

var antiSelectText = ref(false)

const clickModal = () => {
  if (antiSelectText) {
    return;
  }
  
  props.onClickModal();
};
</script>

<style lang="less" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1100;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  .close-icon {
    z-index: 1100;
    position: absolute;
    top: calc(10vh + 10px);
    right: calc(10vw + 10px);
    width: 15px;
    height: 15px;
    background-color: red;
    color: black;
    border-radius: 50%;
    cursor: pointer;
  }
}
</style>
