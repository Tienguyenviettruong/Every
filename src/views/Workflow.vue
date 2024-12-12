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

const handleNodeClick = (event: any) => {
  console.log(event)
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
</style>