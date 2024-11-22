import { ref, watch } from 'vue'

export function useTheme() {
  const isDark = ref(localStorage.getItem('theme') === 'dark')

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  const applyTheme = () => {
    document.documentElement.className = isDark.value ? 'dark' : ''
  }

  watch(isDark, () => {
    applyTheme()
  }, { immediate: true })

  return {
    isDark,
    toggleTheme
  }
}