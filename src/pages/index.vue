<template>
  <div>
    <SideBar :onStartCopyCard="onStartCopyCard"/>
    <StartCopyCard :onClose="() => showStarCopyCard = false" :showModal="showStarCopyCard"></StartCopyCard>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SideBar from '../components/sidebar.vue';
import StartCopyCard from "../components/dialogs/start_copy_card.vue"

const showStarCopyCard = ref(false);

const onStartCopyCard = () => {
  console.log('onStartCopyCard');
  showStarCopyCard.value = true;
}

</script>

<style lang="less" scoped>
</style>  