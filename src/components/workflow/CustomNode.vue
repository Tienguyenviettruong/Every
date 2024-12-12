<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core'
import { Delete } from '@element-plus/icons-vue'
import type { NodeStatus } from '../../types/workflow'

const props = defineProps<{
  data: {
    label: string
    icon: string
    type: string
    color: string
    status: NodeStatus
  }
  id: string
}>()

console.log(`Node ID: ${props.id}, Status: ${props.data.status}`); // Log status

const emit = defineEmits<{
  (e: 'deleteNode', nodeId: string): void
}>()

const handleDelete = () => {
  emit('deleteNode', props.id)
}

const getStatusColor = (status: NodeStatus) => {
  switch (status) {
    case 'running':
      return '#409EFF'
    case 'completed':
      return '#67C23A'
    case 'error':
      return '#F56C6C'
    default:
      return props.data.color
  }
}

const getStatusIcon = (status: NodeStatus) => {
  switch (status) {
    case 'running':
      return 'Loading'
    case 'completed':
      return 'Select'
    case 'error':
      return 'CircleClose'
    default:
      return props.data.icon
  }
}
</script>

<template>
  <div 
    class="custom-node" 
    :class="[data.type, data.status]" 
    :style="{ 
      borderColor: getStatusColor(data.status),
      backgroundColor: `${getStatusColor(data.status)}10` 
    }"
  >
    <Handle type="target" :position="Position.Left" />
    <div class="custom-node-content">
      <div class="custom-node__header">
        <el-icon class="node-icon" :style="{ color: getStatusColor(data.status) }">
          <component :is="getStatusIcon(data.status)" />
        </el-icon>
        <span class="node-label">{{ data.label }}</span>
        <el-button
          class="delete-button"
          type="danger"
          circle
          size="small"
          @click.stop="$emit('deleteNode', id)"
          :disabled="data.status === 'running'"
        >
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
      <div class="node-status" v-if="data.status !== 'idle'" :style="{ color: getStatusColor(data.status) }">
        {{ data.status }}
      </div>
    </div>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<style lang="scss" scoped>
.custom-node {
  padding: 12px;
  border-radius: 8px;
  border: 2px solid;
  min-width: 150px;
  cursor: grab;
  user-select: none;
  position: relative;
  transition: all 0.3s ease;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    cursor: grabbing;
  }

  &.running {
    animation: pulse 1.5s infinite;
  }

  .custom-node-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .custom-node__header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .node-icon {
    font-size: 24px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
  }

  .node-label {
    font-size: 14px;
    font-weight: 600;
    flex-grow: 1;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .delete-button {
    padding: 4px;
    height: 24px;
    width: 24px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover .delete-button {
    opacity: 1;
  }

  .node-status {
    font-size: 12px;
    text-align: center;
    font-weight: 600;
    text-transform: lowercase;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(64, 158, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
  }
}
</style>