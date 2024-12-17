<script setup lang="ts">
import { ref, computed } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { NodeTypesObject } from '@vue-flow/core'
import { v4 as uuidv4 } from 'uuid'
import CustomNode from '../components/workflow/CustomNode.vue'
import Sidebar from '../components/workflow/Sidebar.vue'
import WorkflowToolbar from '../components/workflow/WorkflowToolbar.vue'
import WorkflowControls from '../components/workflow/WorkflowControls.vue'
import { useWorkflowStore } from '../stores/workflow'
import useWorkflowNodes from '../composables/useWorkflowNodes'
import html2canvas from 'html2canvas'
import { ZoomIn, ZoomOut, FullScreen } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

const { onConnect, addEdges, removeNodes, zoomIn: vfZoomIn, zoomOut: vfZoomOut } = useVueFlow()
const workflowStore = useWorkflowStore()
const { addNewNode } = useWorkflowNodes(uuidv4)

const nodeTypes: NodeTypesObject = {
  custom: CustomNode as any
}

// Sử dụng computed để bind với store state
const nodes = computed({
  get: () => workflowStore.state.nodes,
  set: (value) => workflowStore.state.nodes = value
})

const edges = computed({
  get: () => workflowStore.state.edges,
  set: (value) => workflowStore.state.edges = value
})

onConnect((params) => {
  const newEdge = {
    id: uuidv4(),
    source: params.source,
    target: params.target
  }
  workflowStore.addEdge(newEdge)
  addEdges([newEdge])
})

const handleDeleteNode = (nodeId: string) => {
  workflowStore.removeNode(nodeId)
  removeNodes([{ id: nodeId }])
}

const handleAddNode = (nodeData: any) => {
  const position = {
    x: Math.random() * 500,
    y: Math.random() * 500
  }
  const node = addNewNode(nodeData, position)
  workflowStore.addNode(node)
}

