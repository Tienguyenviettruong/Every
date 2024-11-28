import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    app: {
      title: 'Vue Admin'
    },
    menu: {
      dashboard: 'Dashboard',
      lifecycle: 'Content Lifecycle',
      pages: 'Pages',
      profile: 'Profile',
      settings: 'Settings'
    },
    header: {
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout'
    },
    footer: {
      copyright: '© {year} Vue Admin. All rights reserved.'
    },
    login: {
      title: 'Welcome Back',
      username: 'Username',
      password: 'Password',
      submit: 'Login'
    },
    lifecycle: {
      title: 'The Digital Content Lifecycle',
      stage1: {
        title: '1. Plan',
        description: 'Strategic planning and content strategy development'
      },
      stage2: {
        title: '2. Create',
        description: 'Content creation and asset development'
      },
      stage3: {
        title: '3. Manage',
        description: 'Content organization and workflow management'
      },
      stage4: {
        title: '4. Distribute',
        description: 'Content publication and distribution'
      },
      stage5: {
        title: '5. Optimize',
        description: 'Performance analysis and optimization'
      },
      stage6: {
        title: '6. Preserve',
        description: 'Content archival and maintenance'
      }
    },
    optimization: {
      metrics: 'Performance Metrics',
      analytics: 'Analytics',
      monitoring: 'Monitoring',
      settings: 'Settings'
    }
  },
  zh: {
    app: {
      title: 'Vue 管理系统'
    },
    menu: {
      dashboard: '仪表板',
      lifecycle: '内容生命周期',
      pages: '页面',
      profile: '个人资料',
      settings: '设置'
    },
    header: {
      profile: '个人资料',
      settings: '设置',
      logout: '退出登录'
    },
    footer: {
      copyright: '© {year} Vue 管理系统. 保留所有权利.'
    },
    login: {
      title: '欢迎回来',
      username: '用户名',
      password: '密码',
      submit: '登录'
    },
    lifecycle: {
      title: '数字内容生命周期',
      stage1: {
        title: '1. 规划',
        description: '战略规划和内容策略制定'
      },
      stage2: {
        title: '2. 创建',
        description: '内容创建和资源开发'
      },
      stage3: {
        title: '3. 管理',
        description: '内容组织和工作流程管理'
      },
      stage4: {
        title: '4. 分发',
        description: '内容发布和分发'
      },
      stage5: {
        title: '5. 优化',
        description: '性能分析和优化'
      },
      stage6: {
        title: '6. 保存',
        description: '内容归档和维护'
      }
    },
    optimization: {
      metrics: '性能指标',
      analytics: '分析',
      monitoring: '监控',
      settings: '设置'
    }
  }
}

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})