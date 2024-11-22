<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="lifecycle">
    <el-card>
      <template #header>
        <h3>{{ t('lifecycle.title') }}</h3>
      </template>
      <div class="lifecycle-content">
        <img src="https://www.questionpro.com/blog/wp-content/uploads/2023/03/product-management-lifecycle.jpg" alt="Digital Content Lifecycle" class="lifecycle-image" />
        <div class="stages">
          <div v-for="i in 6" :key="i" class="stage">
            <h4>{{ t(`lifecycle.stage${i}.title`) }}</h4>
            <p>{{ t(`lifecycle.stage${i}.description`) }}</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.lifecycle {
  .lifecycle-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  .lifecycle-image {
    max-width: 600px;
    width: 100%;
    height: auto;
  }

  .stages {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    width: 100%;
  }

  .stage {
    padding: 16px;
    border-radius: 8px;
    background: var(--el-bg-color);
    box-shadow: var(--el-box-shadow-light);

    h4 {
      margin: 0 0 8px;
      color: var(--el-color-primary);
    }

    p {
      margin: 0;
      color: var(--el-text-color-regular);
    }
  }
}
</style>