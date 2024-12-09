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
import { FullScreen, Remove, Plus, Document, List, VideoPlay, Connection, Share, Grid, DataLine, Setting, More } from '@element-plus/icons-vue'

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

const activeTab = ref('editor')
</script>

<template>
  <div class="workflow-container">
    <div class="workflow-main">
      <Sidebar @add-node="handleAddNode" />
      <div class="workflow-content">
        <div class="workflow-header">
          <div class="left-controls">
            <el-button-group class="tab-group">
              <el-button :class="{ active: activeTab === 'editor' }" @click="activeTab = 'editor'">
                <el-icon><Document /></el-icon>
                Editor
              </el-button>
              <el-button :class="{ active: activeTab === 'logs' }" @click="activeTab = 'logs'">
                <el-icon><List /></el-icon>
                Logs
              </el-button>
              <el-button :class="{ active: activeTab === 'running' }" @click="activeTab = 'running'">
                <el-icon><VideoPlay /></el-icon>
                Running
              </el-button>
            </el-button-group>
          </div>
          <div class="right-controls">
            <el-button-group class="icon-group">
              <el-tooltip content="Connect" placement="bottom">
                <el-button>
                  <el-icon><Connection /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Share" placement="bottom">
                <el-button>
                  <el-icon><Share /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Grid" placement="bottom">
                <el-button>
                  <el-icon><Grid /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Data" placement="bottom">
                <el-button>
                  <el-icon><DataLine /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Settings" placement="bottom">
                <el-button>
                  <el-icon><Setting /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="Play" placement="bottom">
                <el-button>
                  <el-icon><VideoPlay /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="More" placement="bottom">
                <el-button>
                  <el-icon><More /></el-icon>
                </el-button>
              </el-tooltip>
            </el-button-group>
            <el-button type="primary">Save</el-button>
          </div>
        </div>
        <div class="workflow-canvas">
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
            <div class="workflow-zoom-controls">
              <el-button-group>
                <el-tooltip content="Zoom Out" placement="right">
                  <el-button @click="zoomOut">
                    <el-icon><Remove /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="Zoom In" placement="right">
                  <el-button @click="zoomIn">
                    <el-icon><Plus /></el-icon>
                  </el-button>
                </el-tooltip>
              </el-button-group>
            </div>
          </VueFlow>
        </div>
      </div>
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

.workflow-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.workflow-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid var(--el-border-color-light);
  background: var(--el-bg-color);
  position: sticky;
  top: 0;
  z-index: 100;

  .left-controls, .right-controls {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .tab-group {
    .el-button {
      padding: 8px 16px;
      border: 1px solid var(--el-border-color-light);
      
      &.active {
        background: var(--el-color-primary);
        color: white;
        border-color: var(--el-color-primary);
      }
      
      &:not(.active):hover {
        background: var(--el-color-primary-light-9);
      }
    }
  }

  .icon-group {
    .el-button {
      padding: 8px;
      border: 1px solid var(--el-border-color-light);
      
      &:hover {
        background: var(--el-color-primary-light-9);
      }
    }
  }

  .el-button {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.workflow-canvas {
  flex: 1;
  position: relative;
  overflow: hidden;
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

.workflow-zoom-controls {
  position: absolute;
  left: 16px;
  bottom: 16px;
  z-index: 100;
  background: var(--el-bg-color);
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  
  .el-button-group {
    display: flex;
    flex-direction: column;
  }
  
  .el-button {
    padding: 8px;
    border: 1px solid var(--el-border-color-light);
    
    &:hover {
      background: var(--el-color-primary-light-9);
    }
    
    &:first-child {
      border-bottom: none;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    
    &:last-child {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
}
</style>
</```
rewritten_file>