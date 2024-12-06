<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { MenuItem } from '@/types'

const { t } = useI18n()

interface Props {
  isCollapsed: boolean
  menuItems?: MenuItem[]
}

const props = withDefaults(defineProps<Props>(), {
  menuItems: () => [
    { icon: 'HomeFilled', title: 'menu.dashboard', path: '/' },
    { icon: 'Connection', title: 'menu.lifecycle', path: '/lifecycle' },
    { icon: 'DataAnalysis', title: 'menu.lab', path: '/lab' },
    { icon: 'Share', title: 'menu.workflow', path: '/workflow' }
  ]
})

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
      <el-menu-item 
        v-for="item in menuItems" 
        :key="item.path"
        :index="item.path"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <template #title>{{ t(item.title) }}</template>
      </el-menu-item>
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
  padding: 16px;
  text-align: center;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>