<template>
  <div class="chat-layout">
    <aside class="chat-sidebar">
      <div class="sidebar-header">
        <div class="header-title">Inbox</div>
        <el-button type="primary" class="compose-btn">
          + New Conversation
        </el-button>
      </div>
      
      <div class="conversations">
        <div 
          v-for="chat in chats" 
          :key="chat.id"
          class="conversation-item"
          :class="{ active: chat.id === activeChat }"
          @click="activeChat = chat.id"
        >
          <el-avatar :src="chat.avatar" :size="32" class="chat-avatar" />
          <div class="conversation-info">
            <div class="name">{{ chat.name }}</div>
            <div class="last-message">{{ chat.lastMessage }}</div>
          </div>
          <div v-if="chat.unread" class="unread-dot"></div>
        </div>
      </div>
    </aside>

    <main class="chat-main">
      <slot></slot>
    </main>

    <aside class="chat-details">
      <div class="user-profile">
        <el-avatar :src="currentChat?.avatar" :size="64" />
        <div class="profile-info">
          <h3>{{ currentChat?.name }}</h3>
          <div class="profile-link">{{ currentChat?.email }}</div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stat-row">
          <div class="stat-value">2,648</div>
          <div class="stat-label">Total Messages</div>
        </div>
        <div class="stat-chart">
          <div class="chart-bar">
            <div class="positive" style="width: 89.6%"></div>
            <div class="negative" style="width: 10.4%"></div>
          </div>
          <div class="chart-labels">
            <span class="positive">89.6%</span>
            <span class="negative">10.4%</span>
          </div>
        </div>
      </div>

      <div class="attachments-section">
        <h4>Related Files</h4>
        <div class="attachment-grid">
          <div v-for="file in recentFiles" :key="file.id" class="attachment-item">
            <el-image :src="file.thumbnail" fit="cover" />
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped lang="scss">
.chat-layout {
  display: flex;
  min-height: calc(100vh - var(--header-height) - var(--footer-height) - 42px);
  border-radius: 20px;
  background: #f5f7fa;
  border: 1px solid #e6e6e6;
//   margin: 20px;
  overflow: hidden;
}

.chat-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e6e6e6;

  .header-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .compose-btn {
    width: 100%;
    height: 36px;
  }
}

.conversations {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover, &.active {
    background: #f5f7fa;
  }

  .chat-avatar {
    flex-shrink: 0;
  }

  .conversation-info {
    flex: 1;
    min-width: 0;

    .name {
      font-size: 14px;
      margin-bottom: 4px;
    }

    .last-message {
      font-size: 12px;
      color: #999;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .unread-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #409eff;
  }
}

.chat-main {
  flex: 1;
  background: white;
  border-right: 1px solid #e6e6e6;
}

.chat-details {
  width: 300px;
  background: white;
  padding: 24px;

  .user-profile {
    text-align: center;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e6e6e6;

    .profile-info {
      margin-top: 16px;

      h3 {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .profile-link {
        font-size: 13px;
        color: #409eff;
      }
    }
  }

  .stats-section {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e6e6e6;

    .stat-row {
      margin-bottom: 16px;

      .stat-value {
        font-size: 24px;
        font-weight: 500;
        color: #409eff;
      }

      .stat-label {
        font-size: 13px;
        color: #999;
      }
    }

    .stat-chart {
      .chart-bar {
        height: 4px;
        background: #f5f5f5;
        border-radius: 2px;
        display: flex;
        overflow: hidden;
        margin-bottom: 8px;

        .positive {
          background: #67c23a;
          height: 100%;
        }

        .negative {
          background: #f56c6c;
          height: 100%;
        }
      }

      .chart-labels {
        display: flex;
        justify-content: space-between;
        font-size: 12px;

        .positive {
          color: #67c23a;
        }

        .negative {
          color: #f56c6c;
        }
      }
    }
  }

  .attachments-section {
    h4 {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .attachment-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;

      .attachment-item {
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
        
        .el-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}

// Responsive styles
@media (max-width: 1200px) {
  .chat-details {
    width: 280px;
  }
}

@media (max-width: 992px) {
  .chat-sidebar {
    width: 240px;
  }
}

@media (max-width: 768px) {
  .chat-sidebar, .chat-details {
    position: fixed;
    top: 0;
    bottom: calc(var(--footer-height) + 10px);
    z-index: 100;
    background: white;
  }

  .chat-sidebar {
    left: 0;
    transform: translateX(-100%);
    transition: transform 0.3s;

    &.show {
      transform: translateX(0);
    }
  }

  .chat-details {
    right: 0;
    transform: translateX(100%);
    transition: transform 0.3s;

    &.show {
      transform: translateX(0);
    }
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'

const activeChat = ref(1)

const chats = ref([
  {
    id: 1,
    name: 'Megan',
    avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    lastMessage: 'New message notification has been turned off',
    email: 'megan@example.com',
    unread: true
  },
  {
    id: 2,
    name: 'Friendship Link Group',
    avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
    lastMessage: 'Latest message...',
    email: 'group@example.com',
    unread: false
  }
])

const currentChat = ref(chats.value[0])

const recentFiles = ref([
  { id: 1, thumbnail: '/demo/thumbnail1.jpg' },
  { id: 2, thumbnail: '/demo/thumbnail2.jpg' },
  { id: 3, thumbnail: '/demo/thumbnail3.jpg' },
  { id: 4, thumbnail: '/demo/thumbnail4.jpg' }
])
</script> 