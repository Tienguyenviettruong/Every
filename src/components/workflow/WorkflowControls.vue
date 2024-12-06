<script setup lang="ts">
defineEmits<{
  (e: 'clear'): void
  (e: 'run'): void
}>()
</script>

<template>
  <el-button-group>
    <el-button type="primary">
      <el-icon><Plus /></el-icon> Add Node
    </el-button>
    <el-button type="success" @click="$emit('run')">
      <el-icon><VideoPlay /></el-icon> Run Workflow
    </el-button>
    <el-button type="warning" @click="$emit('clear')">
      <el-icon><Delete /></el-icon> Clear
    </el-button>
  </el-button-group>
</template>