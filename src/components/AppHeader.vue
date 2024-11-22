<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {} from '@element-plus/icons-vue'
const { t, locale } = useI18n()
const router = useRouter()

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
</script>

<template>
  <div class="header">
    <div class="left">
      <img src="../assets/logo.svg" alt="Tauri" class="logo" />
      <el-input
        placeholder="Search..."
        prefix-icon="Search"
        class="search-input"
      />
    </div>
    
    <div class="right">
      <el-dropdown @command="changeLanguage">
        <el-button type="text">
          <el-icon><Language /></el-icon>
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
        <el-avatar :size="32" src="../assets/avatar/avatar.jpg" />
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
    
    .search-input {
      width: 200px;
    }
  }
  
  .right {
    display: flex;
    align-items: center;
    gap: 20px;
  }
}
</style>