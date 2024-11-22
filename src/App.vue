<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from './composables/useTheme'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppFooter from './components/AppFooter.vue'

const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <template v-if="route.meta.requiresAuth === false">
    <router-view />
  </template>
  <div v-else class="layout">
    <header class="header">
      <AppHeader 
        :is-dark="isDark"
        @toggle-theme="toggleTheme"
      />
    </header>
    
    <div class="main-container">
      <aside class="sidebar" :class="{ collapsed: isCollapsed }">
        <AppSidebar :is-collapsed="isCollapsed" @toggle-collapse="toggleSidebar" />
      </aside>
      
      <main class="content">
        <router-view />
      </main>
    </div>

    <footer class="footer">
      <AppFooter />
    </footer>
  </div>
</template>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--el-bg-color);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 1000;
}

.main-container {
  padding-top: var(--header-height);
  padding-bottom: var(--footer-height);
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

.content {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: 20px;
  background: var(--el-bg-color-page);
  min-height: 100%;
  transition: margin-left 0.3s;

  .sidebar.collapsed + & {
    margin-left: 64px;
  }
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--el-bg-color);
  z-index: 998;
  // margin-left: var(--sidebar-width);
  transition: margin-left 0.3s;

  .sidebar.collapsed ~ & {
    margin-left: 64px;
  }
}
</style>