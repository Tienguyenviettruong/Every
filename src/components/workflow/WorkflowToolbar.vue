<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWorkflowStore } from '../../stores/workflow'
import { ElMessage } from 'element-plus'
import {
  Delete,
  Connection,
  Back,
  Right,
  VideoPlay,
  VideoPause,
  Download,
  Upload,
  Share,
  Grid,
  List,
  Setting,
  More,
  Picture
} from '@element-plus/icons-vue'

const workflowStore = useWorkflowStore()
const isRunning = ref(false)
const isFullscreen = ref(false)

const canUndo = computed(() => workflowStore.canUndo)
const canRedo = computed(() => workflowStore.canRedo)

const emits = defineEmits<{
  (e: 'run'): void
  (e: 'clear'): void
  (e: 'save'): void
  (e: 'export'): void
  (e: 'share'): void
  (e: 'toggle-fullscreen'): void
}>()

const isRunningComputed = computed(() => workflowStore.state.isRunning)
const isPaused = computed(() => workflowStore.state.isPaused)
const hasUnsavedChanges = computed(() => workflowStore.hasUnsavedChanges)

const handleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  emits('toggle-fullscreen')
}

const runWorkflow = async () => {
  try {
    await workflowStore.runWorkflow()
    ElMessage.success('Workflow completed successfully')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : 'Workflow execution failed')
  }
}

const pauseWorkflow = () => {
  workflowStore.pauseWorkflowExecution()
  ElMessage.info('Workflow paused')
}

const resumeWorkflow = () => {
  workflowStore.resumeWorkflowExecution()
  ElMessage.info('Workflow resumed')
}

const clearWorkflow = () => {
  ElMessage.warning({
    message: 'Are you sure you want to clear the workflow?',
    type: 'warning',
    showClose: true,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    onConfirm: () => {
      workflowStore.clearWorkflow()
      ElMessage.success('Workflow cleared')
    }
  })
}

const handleExport = () => {
  // Set background to white before export
  const workflow = document.querySelector('.workflow-container')
  if (workflow) {
    const originalBg = workflow.style.background
    workflow.style.background = '#ffffff'
    
    // Export after background change
    emits('export')
    
    // Restore original background
    setTimeout(() => {
      workflow.style.background = originalBg
    }, 100)
  }
}
</script>

<template>
  <div class="workflow-toolbar">
    <div class="left-section">
      <div class="tabs">
        <div class="tab active">Editor</div>
        <div class="tab">Logs</div>
        <div class="tab">Running</div>
      </div>
    </div>

    <div class="right-section">
      <div class="action-buttons">
        <!-- Undo/Redo -->
        <el-button-group>
          <el-tooltip content="Undo" placement="bottom">
            <el-button 
              :icon="Back"
              :disabled="!canUndo"
              @click="workflowStore.undo"
            />
          </el-tooltip>
          <el-tooltip content="Redo" placement="bottom">
            <el-button 
              :icon="Right"
              :disabled="!canRedo"
              @click="workflowStore.redo"
            />
          </el-tooltip>
        </el-button-group>

        <el-tooltip content="Run" placement="bottom">
          <el-button 
            type="primary"
            :icon="VideoPlay"
            :loading="isRunningComputed"
            @click="emits('run')"
          />
        </el-tooltip>

        <el-tooltip content="Export as Image" placement="bottom">
          <el-button :icon="Picture" @click="handleExport" />
        </el-tooltip>

        <el-tooltip content="Share" placement="bottom">
          <el-button :icon="Share" @click="emits('share')" />
        </el-tooltip>
        
        <el-button-group>
          <el-tooltip content="Grid View" placement="bottom">
            <el-button :icon="Grid" />
          </el-tooltip>
          <el-tooltip content="List View" placement="bottom">
            <el-button :icon="List" />
          </el-tooltip>
          <el-tooltip content="Settings" placement="bottom">
            <el-button :icon="Setting" />
          </el-tooltip>
        </el-button-group>

        <el-tooltip content="More" placement="bottom">
          <el-button :icon="More" />
        </el-tooltip>

        <el-button type="primary" @click="emits('save')">
          Save
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workflow-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.left-section {
  display: flex;
  align-items: center;
}

.tabs {
  display: flex;
  gap: 16px;
}

.tab {
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.tab:hover {
  background: var(--el-fill-color-light);
}

.tab.active {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.right-section {
  display: flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

:deep(.el-button) {
  padding: 8px;
  height: 32px;
}
</style>