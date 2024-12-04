<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ChatConversation } from '@/types'

const router = useRouter()
const conversations = ref<ChatConversation[]>([
  { id: 1, title: 'Chat 1', timestamp: '2024-03-20 10:00' },
  { id: 2, title: 'Chat 2', timestamp: '2024-03-20 11:30' },
])

const createNewChat = () => {
  router.push('/chat/new')
}

const selectChat = (id: number) => {
  router.push(`/chat/${id}`)
}
</script>

<template>
  <div class="chat-sidebar-container">
    <div class="top-section">
      <div class="icon-group">
        <el-tooltip content="New Chat" placement="right">
          <el-button type="text" @click="createNewChat">
            <el-icon><Plus /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="Recent Chats" placement="right">
          <el-button type="text">
            <el-icon><ChatDotRound /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="Saved Items" placement="right">
          <el-button type="text">
            <el-icon><StarFilled /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="Search" placement="right">
          <el-button type="text">
            <el-icon><Search /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <div class="bottom-section">
      <div class="icon-group">
        <el-tooltip content="Settings" placement="right">
          <el-button type="text">
            <el-icon><Setting /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="Help" placement="right">
          <el-button type="text">
            <el-icon><QuestionFilled /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="Profile" placement="right">
          <el-button type="text">
            <el-icon><User /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-sidebar-container {
  width: 48px;
  min-width: 48px;
  height: 100%;
  background: transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--sidebar-bg-color, #2C2C2C);
  color: var(--sidebar-text-color, white);
}

.icon-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 0;

  :deep(.el-button) {
    color: var(--icon-color, #A8A8A8);
    width: 32px;
    height: 32px;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      background-color: var(--hover-bg-color, rgba(255, 255, 255, 0.05));
      color: var(--hover-text-color, white);
    }

    .el-icon {
      font-size: 16px;
    }
  }
}

.top-section {
  flex: 1;
}

.bottom-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style> 