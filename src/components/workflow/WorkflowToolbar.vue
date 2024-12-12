<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWorkflowStore } from '../../stores/workflow'
import { ElMessage } from 'element-plus'
import {
  Connection,
  VideoPlay,
  VideoPause,
  Delete,
  Back,
  Right,
  ZoomIn,
  ZoomOut,
  FullScreen,
  Aim,
  Plus,
  Download,
  Upload
} from '@element-plus/icons-vue'

defineEmits<{
  (e: 'zoom-in'): void
  (e: 'zoom-out'): void
  (e: 'toggle-fullscreen'): void
  (e: 'run'): void
  (e: 'save'): void
  (e: 'export'): void
  (e: 'clear'): void
}>()

const isFullscreen = ref(false)
const workflowStore = useWorkflowStore()

// Computed properties from store
const isRunning = computed(() => workflowStore.state.isRunning)
const isPaused = computed(() => workflowStore.state.isPaused)
const canUndo = computed(() => workflowStore.canUndo)
const canRedo = computed(() => workflowStore.canRedo)
const hasUnsavedChanges = computed(() => workflowStore.hasUnsavedChanges)

const handleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  emit('toggle-fullscreen')
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
</script>

<template>
  <div class="workflow-toolbar">
    <div class="left-section">
      <div class="logo">
        <el-icon><Connection /></el-icon>
        <span>Workflow Editor</span>
      </div>
      
      <div class="tabs">
        <div class="tab active">Editor</div>
        <div class="tab">History</div>
        <div class="tab">Logs</div>
      </div>
    </div>

    <div class="right-section">
      <div class="action-buttons">
        <!-- Edit Actions -->
        <el-button-group>
          <el-tooltip content="Undo" placement="bottom">
            <el-button 
              :disabled="!canUndo"
              @click="workflowStore.undo"
            >
              <el-icon><Back /></el-icon>
            </el-button>
          </el-tooltip>
          
          <el-tooltip content="Redo" placement="bottom">
            <el-button 
              :disabled="!canRedo"
              @click="workflowStore.redo"
            >
              <el-icon><Right /></el-icon>
            </el-button>
          </el-tooltip>
        </el-button-group>

        <!-- Workflow Controls -->
        <el-button-group>
          <el-tooltip 
            :content="isRunning ? (isPaused ? 'Resume Workflow' : 'Pause Workflow') : 'Run Workflow'" 
            placement="bottom"
          >
            <el-button 
              type="primary" 
              :loading="isRunning && !isPaused"
              @click="isRunning ? (isPaused ? resumeWorkflow : pauseWorkflow) : runWorkflow"
            >
              <template #icon>
                <el-icon>
                  <component :is="isRunning ? (isPaused ? 'VideoPlay' : 'VideoPause') : 'VideoPlay'" />
                </el-icon>
              </template>
              {{ isRunning ? (isPaused ? 'Resume' : 'Pause') : 'Run Workflow' }}
            </el-button>
          </el-tooltip>
        </el-button-group>

        <!-- View Controls -->
        <el-button-group>
          <el-tooltip content="Zoom Out" placement="bottom">
            <el-button @click="$emit('zoom-out')">
              <el-icon><ZoomOut /></el-icon>
            </el-button>
          </el-tooltip>
          
          <el-tooltip content="Zoom In" placement="bottom">
            <el-button @click="$emit('zoom-in')">
              <el-icon><ZoomIn /></el-icon>
            </el-button>
          </el-tooltip>
          
          <el-tooltip :content="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'" placement="bottom">
            <el-button @click="handleFullscreen">
              <el-icon>
                <component :is="isFullscreen ? 'Aim' : 'FullScreen'" />
              </el-icon>
            </el-button>
          </el-tooltip>
        </el-button-group>

        <el-button-group>
          <el-tooltip content="Export Workflow" placement="bottom">
            <el-button type="primary" @click="$emit('export')">
              <el-icon><Download /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Run Workflow" placement="bottom">
            <el-button type="success" @click="$emit('run')">
              <el-icon><VideoPlay /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Save Workflow" placement="bottom">
            <el-button type="primary" @click="$emit('save')">
              <el-icon><Upload /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Clear Workflow" placement="bottom">
            <el-button 
              :disabled="isRunning"
              @click="clearWorkflow"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </el-tooltip>
        </el-button-group>
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
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
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
}
</style>