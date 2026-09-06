<script setup lang="ts">
import { defineAsyncComponent, markRaw, ref, shallowRef, useTemplateRef } from 'vue'

const pages = shallowRef({
  home: {
    isHome: true,
    name: 'home',
    title: '首页',
    component: markRaw(defineAsyncComponent(() => import('./Sidebar/Home.vue')))
  },
  history: {
    isHome: false,
    name: 'history',
    title: '历史记录',
    component: markRaw(defineAsyncComponent(() => import('./Sidebar/History.vue')))
  }
})
const currentPage = ref(pages.value.home)
const endPage = ref(true)
const historyPages = ref<(typeof pages.value)[keyof typeof pages.value][]>([pages.value.home])
const scrollContentRef = useTemplateRef('scrollContent')

const goPage = (pageName: string): void => {
  if (!(pageName in pages.value)) return
  endPage.value = false
  historyPages.value.push(currentPage.value)
  currentPage.value = pages.value[pageName]
}

const backPage = (): void => {
  if (endPage.value) return
  currentPage.value = historyPages.value[historyPages.value.length - 1]
  historyPages.value.pop()
  if (historyPages.value.length - 1 <= 0) {
    endPage.value = true
  }
}

const scrollToStart = (): void => {
  if (!scrollContentRef.value) return
  scrollContentRef.value.scrollTo({
    behavior: 'smooth',
    top: 0
  })
}
</script>
<template>
  <div id="sidebar" ref="scrollContent">
    <m3e-app-bar class="app-bar" for="sidebar">
      <m3e-icon-button slot="leading" aria-label="Back" @click="backPage">
        <m3e-icon name="arrow_back"></m3e-icon>
        <m3e-drawer-toggle v-if="endPage" for="nav-drawer"></m3e-drawer-toggle>
      </m3e-icon-button>
      <span slot="title">{{ currentPage.title }}</span>
    </m3e-app-bar>
    <div class="content">
      <Transition name="list" mode="out-in">
        <component
          :is="currentPage.component"
          :key="currentPage.name"
          class="component"
          @go-page="goPage"
          @go-top="scrollToStart"
        ></component>
      </Transition>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#sidebar {
  width: 300px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  .app-bar {
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .content {
    padding: 12px;
    box-sizing: border-box;
    width: 100%;
    .component {
      transform-origin: center;
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
}
.list-enter-from {
  opacity: 0;
  transform: scale(1.1);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
