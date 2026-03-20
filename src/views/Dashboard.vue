<template>
  <div class="dashboard">
    <h2 class="page-title">经营看板</h2>
    
    <!-- 核心指标卡片 -->
    <div class="metrics-cards">
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-value">$128,500</div>
          <div class="metric-label">总销售额</div>
          <div class="metric-trend positive">+12.5%</div>
        </div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-value">2,845</div>
          <div class="metric-label">订单量</div>
          <div class="metric-trend positive">+8.2%</div>
        </div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-value">32</div>
          <div class="metric-label">店铺数</div>
          <div class="metric-trend neutral">+0</div>
        </div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-value">$32,450</div>
          <div class="metric-label">利润</div>
          <div class="metric-trend positive">+15.8%</div>
        </div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-value">2.3%</div>
          <div class="metric-label">退款率</div>
          <div class="metric-trend negative">-0.5%</div>
        </div>
      </el-card>
    </div>

    <!-- 销售趋势图表 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>销售趋势</span>
          <el-select v-model="dateRange" size="small">
            <el-option label="近7天" value="7d" />
            <el-option label="近30天" value="30d" />
            <el-option label="近90天" value="90d" />
          </el-select>
        </div>
      </template>
      <div id="salesChart" class="chart-container"></div>
    </el-card>

    <!-- 平台销售分布 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>平台销售分布</span>
        </div>
      </template>
      <div id="platformChart" class="chart-container"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const dateRange = ref('30d')
let salesChart: echarts.ECharts | null = null
let platformChart: echarts.ECharts | null = null

onMounted(() => {
  initCharts()
})

onUnmounted(() => {
  salesChart?.dispose()
  platformChart?.dispose()
})

const initCharts = () => {
  // 销售趋势图表
  salesChart = echarts.init(document.getElementById('salesChart'))
  salesChart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: ${c}'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}'
      }
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330],
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#409eff'
      }
    }]
  })

  // 平台销售分布图表
  platformChart = echarts.init(document.getElementById('platformChart'))
  platformChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ${c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [{
      data: [
        { value: 45000, name: '亚马逊' },
        { value: 30000, name: '速卖通' },
        { value: 25000, name: 'Shopee' },
        { value: 15000, name: 'Lazada' },
        { value: 13500, name: 'TikTok Shop' }
      ],
      type: 'pie',
      radius: '60%'
    }]
  })

  // 响应式调整
  window.addEventListener('resize', () => {
    salesChart?.resize()
    platformChart?.resize()
  })
}
</script>

<style scoped>
.dashboard {
  width: 100%;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 24px;
}

.metrics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  height: 120px;
}

.metric-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.metric-trend {
  font-size: 12px;
  font-weight: 500;
}

.metric-trend.positive {
  color: #67c23a;
}

.metric-trend.negative {
  color: #f56c6c;
}

.metric-trend.neutral {
  color: #909399;
}

.chart-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 400px;
  width: 100%;
}
</style>