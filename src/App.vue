<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from './composables/useTheme'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppFooter from './components/AppFooter.vue'
import ChatSidebar from './components/chat/ChatSidebar.vue'

const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const isCollapsed = ref(false)

const showDefaultSidebar = computed(() => {
  return !route.meta.layout || route.meta.layout !== 'optimize' && route.meta.layout !== 'lab'
})

const showDefaultLayout = computed(() => {
  return !route.meta.layout || route.meta.layout !== 'chat'
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <template v-if="route.meta.requiresAuth === false">
    <router-view />
  </template>
  <template v-else-if="!showDefaultLayout">
    <div class="chat-layout">
      <ChatSidebar />
      <main class="chat-content">
        <router-view />
      </main>
    </div>
  </template>
  <div v-else class="layout">
    <header class="header">
      <AppHeader 
        :is-dark="isDark"
        @toggle-theme="toggleTheme"
      />
    </header>
    
    <div class="main-container">
      <aside v-if="showDefaultSidebar" class="sidebar" :class="{ collapsed: isCollapsed }">
        <AppSidebar :is-collapsed="isCollapsed" @toggle-collapse="toggleSidebar" />
      </aside>
      
      <main class="content" :class="{ 'no-default-sidebar': !showDefaultSidebar }">
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
  background: rgb(194, 195, 196);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 1000;
}

.main-container {
  padding-top: var(--header-height);
  padding-bottom: var(--footer-height);
  display: flex;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
}

.chat-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #343541;
}

.chat-sidebar {
  width: 48px;
  min-width: 48px;
  height: 100%;
  background: transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-content {
  flex: 1;
  height: 100%;
  // background: #343541;
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

  &.no-default-sidebar {
    margin-left: 0;
  }

  &.lab-layout {
    padding: 0;
  }
  
  .sidebar.collapsed + & {
    margin-left: 64px;
  }
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--footer-height);
  background: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-light);
  z-index: 998;
}
</style>