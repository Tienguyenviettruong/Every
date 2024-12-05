<script setup lang="ts">
import { ref, nextTick } from 'vue'
import ChatLayout from '../layouts/ChatLayout.vue'
import ChatFileUpload from '../components/chat/ChatFileUpload.vue'
import { Message, Phone, Microphone, Plus, Position } from '@element-plus/icons-vue'

interface FileMessage {
  name: string
  type: string
  size: number
  data: string
  timestamp: string
}

interface ChatMessage {
  id: number
  sender: string
  content: string
  time: string
  avatar: string
  file?: FileMessage
}

interface MessagesMap {
  [key: number]: ChatMessage[]
}

const currentUser = ref({
  name: 'wangxinhao',
  avatar: 'https://avatars.githubusercontent.com/u/2?v=4'
})

const currentChat = ref({
  id: 1,
  name: 'Team Discussion',
  status: 'Online',
  avatar: 'https://avatars.githubusercontent.com/u/3?v=4'
})

const allMessages = ref<MessagesMap>({
  1: [
    {
      id: 1,
      sender: 'Team Discussion',
      content: 'Welcome to team chat!',
      time: '10:00',
      avatar: 'https://avatars.githubusercontent.com/u/3?v=4'
    }
  ],
  2: [
    {
      id: 2,
      sender: 'Design Team',
      content: 'Check out the new designs',
      time: '09:30',
      avatar: 'https://avatars.githubusercontent.com/u/4?v=4'
    }
  ],
  3: [
    {
      id: 3,
      sender: 'Sarah Johnson',
      content: 'Hi there!',
      time: '11:00',
      avatar: 'https://avatars.githubusercontent.com/u/5?v=4'
    }
  ]
})

const messages = ref(allMessages.value[1])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()

const handleChatSelect = (chat: { id: number; name: string; status: string; avatar: string; } | { id: number; name: string; status: string; avatar: string; }) => {
  console.log('Selected chat:', chat)
  currentChat.value = chat
  messages.value = allMessages.value[chat.id] || []
  nextTick(() => {
    scrollToBottom()
  })
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    const newMsg = {
      id: Date.now(),
      sender: currentUser.value.name,
      content: newMessage.value,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      }),
      avatar: currentUser.value.avatar
    }

    if (!allMessages.value[currentChat.value.id]) {
      allMessages.value[currentChat.value.id] = []
    }

    allMessages.value[currentChat.value.id].push(newMsg)
    messages.value = allMessages.value[currentChat.value.id]
    
    newMessage.value = ''
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const handleFileUploaded = (fileData: FileMessage) => {
  const newMsg = {
    id: Date.now(),
    sender: currentUser.value.name,
    content: `File: ${fileData.name}`,
    time: new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    }),
    avatar: currentUser.value.avatar,
    file: fileData
  }

  if (!allMessages.value[currentChat.value.id]) {
    allMessages.value[currentChat.value.id] = []
  }

  allMessages.value[currentChat.value.id].push(newMsg)
  messages.value = allMessages.value[currentChat.value.id]
  
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>

<template>
  <ChatLayout @select-chat="handleChatSelect">
    <div class="chat-container">
      <div class="chat-header">
        <div class="user-info">
          <div class="avatar-wrapper">
            <el-avatar :src="currentChat?.avatar" :size="32" />
            <span class="status-dot" :class="{ online: currentChat?.status === 'Online' }"></span>
          </div>
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

      <div class="messages-wrapper">
        <div class="messages-container" ref="messagesContainer">
          <div v-for="msg in messages" :key="msg.id" 
               class="message" 
               :class="{ 'message-own': msg.sender === currentUser.name }">
            <el-avatar :src="msg.avatar" :size="24" class="message-avatar" />
            <div class="message-content">
              <template v-if="msg.file">
                <div class="file-message">
                  <div class="file-preview" v-if="msg.file.type.startsWith('image/')">
                    <img :src="msg.file.data" :alt="msg.file.name">
                  </div>
                  <div class="file-info">
                    <el-icon><Document /></el-icon>
                    <span class="file-name">{{ msg.file.name }}</span>
                    <span class="file-size">{{ (msg.file.size / 1024).toFixed(1) }}KB</span>
                  </div>
                </div>
              </template>
              <div class="text" v-else>{{ msg.content }}</div>
              <div class="message-footer">
                <span class="time">{{ msg.time }}</span>
                <span v-if="currentChat" 
                      class="status" 
                      :class="{'online': msg.sender === currentChat.name && currentChat.status === 'Online'}">
                  {{ msg.sender === currentChat.name ? currentChat.status : '' }}
                </span>
              </div>
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
              <ChatFileUpload @file-uploaded="handleFileUploaded" />
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

<style scoped lang="scss">
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-header {
  flex-shrink: 0;
}

.messages-wrapper {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow-y: hidden;
}

.messages-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  padding: 20px;
}

.chat-input {
  flex-shrink: 0;
}

.chat-container {
  font-family: "Times New Roman", Times, serif;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .avatar-wrapper {
      position: relative;
      
      .status-dot {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #909399;
        border: 2px solid white;
        
        &.online {
          background: #67C23A;
        }
      }
    }

    .user-status {
      .username {
        font-weight: 500;
      }
      
      .status {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  .message {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 16px;

    .message-avatar {
      order: 1;
    }

    .message-content {
      order: 2;
      max-width: 70%;

      .text {
        background: var(--el-fill-color-lighter);
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 4px;
      }
      .file-message {
        background: var(--el-fill-color-lighter);
        border-radius: 8px;
        overflow: hidden;

        .file-preview {
          width: 100%;
          max-height: 200px;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
      .file-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          
          .el-icon {
            font-size: 20px;
            color: var(--el-color-primary);
          }
          
          .file-name {
            flex: 1;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .file-size {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      
      .message-footer {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        text-align: right;
      }
    }

    &.message-own {
      flex-direction: row-reverse;
      
      .message-content {
        .text {
          background: var(--el-color-primary);
          color: white;
        }
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
      }

      :deep(.el-textarea__inner) {
        border: none;
        padding: 4px;
        min-height: 24px !important;
        max-height: 120px;
        box-shadow: none !important;
        background: transparent;
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