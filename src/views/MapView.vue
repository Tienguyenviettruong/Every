<template>
  <div class="map-container">
    <el-card class="map-card">
      <template #header>
        <div class="card-header">
          <h3>{{ $t('map.title') }}</h3>
          <div class="controls">
            <el-button type="primary" @click="downloadMap">
              {{ $t('map.download') }}
            </el-button>
            <el-upload
              class="upload-demo"
              :auto-upload="false"
              accept=".json,.geojson"
              @change="handleGeoJSONUpload"
            >
              <el-button type="success">{{ $t('map.uploadGeoJSON') }}</el-button>
            </el-upload>
          </div>
        </div>
      </template>
      <div ref="chartRef" class="chart-container"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import html2canvas from 'html2canvas'
import type { EChartsType } from 'echarts'
import customGeoJson from '../assets/custom.geo.json'

const chartRef = ref<HTMLElement>()
let chartInstance: EChartsType | null = null

const initChart = () => {
  if (!chartRef.value) return

  // Wait for DOM to be ready
  nextTick(() => {
    chartInstance = echarts.init(chartRef.value)
    
    try {
      const option = {
        backgroundColor: '#f5f5f5',
        title: {
          text: 'Vietnam Map',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        },
        visualMap: {
          min: 0,
          max: 100,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8']
          }
        },
        series: [
          {
            name: 'Vietnam',
            type: 'map',
            map: 'VNM',
            roam: true,
            emphasis: {
              label: {
                show: true
              }
            },
            data: [
              { name: 'Hanoi', value: 100 },
              { name: 'Ho Chi Minh City', value: 90 },
              { name: 'Da Nang', value: 80 },
              { name: 'Can Tho', value: 70 },
              { name: 'Hai Phong', value: 60 }
            ]
          }
        ]
      }

      // @ts-ignore
      echarts.registerMap('VNM', customGeoJson)
      chartInstance.setOption(option)
    } catch (error) {
      console.error('Error loading map:', error)
    }
  })
}

const handleGeoJSONUpload = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const geoJSON = JSON.parse(e.target?.result as string)
      // @ts-ignore - Ignore type checking for GeoJSON data
      echarts.registerMap('custom', geoJSON)
      chartInstance?.setOption({
        series: [
          {
            map: 'custom'
          }
        ]
      })
    } catch (error) {
      console.error('Error parsing GeoJSON:', error)
    }
  }
  reader.readAsText(file.raw)
}

const downloadMap = async () => {
  if (!chartRef.value) return
  
  try {
    const canvas = await html2canvas(chartRef.value)
    const link = document.createElement('a')
    link.download = 'map-visualization.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('Error downloading map:', error)
  }
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.map-container {
  padding: 20px;
  height: 100%;
  min-height: 500px;
  width: 100%;
  
  .map-card {
    height: calc(100vh - 120px);
    min-height: 500px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .controls {
        display: flex;
        gap: 10px;
      }
    }
    
    .chart-container {
      height: calc(100% - 60px);
      min-height: 400px;
      width: 100%;
    }
  }
}
</style> 