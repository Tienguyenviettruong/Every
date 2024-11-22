<template>
  <div class="home">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Welcome to Vue Admin</span>
        </div>
      </template>
      <div class="card-content">
        <p>This is a starter template with Vue 3, Element Plus, and TypeScript.</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.home {
  .card-header {
    font-weight: bold;
  }
  
  .card-content {
    color: var(--el-text-color-regular);
  }
}
</style>