<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['file-uploaded'])
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  if (!isValidFile(file)) {
    ElMessage.error('Invalid file type or size')
    return
  }

  try {
    isUploading.value = true
    const fileData = await readFile(file)
    emit('file-uploaded', {
      name: file.name,
      type: file.type,
      size: file.size,
      data: fileData,
      timestamp: new Date().toISOString()
    })
    
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    ElMessage.error('Failed to upload file')
    console.error('Upload error:', error)
  } finally {
    isUploading.value = false
  }
}

const isValidFile = (file: File): boolean => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  
  return file.size <= maxSize && allowedTypes.includes(file.type)
}

const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>

<template>
  <div class="file-upload">
    <input
      ref="fileInput"
      type="file"
      class="hidden-input"
      @change="handleFileSelect"
      accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
    />
    <el-button 
      type="text" 
      :loading="isUploading"
      @click="triggerFileInput"
    >
      <el-icon><PictureFilled /></el-icon>
    </el-button>
  </div>
</template>

<style scoped>
.hidden-input {
  display: none;
}
</style>