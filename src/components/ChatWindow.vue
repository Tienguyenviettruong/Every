<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: number
  sender: string
  content: string
  time: string
  avatar: string
}

const messages = ref<Message[]>([
  {
    id: 1,
    sender: 'wangxinhao',
    content: '这是发内容测试通知的内容...',
    time: '10:00',
    avatar: 'https://avatars.githubusercontent.com/u/2?v=4'
  },
  {
    id: 2,
    sender: 'guyixuan',
    content: '这是发内容测试通知的内容...',
    time: '09:30',
    avatar: 'https://avatars.githubusercontent.com/u/3?v=4'
  }
])

const newMessage = ref('')
const isOpen = ref(false)

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: Date.now(),
      sender: 'wangxinhao',
      content: newMessage.value,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      avatar: 'https://avatars.githubusercontent.com/u/2?v=4'
    })
    newMessage.value = ''
  }
}

defineExpose({
  isOpen,
})
</script>

<template>
  <div v-if="isOpen" class="chat-window">
    <div class="chat-header">
      <div class="user-info">
        <img src="https://avatars.githubusercontent.com/u/2?v=4" alt="avatar" class="avatar" />
        <div class="user-status">
          <div class="username">wangxinhao</div>
          <div class="status">在线</div>
        </div>
      </div>
      <el-button type="text" @click="isOpen = false">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>

    <div class="chat-messages">
      <div v-for="msg in messages" :key="msg.id" class="message">
        <img :src="msg.avatar" alt="avatar" class="avatar" />
        <div class="message-content">
          <div class="message-header">
            <span class="sender">{{ msg.sender }}</span>
            <span class="time">{{ msg.time }}</span>
          </div>
          <div class="text">{{ msg.content }}</div>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <div class="input-actions">
        <el-button type="text">
          <el-icon><SmileFilled /></el-icon>
        </el-button>
        <el-button type="text">
          <el-icon><PictureFilled /></el-icon>
        </el-button>
      </div>
      <div class="input-container">
        <el-input
          v-model="newMessage"
          placeholder="输入消息..."
          @keyup.enter="sendMessage"
        />
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-window {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 360px;
  height: 600px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .user-status {
      .username {
        font-weight: 500;
      }
      .status {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f5f7fa;

  .message {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .message-content {
      flex: 1;

      .message-header {
        margin-bottom: 4px;

        .sender {
          font-weight: 500;
          margin-right: 8px;
        }

        .time {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }

      .text {
        background: white;
        padding: 8px 12px;
        border-radius: 4px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }
    }
  }
}

.chat-input {
  padding: 16px;
  border-top: 1px solid var(--el-border-color-lighter);

  .input-actions {
    margin-bottom: 8px;
  }

  .input-container {
    display: flex;
    gap: 8px;

    .el-input {
      flex: 1;
    }
  }
}
</style>