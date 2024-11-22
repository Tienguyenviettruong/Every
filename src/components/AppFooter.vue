<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="footer-content">
    <p>{{ t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
  </div>
</template>

<style scoped lang="scss">
.footer-content {
  height: var(--footer-height);
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--el-border-color-lighter);
  background: burlywood;
  padding: 0 20px;
  
  p {
    margin: 0;
    color: var(--el-text-color-secondary);
  }
}
</style>