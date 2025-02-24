<template>
  <div class="code-assistant">
    <el-input 
      v-model="prompt"
      placeholder="Describe your coding needs..."
      type="textarea"
    />
    <el-button @click="generateCode">Generate</el-button>
    <pre class="code-output">{{ generatedCode }}</pre>
  </div>
</template>

<script setup lang="ts">
// ... existing imports ...
import { invoke } from '@tauri-apps/api'

const prompt = ref('')
const generatedCode = ref('')

const generateCode = async () => {
  try {
    generatedCode.value = await invoke('generate_code', {
      prompt: prompt.value,
      language: 'typescript' // Default language
    })
  } catch (error) {
    // Error handling
  }
}
</script> 