<template>
  <ChatLayout>
    <div class="chat-container">
      <div class="chat-header">
        <div class="user-info">
          <el-avatar :src="currentChat?.avatar" :size="32" />
          <div class="user-status">
            <div class="username">{{ currentChat?.name }}</div>
            <div class="status">{{ currentChat?.status }}</div>
          </div>
        </div>
        <div class="header-actions">
          <el-button-group>
            <el-button>
              <el-icon><Message /></el-icon>
            </el-button>
            <el-button>
              <el-icon><Phone /></el-icon>
            </el-button>
          </el-button-group>
        </div>
      </div>

      <div class="messages-container" ref="messagesContainer">
        <div v-for="msg in messages" :key="msg.id" 
             class="message" 
             :class="{ 'message-own': msg.sender === currentUser.name }">
          <div class="message-content">
            <div class="text">{{ msg.content }}</div>
            <div class="message-footer">
              <span class="time">{{ msg.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <div class="input-wrapper">
          <el-input
            v-model="newMessage"
            type="textarea"
            :rows="1"
            :autosize="{ minRows: 1, maxRows: 4 }"
            placeholder="Type a message..."
            resize="none"
            @keyup.enter="sendMessage"
          />
          <div class="actions-row">
            <div class="left-actions">
              <el-button type="text">
                <el-icon><Plus /></el-icon>
              </el-button>
              <el-button type="text">
                <el-icon><PictureFilled /></el-icon>
              </el-button>
              <el-button type="text">
                <el-icon><Microphone /></el-icon>
              </el-button>
            </div>
            <el-button type="primary" class="send-btn" @click="sendMessage" circle>
              <el-icon><Position /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </ChatLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatLayout from '../layouts/ChatLayout.vue'
import { Message, Phone, PictureFilled, Microphone, Plus, Position } from '@element-plus/icons-vue'

const currentUser = ref({
  name: 'wangxinhao',
  avatar: 'https://avatars.githubusercontent.com/u/2?v=4'
})

const currentChat = ref({
  name: 'Team Discussion',
  status: 'Active now',
  avatar: 'https://avatars.githubusercontent.com/u/3?v=4'
})

const messages = ref([
  {
    id: 1,
    sender: 'guyixuan',
    content: 'Hi, how are you?',
    time: '10:00',
    avatar: 'https://avatars.githubusercontent.com/u/3?v=4'
  },
  {
    id: 2,
    sender: 'wangxinhao',
    content: 'I\'m good, thanks! How about you?',
    time: '10:01',
    avatar: currentUser.value.avatar
  }
])

const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: Date.now(),
      sender: currentUser.value.name,
      content: newMessage.value,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      }),
      avatar: currentUser.value.avatar
    })
    newMessage.value = ''
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>

<style scoped lang="scss">
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
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
  }
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  .message {
    margin-bottom: 16px;
    display: flex;
    
    &.message-own {
      justify-content: flex-end;
      
      .message-content {
        .text {
          background: var(--el-color-primary-light-8);
        }
      }
    }

    .message-content {
      max-width: 70%;

      .text {
        background: var(--el-fill-color-lighter);
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 4px;
      }

      .message-footer {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        text-align: right;
      }
    }
  }
}

.chat-input {
  padding: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-radius: 8px;
    padding: 8px;
    background: white;

    .el-input {
      :deep(.el-input__wrapper) {
        box-shadow: none;
        padding: 0;
        background: white;
      }

      :deep(.el-textarea__inner) {
        border: none;
        padding: 4px;
        min-height: 24px !important;
        max-height: 120px;
        box-shadow: none !important;
        background: white;
        font-size: 14px;
        resize: none;
        outline: none !important;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
        
        &:focus {
          box-shadow: none !important;
          border: none !important;
          outline: none !important;
        }

        &::placeholder {
          color: #9ca3af;
        }
      }
    }

    .actions-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 4px;

      .left-actions {
        display: flex;
        gap: 4px;
      }

      .el-button {
        padding: 8px;
        color: #666;
        
        &:hover {
          color: var(--el-color-primary);
          background: var(--el-fill-color-light);
        }
      }

      .send-btn {
        width: 32px;
        height: 32px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #6366f1;
        border-color: #6366f1;
        color: white;

        &:hover {
          background: #4f46e5;
          border-color: #4f46e5;
        }

        .el-icon {
          font-size: 16px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .chat-header {
    padding: 12px;

    .user-info {
      gap: 8px;
    }
  }

  .messages-container {
    padding: 12px;

    .message {
      .message-content {
        max-width: 85%;
      }
    }
  }

  .chat-input {
    padding: 12px;

    .input-wrapper {
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}

@media (max-width: 480px) {
  .chat-header {
    .header-actions {
      .el-button-group {
        display: none;
      }
    }
  }

  .messages-container {
    .message {
      .message-content {
        max-width: 90%;
      }
    }
  }

  .chat-input {
    .input-wrapper {
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}
</style> 