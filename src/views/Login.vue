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
    <div class="login-content">
      <div class="login-left">
        <img src="../assets/1.gif" alt="Login Animation" class="login-animation" />
      </div>
      <div class="login-right">
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
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(30, 144, 255, 0.6) 0%, rgba(147, 112, 219, 0.6) 50%, rgba(0, 191, 255, 0.6) 100%);
}

.login-content {
  display: flex;
  gap: 40px;
  width: 900px;
  padding: 20px;
}

.login-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-right {
  flex: 1;
  max-width: 300px;
}

.login-animation {
  width: 100%;
  max-width: 400px;
  mix-blend-mode: multiply;
}

.login-card {
  width: 100%;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 20px;
  
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