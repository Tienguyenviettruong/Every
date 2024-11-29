<script setup lang="ts">
import { ref } from 'vue'
import LabLayout from '../layouts/LabLayout.vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const datasets = ref([
  {
    name: 'Sample Dataset 1',
    description: 'Time series data for analysis',
    size: '2.4MB',
    lastModified: '2024-03-20'
  },
  {
    name: 'Sample Dataset 2',
    description: 'Customer behavior analysis',
    size: '1.8MB',
    lastModified: '2024-03-19'
  }
])

const chartData = ref({
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Data Series 1',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: '#41B883',
      tension: 0.1
    },
    {
      label: 'Data Series 2',
      data: [28, 48, 40, 19, 86, 27],
      borderColor: '#00D8FF',
      tension: 0.1
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    }
  }
}
</script>

<template>
  <LabLayout>
    <div class="lab-content">
      <h1 class="title">Data Analysis Lab</h1>
      
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>Data Visualization</span>
                <el-button-group>
                  <el-button type="primary" size="small">
                    <el-icon><Download /></el-icon>
                    Export
                  </el-button>
                  <el-button type="primary" size="small">
                    <el-icon><Share /></el-icon>
                    Share
                  </el-button>
                </el-button-group>
              </div>
            </template>
            <div class="chart-container">
              <Line :data="chartData" :options="chartOptions" />
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="datasets-card">
            <template #header>
              <div class="card-header">
                <span>Available Datasets</span>
                <el-button type="primary" size="small">
                  <el-icon><Plus /></el-icon>
                  Add Dataset
                </el-button>
              </div>
            </template>
            <el-table :data="datasets" style="width: 100%">
              <el-table-column prop="name" label="Name" />
              <el-table-column prop="size" label="Size" width="100" />
              <el-table-column prop="lastModified" label="Modified" width="120" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </LabLayout>
</template>

<style scoped lang="scss">
.lab-content {
  padding: 24px;

  .title {
    margin: 0 0 24px;
    font-size: 24px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

.chart-card {
  margin-bottom: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .chart-container {
    height: 400px;
  }
}

.datasets-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>