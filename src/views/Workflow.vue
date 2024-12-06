<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { v4 as uuidv4 } from 'uuid'
import CustomNode from '../components/workflow/CustomNode.vue'
import Sidebar from '../components/workflow/Sidebar.vue'
import WorkflowControls from '../components/workflow/WorkflowControls.vue'
import { useWorkflowStore } from '../stores/workflow'
import { useWorkflowDragDrop } from '../composables/useWorkflowDragDrop'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

const { onConnect } = useVueFlow()
const workflowStore = useWorkflowStore()
const { onDragOver, onDrop } = useWorkflowDragDrop(uuidv4)

const nodeTypes = {
  custom: CustomNode,
}

const nodes = ref([])
const edges = ref([])

onConnect((params) => {
  edges.value.push({
    id: uuidv4(),
    source: params.source,
    target: params.target
  })
})

const handleClearWorkflow = () => {
  nodes.value = []
  edges.value = []
}

const handleRunWorkflow = () => {
  workflowStore.runWorkflow()
}
</script>

<template>
  <div class="workflow-container">
    <Sidebar />
    <div class="workflow-content">
      <VueFlow
        v-model="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        :default-viewport="{ zoom: 1.5 }"
        :min-zoom="0.2"
        :max-zoom="4"
        @dragover="onDragOver"
        @drop="onDrop"
        class="workflow"
        fit-view-on-init
      >
        <template #panel-top-center>
          <WorkflowControls 
            @clear="handleClearWorkflow"
            @run="handleRunWorkflow"
          />
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
</style>