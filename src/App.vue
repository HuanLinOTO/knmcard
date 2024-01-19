<template>
  <div>
    <n-config-provider :theme-overrides="themeOverrides">
      <n-message-provider>
        <router-view></router-view>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { NConfigProvider } from 'naive-ui'
import { darkTheme, GlobalThemeOverrides } from 'naive-ui'
/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
// @ts-ignore
const themeOverrides: GlobalThemeOverrides = {
  ...darkTheme,
  common: {
    ...darkTheme.common,
    primaryColor: '#7c73ff'
  },
  Button: {
    ...darkTheme.Button,
    colorSecondary: '#7c73ff',
    colorSecondaryPressed: '#c678dd',
    colorSecondaryHover: '#c678dd',
  },
  Switch: {
    ...darkTheme.Switch,
    railColor: '#7C73FFB8',
    railColorActive: '#c678dd',
  },
  Input: {
    ...darkTheme.Input,
    borderHover: '1px solid #7c73ff',
    borderFocus: '1px solid #c678dd',
    placeholderColor: '#7C73FFB8',
  }
}

</script>

<style lang="less">
@import url("./styles/colors.css");

body {
  margin: 0 !important;
  background-color: var(--bg-color);
  overflow-y: hidden;
}
@font-face {
  font-family: 'MiSans';
  src: url('../assets/MiSans-Regular.ttf'),
}

body {
  font-family: 'MiSans', sans-serif; /* 使用自定义字体和后备字体 */
}
.gamepad-div {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  border: 1px solid red;
  border-radius: 50%;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}
</style>