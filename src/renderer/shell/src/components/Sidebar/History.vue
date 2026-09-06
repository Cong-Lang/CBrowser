<script setup lang="ts">
import { History, HistoryState } from 'src/shared/types/history'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

const emit = defineEmits<{ goPage: [name: string]; goTop: [] }>()
const historise = ref<[string, History][]>([])
const autoReloadRef = useTemplateRef('autoReload')
const isScrollDown = ref(false)
const isIntersecting = ref(false)
const haveNewHistorise = ref(false)
const stopListening = window.cb.history.onState((state: HistoryState) => {
  if (JSON.stringify(state) !== JSON.stringify(historise.value)) {
    haveNewHistorise.value = true
    reloadIsScrollDown()
    console.log(state, historise.value)
  }
})

onMounted(async () => {
  reloadHistorise()
  console.log(historise.value)

  if (!autoReloadRef.value) return
  const autoReloadObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isIntersecting.value = entry.isIntersecting
      reloadIsScrollDown()
    })
  })
  autoReloadObserver.observe(autoReloadRef.value)
})

onUnmounted(() => {
  stopListening()
})

const scrollToStart = (): void => {
  emit('goTop')
}

const openUrl = (url: string): void => {
  window.cb.tabs.create(url)
}

const reloadIsScrollDown = (): void => {
  isScrollDown.value = !isIntersecting.value && haveNewHistorise.value
}

const reloadHistorise = async (): Promise<void> => {
  historise.value = await window.cb.history.getHistorise(0, 200)
  haveNewHistorise.value = false
}

const clickNewHistorise = async (): Promise<void> => {
  scrollToStart()
  await reloadHistorise()
  reloadIsScrollDown()
}
</script>
<template>
  <div id="history">
    <div ref="autoReload" class="auto-reload"></div>
    <Transition name="top-tip">
      <div v-if="isScrollDown" class="top-tip">
        <m3e-button variant="filled" class="top-tip-button" @click="clickNewHistorise">
          <m3e-icon slot="icon" name="arrow_upward"></m3e-icon>
          新记录
        </m3e-button>
      </div>
    </Transition>
    <m3e-action-list variant="segmented" class="action-list">
      <m3e-list-action
        v-for="history in [...historise].reverse()"
        :key="history[0]"
        class="action"
        @click="openUrl(history[0])"
      >
        <span class="action-text">{{ history[1].title }}</span>
        <span slot="supporting-text" class="action-text">{{ history[0] }}</span>
      </m3e-list-action>
    </m3e-action-list>
  </div>
</template>
<style lang="scss" scoped>
#history {
  height: 100%;
  width: 100%;
  .top-tip {
    position: absolute;
    top: 80px;
    left: 0;
    z-index: 10;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .auto-reload {
    height: 0px;
    width: 100%;
  }
  .action-list {
    .action {
      width: 100%;
      .action-text {
        display: -webkit-box;
        word-break: break-all;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.top-tip-enter-active,
.top-tip-leave-active {
  transition: all 0.35s cubic-bezier(0.42, 1.67, 0.21, 0.9);
}
.top-tip-enter-from {
  opacity: 0;
  transform: translateY(-80px);
}
.top-tip-leave-to {
  opacity: 0;
  transform: translateY(-80px);
}
</style>
