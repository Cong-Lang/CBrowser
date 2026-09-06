<script setup lang="ts">
import { History } from 'src/shared/types/history'
import { onMounted, ref } from 'vue'

const histories = ref<[string, History][]>([])

onMounted(async () => {
  histories.value = await window.cb.history.getHistorise(0, 200)
})
document.title = '设置 - 历史记录'
</script>

<template>
  <m3e-content-pane id="history">
    <m3e-heading variant="display" size="small">历史记录</m3e-heading>
    <m3e-action-list variant="segmented" class="action-list">
      <m3e-list-item v-for="history in histories" :key="history[0]">
        <m3e-avatar slot="leading">{{ history[1].title.slice(0, 1) }}</m3e-avatar>
        {{ history[1].title }}
        <m3e-icon slot="trailing" name="arrow_right"></m3e-icon>
      </m3e-list-item>
    </m3e-action-list>
  </m3e-content-pane>
</template>

<style lang="scss" scoped>
#history {
  height: 100%;
  --m3e-content-pane-container-color: var(--md-sys-color-surface-container-lowest);
  .action-list {
    margin: 16px 0;
    .item-text {
      display: inline-flex;
      align-items: center;
    }
  }
}
</style>
