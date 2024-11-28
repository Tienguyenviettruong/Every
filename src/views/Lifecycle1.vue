<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()

const handleStageClick = (title: string) => {
  if (title === 'Optimize') {
    router.push('/optimize')
  }
}

const stages = [
  {
    icon: '🚀',
    title: 'Plan',
    description: 'Strategic planning and roadmap development',
    color: '#1890ff',
    outer: true
  },
  {
    icon: '✏️',
    title: 'Create',
    description: 'Product design and development',
    color: '#52c41a',
    outer: false
  },
  {
    icon: '⚙️',
    title: 'Manage',
    description: 'Product implementation and monitoring',
    color: '#722ed1',
    outer: true
  },
  {
    icon: '📢',
    title: 'Distribute',
    description: 'Launch and distribution strategy',
    color: '#fa8c16',
    outer: false
  },
  {
    icon: '📊',
    title: 'Optimize',
    description: 'Performance analysis and improvements',
    color: '#eb2f96',
    outer: true
  },
  {
    icon: '🔄',
    title: 'Preserve',
    description: 'Maintenance and updates',
    color: '#13c2c2',
    outer: false
  }
]
</script>

<template>
  <div class="lifecycle-page">
    <div class="header-section">
      <h1 class="title">PRODUCT</h1>
      <h1 class="subtitle">MANAGEMENT</h1>
      <h1 class="subtitle">LIFECYCLE</h1>
    </div>

    <div class="lifecycle-diagram">
      <div class="outer-circle"></div>
      <div class="inner-circle"></div>
      
      <div class="center-text">EVE</div>
      
      <div class="stages-container">
        <div 
          v-for="(stage, index) in stages" 
          :key="index"
          class="stage"
          :class="{ 'outer-stage': stage.outer }"
          :style="{
            '--rotation': `${index * 60}deg`,
            '--color': stage.color,
            '--translate-distance': stage.outer ? '250px' : '160px'
          }"
          @click="handleStageClick(stage.title)"
        >
          <div class="stage-content">
            <div class="stage-icon">{{ stage.icon }}</div>
            <h3>{{ stage.title }}</h3>
            <p>{{ stage.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lifecycle-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.header-section {
  text-align: left;
  margin-bottom: 2rem;

  .title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1e3799;
    margin: 0;
    line-height: 1;
  }

  .subtitle {
    font-size: 2.5rem;
    font-weight: 800;
    color: #00a8ff;
    margin: 0;
    line-height: 1;
  }
}

.lifecycle-diagram {
  position: relative;
  width: 600px;
  height: 600px;
  margin: 0 auto;
}

.center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5rem;
  font-weight: bold;
  color: #a8eedf;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.outer-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 520px;
  height: 520px;
  border-radius: 50%;
  border: 2px solid #6cdbf7;
  box-shadow: 0 0 10px 0 rgba(187, 185, 185, 0.3);
}

.inner-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 340px;
  height: 340px;
  border-radius: 50%;
  border: 2px solid #b3daff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
}

.stages-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.stage {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  margin-left: -60px;
  margin-top: -60px;
  transform-origin: 100% 100%;
  transform: rotate(var(--rotation)) translate(var(--translate-distance)) rotate(calc(-1 * var(--rotation)));
  cursor: pointer;

  .stage-content {
    background: white;
    border-radius: 50%;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    border: 2px solid var(--color);
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
  }

  .stage-icon {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }

  h3 {
    color: var(--color);
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }

  p {
    margin: 0;
    font-size: 0.65rem;
    color: #666;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>