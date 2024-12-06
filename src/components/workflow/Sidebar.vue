<script setup lang="ts">
const workflowBlocks = [
  {
    category: 'General',
    items: [
      { type: 'Trigger', icon: 'Lightning', description: 'Start workflow', color: '#FFD43B' },
      { type: 'Execute Workflow', icon: 'Connection', description: 'Run another workflow', color: '#E9ECEF' },
      { type: 'Delay', icon: 'Timer', description: 'Add time delay', color: '#E9ECEF' },
      { type: 'Export Data', icon: 'Download', description: 'Export workflow data', color: '#E9ECEF' },
      { type: 'Repeat Task', icon: 'RefreshRight', description: 'Repeat an action', color: '#E9ECEF' },
      { type: 'HTTP Request', icon: 'Connection', description: 'Make API calls', color: '#E9ECEF' },
      { type: 'While Loop', icon: 'CircleClose', description: 'Loop while condition', color: '#E9ECEF' },
      { type: 'Loop Data', icon: 'RefreshLeft', description: 'Loop through data', color: '#E9ECEF' },
      { type: 'Loop Break', icon: 'CircleClose', description: 'Break from loop', color: '#E9ECEF' },
      { type: 'Blocks Group', icon: 'Files', description: 'Group of blocks', color: '#E9ECEF' },
      { type: 'Clipboard', icon: 'Document', description: 'Copy to clipboard', color: '#E9ECEF' },
      { type: 'Insert Data', icon: 'DocumentAdd', description: 'Insert data', color: '#E9ECEF' }
    ]
  }
]

const onDragStart = (event: DragEvent, block: any) => {
  if (event.dataTransfer) {
    const nodeData = {
      type: block.type,
      icon: block.icon,
      color: block.color
    }
    event.dataTransfer.setData('application/json', JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = 'move'
    
    console.log('Drag started:', nodeData)
  }
}
</script>

<template>
  <div class="workflow-sidebar">
    <div class="search-container">
      <el-input
        placeholder="Search... (ctrl+shift+f)"
        prefix-icon="Search"
        class="search-input"
      />
    </div>
    
    <div class="sidebar-content">
      <div v-for="category in workflowBlocks" :key="category.category">
        <div class="category-header">
          <el-icon><FolderOpened /></el-icon>
          <span>{{ category.category }}</span>
        </div>
        
        <div class="blocks-grid">
          <div
            v-for="block in category.items"
            :key="block.type"
            class="workflow-block"
            :style="{ '--block-color': block.color }"
            draggable="true"
            @dragstart="onDragStart($event, block)"
          >
            <el-icon><component :is="block.icon" /></el-icon>
            <div class="block-info">
              <div class="block-title">{{ block.type }}</div>
              <div class="block-description">{{ block.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.workflow-sidebar {
  width: 300px;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.search-container {
  padding: 16px;
  border-bottom: 1px solid #dee2e6;
  
  .search-input {
    :deep(.el-input__wrapper) {
      background: #fff;
      box-shadow: none;
      border: 1px solid #dee2e6;
      
      &:hover, &:focus {
        border-color: var(--el-color-primary);
      }
    }
  }
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #495057;
  font-weight: 500;
  
  .el-icon {
    font-size: 16px;
  }
}

.blocks-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.workflow-block {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--block-color);
  border-radius: 8px;
  cursor: move;
  transition: all 0.2s;
  user-select: none;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .el-icon {
    font-size: 20px;
    color: #495057;
  }
  
  .block-info {
    flex: 1;
    
    .block-title {
      font-size: 14px;
      font-weight: 500;
      color: #212529;
      margin-bottom: 2px;
    }
    
    .block-description {
      font-size: 12px;
      color: #6c757d;
    }
  }
}

:deep(.el-icon) {
  vertical-align: middle;
}
</style>