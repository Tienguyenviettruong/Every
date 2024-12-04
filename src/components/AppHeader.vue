<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ref, onUnmounted, onMounted, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { invoke } from '@tauri-apps/api/core'
import avatar from '../assets/avatar/avatar.jpg'

const { t, locale } = useI18n()
const router = useRouter()

const showSearch = ref(false)
const searchText = ref('')

defineProps<{
  isDark: boolean
}>()

defineEmits<{
  (e: 'toggleTheme'): void
}>()

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const changeLanguage = (lang: string) => {
  locale.value = lang
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    showSearch.value = true
  }
}

const openChatWindow = async () => {
  try {
    await invoke('open_chat_window')
  } catch (error) {
    console.error('Failed to open chat window:', error)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const isMac = computed(() => {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0
})
</script>

<template>
  <div class="header">
    <div class="left">
      <img src="../assets/logo.svg" alt="Tauri" class="logo" />
      <div class="search-container">
        <el-input
          v-model="searchText"
          placeholder="Search..."
          :prefix-icon="Search"
          class="search-input"
          @click="showSearch = true"
        >
          <template #suffix>
            <span class="shortcut-hint">{{ isMac ? '⌘K' : 'Ctrl+K' }}</span>
          </template>
        </el-input>
      </div>
    </div>
    
    <div class="right">
      <el-button type="text" @click="router.back()">
        <el-icon :size="20">
          <ArrowLeft />
        </el-icon>
        Back
      </el-button>
      
      <el-button type="text" @click="openChatWindow">
        <el-icon :size="20">
          <ChatDotRound />
        </el-icon>
      </el-button>
      
      <el-dropdown @command="changeLanguage">
        <el-button type="text">
          <img src="../assets/icon/lang.png" alt="Language" width="16" height="16" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="en">English</el-dropdown-item>
            <el-dropdown-item command="zh">中文</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
      <el-button type="text" @click="$emit('toggleTheme')">
        <el-icon :size="20">
          <Moon v-if="!isDark" />
          <Sunny v-else />
        </el-icon>
      </el-button>
      
      <el-dropdown @command="handleLogout">
        <el-avatar 
          :size="32" 
          :src="avatar"
          style="border: 2px solid var(--el-border-color); box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>{{ t('header.profile') }}</el-dropdown-item>
            <el-dropdown-item>{{ t('header.settings') }}</el-dropdown-item>
            <el-dropdown-item divided command="logout">
              {{ t('header.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <el-dialog
    v-model="showSearch"
    title="Search"
    width="50%"
    :show-close="true"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
  >
    <div class="search-dialog-content">
      <el-input
        v-model="searchText"
        placeholder="Type to search..."
        :prefix-icon="Search"
        autofocus
      />
      <div class="search-results">
        <div class="no-results" v-if="!searchText">
          <p class="hint">No recent searches</p>
        </div>
        <div class="search-footer">
          <div class="keyboard-shortcuts">
            <span><kbd>↑↓</kbd> to select</span>
            <span><kbd>↵</kbd> to navigate</span>
            <span><kbd>esc</kbd> to close</span>
          </div>
          <div class="powered-by">
            Search by
            <img src="../assets/algolia-logo.svg" alt="Algolia" height="16" />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  
  .left {
    display: flex;
    align-items: center;
    gap: 20px;
    
    .logo {
      height: 32px;
    }
    
    .search-container {
      position: relative;
      
      .search-input {
        width: 240px;
        border-radius: 20px;
        background: var(--el-fill-color-blank);
        
        :deep(.el-input__wrapper) {
          background: var(--el-fill-color-light);
          box-shadow: none;
          border-radius: 16px;
          padding-right: 8px;
        }
        
        :deep(.el-input__inner) {
          font-size: 14px;
        }
      }
      
      .shortcut-hint {
        color: var(--el-text-color-secondary);
        font-size: 12px;
        background: var(--el-fill-color);
        padding: 2px 4px;
        border-radius: 4px;
      }
    }
  }
  
  .right {
    display: flex;
    align-items: center;
    gap: 20px;
  }
}

.search-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .search-results {
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .no-results {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 0;

      .hint {
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }
    }

    .search-footer {
      border-top: 1px solid var(--el-border-color-lighter);
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--el-text-color-secondary);
      font-size: 12px;

      .keyboard-shortcuts {
        display: flex;
        gap: 12px;

        kbd {
          background: var(--el-fill-color-light);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--el-border-color);
        }
      }

      .powered-by {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
  }
}
</style>