<script setup lang="ts">
import { ref } from 'vue'
import OptimizeLayout from '../layouts/OptimizeLayout.vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const metrics = {
  performance: {
    value: '98%',
    label: 'System Performance'
  },
  users: {
    value: '2.4k',
    label: 'Active Users'
  },
  uptime: {
    value: '99.9%',
    label: 'System Uptime'
  }
}

const doughnutData = ref({
  labels: ['Performance', 'Users', 'Uptime'],
  datasets: [
    {
      data: [98, 2400, 99.9],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }
  ]
})
</script>

<template>
  <OptimizeLayout>
    <div class="optimization-content">
      <h1 class="title">Optimization Dashboard</h1>
      
      <div class="metrics-grid">
        <el-card v-for="(metric, key) in metrics" :key="key" class="metric-card">
          <div class="metric-content">
            <div class="metric-icon">
              <el-icon v-if="key === 'performance'"><DataLine /></el-icon>
              <el-icon v-if="key === 'users'"><User /></el-icon>
              <el-icon v-if="key === 'uptime'"><Monitor /></el-icon>
            </div>
            <!-- <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-label">{{ metric.label }}</div> -->
            <div class="doughnut-chart">
        <Doughnut :data="doughnutData" />
      </div>
          </div>
        </el-card>
      </div>

      
    </div>
  </OptimizeLayout>
</template>

<style scoped lang="scss">
.optimization-content {
  padding: 24px;

  .title {
    margin: 0 0 24px;
    font-size: 24px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  width: 100%;
}

.metric-card {
  .metric-content {
    text-align: center;
    padding: 16px;
  }

  .metric-icon {
    font-size: 32px;
    color: var(--el-color-primary);
    margin-bottom: 16px;
  }

  .metric-value {
    font-size: 36px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 8px;
  }

  .metric-label {
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}

.doughnut-chart {
  margin-top: 24px;
}
</style>