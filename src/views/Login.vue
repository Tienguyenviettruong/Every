<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const form = ref({
  username: '',
  password: ''
})

const handleLogin = () => {
  // Simulate login
  localStorage.setItem('token', 'demo-token')
  router.push('/')
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>{{ t('login.title') }}</h2>
      <el-form :model="form" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input
            v-model="form.username"
            :placeholder="t('login.username')"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            :placeholder="t('login.password')"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" class="login-button">
            {{ t('login.submit') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-bg-color-page);
}

.login-card {
  width: 100%;
  max-width: 360px;
  
  h2 {
    text-align: center;
    margin-bottom: 24px;
    color: var(--el-text-color-primary);
  }
}

.login-button {
  width: 100%;
}
</style>