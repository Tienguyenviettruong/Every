<template>
    <div class="lab-layout">
      <aside class="lab-sidebar" :class="{ collapsed: isCollapsed }">
        <div class="sidebar-container">
          <el-menu
            :collapse="isCollapsed"
            class="sidebar-menu"
            default-active="1"
          >
            <el-menu-item index="1">
              <el-icon><DataAnalysis /></el-icon>
              <template #title>Data Analysis</template>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon><Document /></el-icon>
              <template #title>Notebooks</template>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><Files /></el-icon>
              <template #title>Datasets</template>
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
      <main class="lab-main" :class="{ 'sidebar-collapsed': isCollapsed }">
        <slot></slot>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { DataAnalysis, Document, Files, Fold, Expand } from '@element-plus/icons-vue'
  
  const isCollapsed = ref(false)
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }
  </script>
  
  <style scoped lang="scss">
  .lab-layout {
    display: flex;
    min-height: calc(100vh - var(--header-height) - var(--footer-height));
  }
  
  .lab-sidebar {
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
  
  .lab-main {
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