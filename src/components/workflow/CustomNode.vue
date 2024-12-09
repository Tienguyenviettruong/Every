<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core'

defineProps<{
  data: {
    label: string
    icon: string
    type: string
    color: string
  }
}>()
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

  &:active {
    cursor: grabbing;
  }
}

.custom-node-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-icon {
  font-size: 20px;
  font-weight: bold;
  filter: saturate(1.5);
}

.node-label {
  font-size: 14px;
  font-weight: 500;
}
</style>