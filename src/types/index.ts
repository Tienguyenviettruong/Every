// Chat related interfaces
export interface ChatMessage {
  id: string
  content: string
  timestamp: string
  sender: 'user' | 'bot'
}

export interface ChatFile {
  name: string
  type: string
  size: number
  data: string
  timestamp: string
}

export interface ChatConversation {
  id: number
  title: string
  timestamp: string
}

// Menu related interfaces
export interface MenuItem {
  icon: string
  title: string
  path: string
}

// Theme related interfaces
export interface ThemeConfig {
  isDark: boolean
  variables: Record<string, string>
} 