const handleSave = () => {
  const workflowData = {
    nodes: workflowStore.state.nodes,
    edges: workflowStore.state.edges,
    timestamp: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `workflow_${new Date().toISOString().slice(0,10)}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const handleExport = async () => {
  try {
    const workflowElement = document.querySelector('.workflow') as HTMLElement
    if (!workflowElement) return

    const canvas = await html2canvas(workflowElement, {
      backgroundColor: null,
      scale: 2, // Better quality
    })

    // Convert to image and download
    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'workflow.png'
    link.href = image
    link.click()
  } catch (error) {
    console.error('Error exporting workflow:', error)
  }
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const zoomIn = () => vfZoomIn(0.2)
const zoomOut = () => vfZoomOut(0.2)
const fitView = () => vfZoomIn(1)

const selectedNode = ref<any>(null)
const showNodeOptions = ref(false)

const triggerSources = [
  { label: 'File System', value: 'file' },
  { label: 'Database', value: 'database' },
  { label: 'API Endpoint', value: 'api' },
  { label: 'Message Queue', value: 'queue' }
]

const nodeSpecificOptions = computed(() => {
  if (!selectedNode.value) return []
  
  switch (selectedNode.value.data.type) {
    case 'trigger':
      return [
        {
          type: 'select',
          label: 'Data Source',
          key: 'dataSource',
          options: triggerSources,
          value: selectedNode.value.data.config?.dataSource || ''
        },
        {
          type: 'input',
          label: 'Trigger Interval (ms)',
          key: 'interval',
          value: selectedNode.value.data.config?.interval || 1000
        }
      ]
    case 'process':
      return [
        {
          type: 'select',
          label: 'Process Type',
          key: 'processType',
          options: [
            { label: 'Transform', value: 'transform' },
            { label: 'Filter', value: 'filter' },
            { label: 'Aggregate', value: 'aggregate' }
          ],
          value: selectedNode.value.data.config?.processType || ''
        }
      ]
    case 'action':
      return [
        {
          type: 'select',
          label: 'Action Type',
          key: 'actionType',
          options: [
            { label: 'Send Email', value: 'email' },
            { label: 'HTTP Request', value: 'http' },
            { label: 'Save File', value: 'file' }
          ],
          value: selectedNode.value.data.config?.actionType || ''
        }
      ]
    default:
      return []
  }
})

const handleNodeClick = (event: any) => {
  selectedNode.value = event.node
  showNodeOptions.value = true
}

const handleNodeEdit = async () => {
  if (!selectedNode.value) return
  
  try {
    const { value: newLabel } = await ElMessageBox.prompt('Enter new node label:', 'Edit Node', {
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      inputValue: selectedNode.value.data.label
    })
    
    if (newLabel) {
      workflowStore.updateNode(selectedNode.value.id, { 
        ...selectedNode.value.data,
        label: newLabel 
      })
    }
  } catch {
    // User cancelled
  }
  showNodeOptions.value = false
}

const handleNodeDuplicate = () => {
  if (!selectedNode.value) return
  
  const position = {
    x: selectedNode.value.position.x + 50,
    y: selectedNode.value.position.y + 50
  }
  
  workflowStore.duplicateNode(selectedNode.value.id, position)
  showNodeOptions.value = false
}

const handleNodeDelete = () => {
  if (!selectedNode.value) return
  workflowStore.deleteNode(selectedNode.value.id)
  showNodeOptions.value = false
}

const handleConfigChange = (key: string, value: any) => {
  if (!selectedNode.value) return
  
  console.log('Current node data:', selectedNode.value.data)
  
  // Preserve all existing node data
  const updatedData = {
    ...selectedNode.value.data,
    config: {
      ...(selectedNode.value.data.config || {}),
      [key]: value
    }
  }
  
  console.log('Updated node data:', updatedData)
  
  // Update the node while preserving its type, label, and other properties
  workflowStore.updateNode(selectedNode.value.id, { data: updatedData })
  
  console.log('Node after update:', workflowStore.state.nodes.find(n => n.id === selectedNode.value.id))
}
</script>

<template>
  <div class="workflow-container">
    <div class="workflow-main">
      <Sidebar @add-node="handleAddNode" />
      <div class="workflow-content">
        <WorkflowToolbar
          @zoom-in="zoomIn"
          @zoom-out="zoomOut"
          @toggle-fullscreen="toggleFullscreen"
          @run="workflowStore.runWorkflow"
          @export="handleExport"
          @save="handleSave"
          class="workflow-toolbar"
        />
        <VueFlow
          v-model="nodes"
          v-model:edges="edges"
          :node-types="nodeTypes"
          :default-viewport="{ zoom: 1.5 }"
          :min-zoom="0.2"
          :max-zoom="4"
          @nodeClick="handleNodeClick"
          class="workflow"
          @deleteNode="handleDeleteNode"
        >
          <template #node-custom="props">
            <CustomNode v-bind="props" @deleteNode="handleDeleteNode" />
          </template>
        </VueFlow>
        <div class="zoom-controls">
          <el-button-group>
            <el-button
              type="primary"
              :icon="ZoomIn"
              @click="zoomIn"
              circle
            />
            <el-button
              type="primary"
              :icon="ZoomOut"
              @click="zoomOut"
              circle
            />
            <el-button
              type="primary"
              :icon="FullScreen"
              @click="fitView"
              circle
            />
          </el-button-group>
        </div>
      </div>
    </div>

    <!-- Node Options Dialog -->
    <el-dialog
      v-model="showNodeOptions"
      :title="selectedNode?.data?.label || 'Node Options'"
      width="400px"
      :show-close="true"
      :close-on-click-modal="true"
      destroy-on-close
    >
      <div class="node-options">
        <div class="node-info" v-if="selectedNode">
          <p class="node-type">Type: {{ selectedNode.data.type }}</p>
        </div>
        
        <!-- Node-specific configuration -->
        <div class="node-config" v-if="nodeSpecificOptions.length > 0">
          <h4>Configuration</h4>
          <div class="config-item" v-for="option in nodeSpecificOptions" :key="option.key">
            <template v-if="option.type === 'select'">
              <el-form-item :label="option.label">
                <el-select
                  v-model="option.value"
                  :placeholder="'Select ' + option.label.toLowerCase()"
                  @change="(val) => handleConfigChange(option.key, val)"
                >
                  <el-option
                    v-for="opt in option.options"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
              </el-form-item>
            </template>
            
            <template v-else-if="option.type === 'input'">
              <el-form-item :label="option.label">
                <el-input
                  v-model="option.value"
                  @change="(val) => handleConfigChange(option.key, val)"
                />
              </el-form-item>
            </template>
          </div>
        </div>
        
        <el-divider />
        
        <div class="options-buttons">
          <el-button
            type="primary"
            @click="handleNodeEdit"
            class="option-button"
          >
            Edit Label
          </el-button>
          
          <el-button
            type="success"
            @click="handleNodeDuplicate"
            class="option-button"
          >
            Duplicate Node
          </el-button>
          
          <el-button
            type="danger"
            @click="handleNodeDelete"
            class="option-button"
          >
            Delete Node
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.workflow-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height) - var(--footer-height) - 16px);
  overflow: hidden;
  background: var(--el-bg-color);
}

.workflow-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.workflow-content {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.workflow-toolbar {
  padding: 8px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.workflow {
  flex: 1;
  width: 100%;
  height: 100%;
}

:deep(.vue-flow__node) {
  border: none;
  border-radius: 8px;
  padding: 0;
  display: flex;
  align-items: center;
}

:deep(.vue-flow__edge) {
  stroke: var(--el-border-color);
  stroke-width: 2;
}

:deep(.vue-flow__edge.selected) {
  stroke: var(--el-color-primary);
}

:deep(.vue-flow__handle) {
  width: 8px;
  height: 8px;
  background: var(--el-color-primary);
  border: 2px solid var(--el-bg-color);
}

:deep(.vue-flow__handle:hover) {
  background: var(--el-color-primary-light-3);
}

.zoom-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
  background: white;
  padding: 4px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .el-button-group {
    display: flex;
    gap: 4px;
  }

  .el-button {
    width: 32px;
    height: 32px;
    padding: 6px;
    
    :deep(.el-icon) {
      font-size: 18px;
    }
  }
}

.node-options {
  padding: 16px;

  .node-info {
    margin-bottom: 20px;
    text-align: center;

    .node-type {
      color: var(--el-text-color-secondary);
      font-size: 14px;
      margin: 0;
      text-transform: capitalize;
    }
  }

  .node-config {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 16px;
      font-size: 16px;
      color: var(--el-text-color-primary);
    }

    .config-item {
      margin-bottom: 16px;

      :deep(.el-form-item__label) {
        color: var(--el-text-color-regular);
        font-weight: 500;
      }

      :deep(.el-select),
      :deep(.el-input) {
        width: 100%;
      }
    }
  }

  .options-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .option-button {
      width: 100%;
      justify-content: center;
      font-weight: 500;
    }
  }
}
</style>