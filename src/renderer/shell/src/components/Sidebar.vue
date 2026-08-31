<script setup lang="ts">
import { ref } from 'vue'

const openSettings = (): void => {
  window.cb.tabs.create('cb-chrome://settings')
}
const isHome = ref(true)
</script>
<template>
  <div id="sidebar">
    <m3e-app-bar class="app-bar" for="sidebar">
      <m3e-icon-button slot="leading" aria-label="Back">
        <m3e-icon name="arrow_back"></m3e-icon>
        <m3e-drawer-toggle v-if="isHome" for="nav-drawer"></m3e-drawer-toggle>
      </m3e-icon-button>
      <span slot="title">首页</span>
    </m3e-app-bar>
    <div class="content">
      <m3e-action-list variant="segmented" class="action-list">
        <m3e-list-action @click="openSettings"
          >设置 <m3e-icon slot="trailing" name="open_in_new_window"></m3e-icon
        ></m3e-list-action>
      </m3e-action-list>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#sidebar {
  width: 300px;
  box-sizing: border-box;
  overflow-y: auto;
  height: 100%;
  .app-bar {
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .content {
    padding: 12px;
  }
}
</style>
