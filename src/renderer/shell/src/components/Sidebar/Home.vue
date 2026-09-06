<script setup lang="ts">
const openSettings = (): void => {
  window.cb.tabs.create('cb-chrome://settings')
}

const emit = defineEmits<{ goPage: [name: string]; goTop: [] }>()
</script>
<template>
  <m3e-action-list variant="segmented" class="action-list">
    <m3e-list-action @click="openSettings">
      设置
      <m3e-icon slot="trailing" name="open_in_new_window"></m3e-icon>
    </m3e-list-action>
    <m3e-list-action @click="emit('goPage', 'history')">
      历史记录
      <m3e-icon slot="trailing" name="chevron_right"></m3e-icon>
    </m3e-list-action>
  </m3e-action-list>
</template>
<style lang="scss" scoped></style>
