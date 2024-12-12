<script setup lang="ts">
const workflowBlocks = [
  {
    category: 'General',
    items: [
      { type: 'Trigger', icon: 'Lightning', description: 'Start workflow', color: '#FFE69C' },
      { type: 'Execute Workflow', icon: 'Connection', description: 'Run another workflow', color: '#FFD6D6' },
      { type: 'Delay', icon: 'Timer', description: 'Add time delay', color: '#D4F0FF' },
      { type: 'Export Data', icon: 'Download', description: 'Export workflow data', color: '#E8FFE8' },
      { type: 'Repeat Task', icon: 'RefreshRight', description: 'Repeat an action', color: '#FFE8F7' },
      { type: 'HTTP Request', icon: 'Connection', description: 'Make API calls', color: '#E6E6FF' },
      { type: 'While Loop', icon: 'CircleClose', description: 'Loop while condition', color: '#FFF0E6' },
      { type: 'Loop Data', icon: 'RefreshLeft', description: 'Loop through data', color: '#F0FFE6' },
      { type: 'Loop Break', icon: 'CircleClose', description: 'Break from loop', color: '#FFE6F0' },
      { type: 'Blocks Group', icon: 'Files', description: 'Group of blocks', color: '#E6FFF0' },
      { type: 'Clipboard', icon: 'Document', description: 'Copy to clipboard', color: '#F7E8FF' },
      { type: 'Insert Data', icon: 'DocumentAdd', description: 'Insert data', color: '#FFE8E8' }
    ]
  }
]

const emit = defineEmits<{
  (e: 'add-node', nodeData: any): void 
}>()

const handleBlockClick = (block: any) => {
  const nodeData = {
    type: block.type,
    icon: block.icon,
    color: block.color
  }
  emit('add-node', nodeData)
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
            @click="handleBlockClick(block)"
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
  width: 240px;
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
}

.search-container {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
}

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

.sidebar-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
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
  border-radius: 8px;
  background: var(--block-color);
  cursor: grab;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.workflow-block:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.workflow-block:active {
  cursor: grabbing;
}

.workflow-block .el-icon {
  font-size: 24px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
}

.workflow-block .block-info {
  flex: 1;
}

.workflow-block .block-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.workflow-block .block-description {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>