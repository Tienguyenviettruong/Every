<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  isCollapsed: boolean
}>()

defineEmits<{
  (e: 'toggleCollapse'): void
}>()
</script>

<template>
  <div class="sidebar-container">
    <el-menu
      :collapse="isCollapsed"
      class="sidebar-menu"
      default-active="1"
      router
    >
      <el-menu-item index="/">
        <el-icon><HomeFilled /></el-icon>
        <template #title>{{ t('menu.dashboard') }}</template>
      </el-menu-item>
      
      <el-menu-item index="/lifecycle">
        <el-icon><Connection /></el-icon>
        <template #title>{{ t('menu.lifecycle') }}</template>
      </el-menu-item>
      
      <el-sub-menu index="2">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>{{ t('menu.pages') }}</span>
        </template>
        <el-menu-item index="/profile">{{ t('menu.profile') }}</el-menu-item>
        <el-menu-item index="/settings">{{ t('menu.settings') }}</el-menu-item>
      </el-sub-menu>
    </el-menu>
    
    <div class="collapse-button" @click="$emit('toggleCollapse')">
      <el-button type="text">
        <el-icon :size="20">
          <Fold v-if="!isCollapsed" />
          <Expand v-else />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  
  &:not(.el-menu--collapse) {
    width: 200px;
  }
}

.collapse-button {
  // padding: 16px;
  text-align: center;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>