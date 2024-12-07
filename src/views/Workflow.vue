<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { NodeTypesObject } from '@vue-flow/core'
import { v4 as uuidv4 } from 'uuid'
import CustomNode from '../components/workflow/CustomNode.vue'
import Sidebar from '../components/workflow/Sidebar.vue'
import WorkflowControls from '../components/workflow/WorkflowControls.vue'
import { useWorkflowStore } from '../stores/workflow'
import { useWorkflowNodes } from '../composables/useWorkflowNodes'
import { FullScreen, Remove, Plus } from '@element-plus/icons-vue'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

const { onConnect, addEdges, zoomIn: vfZoomIn, zoomOut: vfZoomOut } = useVueFlow()
const workflowStore = useWorkflowStore()
const { addNewNode } = useWorkflowNodes(uuidv4)

const nodeTypes: NodeTypesObject = {
  custom: CustomNode as any
}

const nodes = ref([])
const edges = ref([])

onConnect((params) => {
  addEdges([{
    id: uuidv4(),
    source: params.source,
    target: params.target
  }])
})

const handleClearWorkflow = () => {
  nodes.value = []
  edges.value = []
}

const handleRunWorkflow = () => {
  workflowStore.runWorkflow()
}

const handleAddNode = (nodeData: any) => {
  const position = {
    x: Math.random() * 500,
    y: Math.random() * 500
  }
  addNewNode(nodeData, position)
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
</script>

<template>
  <div class="workflow-container">
    <Sidebar @add-node="handleAddNode" />
    <div class="workflow-content">
      <VueFlow
        v-model="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        :default-viewport="{ zoom: 1.5 }"
        :min-zoom="0.2"
        :max-zoom="4"
        class="workflow"
        fit-view-on-init
      >
        <template #panel-top-center>
          <WorkflowControls 
            @clear="handleClearWorkflow"
            @run="handleRunWorkflow"
          />
        </template>
        <template #panel-bottom-right>
          <div class="workflow-controls">
            <el-button-group>
              <el-button @click="toggleFullscreen">
                <el-icon><FullScreen /></el-icon>
              </el-button>
              <el-button @click="zoomOut">
                <el-icon><Remove /></el-icon>
              </el-button>
              <el-button @click="zoomIn">
                <el-icon><Plus /></el-icon>
              </el-button>
            </el-button-group>
          </div>
        </template>
      </VueFlow>
    </div>
  </div>
</template>

<style lang="scss">
.workflow-container {
  display: flex;
  width: 100%;
  height: calc(100vh - var(--header-height) - var(--footer-height) - 40px);
  background: var(--el-bg-color-page);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
}

.workflow-content {
  flex: 1;
  height: 100%;
  position: relative;
}

.workflow {
  background: var(--el-bg-color);
}

:root {
  --vf-node-bg: var(--el-bg-color);
  --vf-node-text: var(--el-text-color-primary);
  --vf-connection-path: var(--el-border-color);
  --vf-handle-bg: var(--el-color-primary);
}

.workflow-controls {
  padding: 8px;
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .el-button-group {
    display: flex;
    gap: 1px;
  }
  
  .el-button {
    padding: 8px;
    border: 1px solid var(--el-border-color-light);
    
    &:hover {
      background: var(--el-color-primary-light-9);
    }
  }
}
</style>