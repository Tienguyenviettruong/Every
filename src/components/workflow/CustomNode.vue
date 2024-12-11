<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core'
import { Delete } from '@element-plus/icons-vue'

const props = defineProps<{
  data: {
    label: string
    icon: string
    type: string
    color: string
  }
  id: string
}>()

const emit = defineEmits<{
  (e: 'deleteNode', nodeId: string): void
}>()

const handleDelete = () => {
  emit('deleteNode', props.id)
}
</script>

<template>
  <div class="custom-node" :class="data.type" :style="{ 
    borderColor: data.color,
    backgroundColor: `${data.color}10` 
  }">
    <Handle type="target" :position="Position.Left" />
    <div class="custom-node-content">
      <el-icon class="node-icon" :style="{ color: data.color, opacity: 0.9 }">
        <component :is="data.icon" />
      </el-icon>
      <div class="node-label">{{ data.label }}</div>
      <el-button
        class="delete-button"
        type="danger"
        :icon="Delete"
        circle
        size="small"
        @click.stop="handleDelete"
      />
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

  &:active {
    cursor: grabbing;
  }
}

.custom-node-content {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.node-icon {
  font-size: 20px;
  font-weight: bold;
  filter: saturate(1.5);
}

.node-label {
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.delete-button {
  opacity: 0;
  transition: opacity 0.2s;
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  
  :deep(.el-icon) {
    font-size: 12px;
  }
}

.custom-node:hover .delete-button {
  opacity: 1;
}
</style>