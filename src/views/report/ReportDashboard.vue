<template>
  <div class="report-dashboard">
    <h2 class="page-title">经营看板</h2>
    
    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
          />
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="searchForm.platform" placeholder="请选择平台" size="small">
            <el-option label="全部平台" value="all" />
            <el-option label="Amazon" value="Amazon" />
            <el-option label="Temu" value="Temu" />
            <el-option label="AliExpress" value="AliExpress" />
            <el-option label="Shopee" value="Shopee" />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺">
          <el-select v-model="searchForm.storeId" placeholder="请选择店铺" size="small">
            <el-option label="全部店铺" value="all" />
            <el-option label="Amazon US Store" value="1" />
            <el-option label="Temu Global" value="2" />
            <el-option label="AliExpress Store" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="search">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button size="small" @click="reset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 核心指标卡片 -->
    <div class="metrics-cards">
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-value">$1,250,000</div>
          <div class="metric-label">总销售额</div>
          <div class="metric-change positive">+12.5%</div>
        </div>
        <div class="metric-icon sales-icon">
          <el-icon><TrendCharts /></el-icon>
        </div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-value">8,500</div>
          <div class="metric-label">订单量</div>
          <div class="metric-change positive">+8.2%</div>
        </div>
        <div class="metric-icon order-icon">
          <el-icon><Tickets /></el-icon>
        </div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-value">$320,000</div>
          <div class="metric-label">净利润</div>
          <div class="metric-change positive">+15.8%</div>
        </div>
        <div class="metric-icon profit-icon">
          <el-icon><Money /></el-icon>
        </div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-value">25</div>
          <div class="metric-label">店铺数</div>
          <div class="metric-change positive">+2</div>
        </div>
        <div class="metric-icon store-icon">
          <el-icon><Shop /></el-icon>
        </div>
      </el-card>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-container">
      <!-- 销售趋势图 -->
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>销售趋势</span>
            <el-select v-model="chartTimeRange" size="small" style="width: 120px">
              <el-option label="近7天" value="7d" />
              <el-option label="近30天" value="30d" />
              <el-option label="近90天" value="90d" />
            </el-select>
          </div>
        </template>
        <div ref="salesChartRef" class="chart"></div>
      </el-card>
      
      <!-- 平台销售分布 -->
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>平台销售分布</span>
          </div>
        </template>
        <div ref="platformChartRef" class="chart"></div>
      </el-card>
      
      <!-- 热销商品 -->
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>热销商品</span>
          </div>
        </template>
        <div class="top-products">
          <el-table :data="topProducts" style="width: 100%">
            <el-table-column prop="rank" label="排名" width="80" />
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="sales" label="销售额" width="120" />
            <el-table-column prop="quantity" label="销量" width="100" />
            <el-table-column prop="profit" label="利润" width="120" />
          </el-table>
        </div>
      </el-card>
      
      <!-- 库存状态 -->
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>库存状态</span>
          </div>
        </template>
        <div ref="inventoryChartRef" class="chart"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Search, TrendCharts, Tickets, Money, Shop } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 搜索表单
const searchForm = reactive({
  dateRange: [],
  platform: 'all',
  storeId: 'all'
})

// 图表时间范围
const chartTimeRange = ref('30d')

// 图表引用
const salesChartRef = ref<HTMLElement>()
const platformChartRef = ref<HTMLElement>()
const inventoryChartRef = ref<HTMLElement>()

// 图表实例
let salesChart: echarts.ECharts | null = null
let platformChart: echarts.ECharts | null = null
let inventoryChart: echarts.ECharts | null = null

// 热销商品数据
const topProducts = ref([
  { rank: 1, name: 'Smartphone Pro', sales: '$120,000', quantity: 800, profit: '$36,000' },
  { rank: 2, name: 'Laptop Air', sales: '$95,000', quantity: 380, profit: '$28,500' },
  { rank: 3, name: 'Tablet Pro', sales: '$78,000', quantity: 450, profit: '$23,400' },
  { rank: 4, name: 'Smartwatch', sales: '$65,000', quantity: 1300, profit: '$19,500' },
  { rank: 5, name: 'Wireless Earbuds', sales: '$45,000', quantity: 1800, profit: '$13,500' }
])

// 搜索
const search = () => {
  // 实现搜索逻辑
  console.log('搜索条件:', searchForm)
  updateCharts()
}

// 重置
const reset = () => {
  Object.assign(searchForm, {
    dateRange: [],
    platform: 'all',
    storeId: 'all'
  })
  chartTimeRange.value = '30d'
  updateCharts()
}

// 初始化图表
const initCharts = () => {
  if (salesChartRef.value) {
    salesChart = echarts.init(salesChartRef.value)
  }
  if (platformChartRef.value) {
    platformChart = echarts.init(platformChartRef.value)
  }
  if (inventoryChartRef.value) {
    inventoryChart = echarts.init(inventoryChartRef.value)
  }
  updateCharts()
}

// 更新图表
const updateCharts = () => {
  // 销售趋势图
  if (salesChart) {
    const option = {
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
        data: [850000, 920000, 1050000, 980000, 1150000, 1250000],
        type: 'line',
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
          ])
        },
        lineStyle: {
          color: '#1890ff'
        },
        itemStyle: {
          color: '#1890ff'
        }
      }]
    }
    salesChart.setOption(option)
  }
  
  // 平台销售分布图
  if (platformChart) {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ${c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [{
        type: 'pie',
        radius: '60%',
        data: [
          { value: 650000, name: 'Amazon' },
          { value: 280000, name: 'Temu' },
          { value: 180000, name: 'AliExpress' },
          { value: 140000, name: 'Shopee' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
    platformChart.setOption(option)
  }
  
  // 库存状态图
  if (inventoryChart) {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: ['国内主仓', '美国海外仓', '保税仓']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '总库存',
        type: 'bar',
        data: [12000, 18000, 5000],
        itemStyle: {
          color: '#1890ff'
        }
      }, {
        name: '可用库存',
        type: 'bar',
        data: [9500, 15000, 3500],
        itemStyle: {
          color: '#52c41a'
        }
      }]
    }
    inventoryChart.setOption(option)
  }
}

// 响应式调整
const handleResize = () => {
  salesChart?.resize()
  platformChart?.resize()
  inventoryChart?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  salesChart?.dispose()
  platformChart?.dispose()
  inventoryChart?.dispose()
})
</script>

<style scoped>
.report-dashboard {
  width: 100%;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 24px;
}

.filter-card {
  margin-bottom: 24px;
}

/* 核心指标卡片 */
.metrics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  display: flex;
  align-items: center;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.metric-change {
  font-size: 12px;
  font-weight: 500;
}

.metric-change.positive {
  color: #52c41a;
}

.metric-change.negative {
  color: #f5222d;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
  font-size: 24px;
}

.sales-icon {
  background-color: #e6f7ff;
  color: #1890ff;
}

.order-icon {
  background-color: #f6ffed;
  color: #52c41a;
}

.profit-icon {
  background-color: #fff7e6;
  color: #fa8c16;
}

.store-icon {
  background-color: #f9f0ff;
  color: #722ed1;
}

/* 图表区域 */
.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
}

.chart-card {
  margin-bottom: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  color: #303133;
}

.chart {
  height: 300px;
  margin-top: 16px;
}

.top-products {
  margin-top: 16px;
}

@media screen and (max-width: 1200px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart {
    height: 250px;
  }
}

@media screen and (max-width: 768px) {
  .metrics-cards {
    grid-template-columns: 1fr;
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart {
    height: 200px;
  }
}
</style>