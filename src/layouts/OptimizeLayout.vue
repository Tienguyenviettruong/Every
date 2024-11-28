<template>
    <div class="optimize-layout">
      <aside class="sidebar" :class="{ collapsed: isCollapsed }">
        <div class="sidebar-container">
          <el-menu
            :collapse="isCollapsed"
            class="sidebar-menu"
            default-active="1"
          >
            <el-menu-item index="1">
              <el-icon><DataLine /></el-icon>
              <template #title>Performance Metrics</template>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon><TrendCharts /></el-icon>
              <template #title>Analytics</template>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><Monitor /></el-icon>
              <template #title>Monitoring</template>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon><Setting /></el-icon>
              <template #title>Settings</template>
            </el-menu-item>
          </el-menu>
          
          <div class="collapse-button" @click="toggleCollapse">
            <el-button type="text">
              <el-icon :size="20">
                <Fold v-if="!isCollapsed" />
                <Expand v-else />
              </el-icon>
            </el-button>
          </div>
        </div>
      </aside>
      <main class="optimize-main" :class="{ 'sidebar-collapsed': isCollapsed }">
        <slot></slot>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { DataLine, TrendCharts, Monitor, Setting, Fold, Expand } from '@element-plus/icons-vue'
  
  const isCollapsed = ref(false)
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }
  </script>
  
  <style scoped lang="scss">
  .optimize-layout {
    display: flex;
    min-height: calc(100vh - var(--header-height) - var(--footer-height));
  }
  
  .sidebar {
    position: fixed;
    top: var(--header-height);
    left: 0;
    bottom: var(--footer-height);
    width: var(--sidebar-width);
    background: var(--el-bg-color);
    border-right: 1px solid var(--el-border-color-light);
    transition: width 0.3s;
    z-index: 999;
  
    &.collapsed {
      width: 64px;
    }
  }
  
  .sidebar-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-menu {
    flex: 1;
    border-right: none;
  }
  
  .collapse-button {
    padding: 12px;
    text-align: center;
    border-top: 1px solid var(--el-border-color-light);
  }
  
  .optimize-main {
    flex: 1;
    margin-left: var(--sidebar-width);
    padding: 20px;
    background: var(--el-bg-color-page);
    transition: margin-left 0.3s;
  
    &.sidebar-collapsed {
      margin-left: 64px;
    }
  }
  </style> 