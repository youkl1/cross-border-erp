<template>
  <div class="sales-report-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>销售报表</span>
          <div class="header-actions">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
              @change="handleDateChange"
            />
            <el-button type="primary" @click="exportReport">导出报表</el-button>
          </div>
        </div>
      </template>
      
      <div class="report-content">
        <!-- 销售概览 -->
        <div class="overview-section">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card class="overview-card" :body-style="{ padding: '20px' }">
                <div class="overview-item">
                  <div class="overview-label">总销售额</div>
                  <div class="overview-value">¥{{ formatCurrency(totalSales) }}</div>
                  <div class="overview-change positive">+12.5%</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" :body-style="{ padding: '20px' }">
                <div class="overview-item">
                  <div class="overview-label">订单数量</div>
                  <div class="overview-value">{{ totalOrders }}</div>
                  <div class="overview-change positive">+8.3%</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" :body-style="{ padding: '20px' }">
                <div class="overview-item">
                  <div class="overview-label">客单价</div>
                  <div class="overview-value">¥{{ formatCurrency(averageOrderValue) }}</div>
                  <div class="overview-change positive">+4.2%</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="overview-card" :body-style="{ padding: '20px' }">
                <div class="overview-item">
                  <div class="overview-label">转化率</div>
                  <div class="overview-value">{{ conversionRate }}%</div>
                  <div class="overview-change negative">-0.8%</div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <!-- 销售趋势图 -->
        <div class="chart-section">
          <el-card class="chart-card">
            <template #header>
              <span>销售趋势</span>
            </template>
            <div id="salesTrendChart" ref="salesTrendChart" class="chart-container"></div>
          </el-card>
        </div>
        
        <!-- 销售数据表格 -->
        <div class="table-section">
          <el-card class="table-card">
            <template #header>
              <span>销售明细</span>
            </template>
            <el-table :data="salesData" style="width: 100%">
              <el-table-column prop="date" label="日期" width="180" />
              <el-table-column prop="sales" label="销售额" width="180">
                <template #default="scope">
                  ¥{{ formatCurrency(scope.row.sales) }}
                </template>
              </el-table-column>
              <el-table-column prop="orders" label="订单数" width="120" />
              <el-table-column prop="average" label="客单价">
                <template #default="scope">
                  ¥{{ formatCurrency(scope.row.average) }}
                </template>
              </el-table-column>
              <el-table-column prop="change" label="同比变化">
                <template #default="scope">
                  <span :class="scope.row.change >= 0 ? 'positive' : 'negative'">
                    {{ scope.row.change >= 0 ? '+' : '' }}{{ scope.row.change }}%
                  </span>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalData"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { formatCurrency } from '../../utils/format'

// 响应式数据
const dateRange = ref<[Date, Date] | null>(null)
const totalSales = ref(1258000)
const totalOrders = ref(3250)
const averageOrderValue = ref(387)
const conversionRate = ref(3.8)
const currentPage = ref(1)
const pageSize = ref(10)
const totalData = ref(100)
const salesTrendChart = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 模拟销售数据
const salesData = ref([
  { date: '2024-01-01', sales: 45000, orders: 120, average: 375, change: 5.2 },
  { date: '2024-01-02', sales: 48000, orders: 130, average: 369, change: 8.3 },
  { date: '2024-01-03', sales: 42000, orders: 110, average: 382, change: -2.1 },
  { date: '2024-01-04', sales: 51000, orders: 140, average: 364, change: 12.5 },
  { date: '2024-01-05', sales: 49000, orders: 135, average: 363, change: 6.7 },
  { date: '2024-01-06', sales: 53000, orders: 145, average: 366, change: 9.8 },
  { date: '2024-01-07', sales: 47000, orders: 125, average: 376, change: -2.3 },
  { date: '2024-01-08', sales: 50000, orders: 138, average: 362, change: 5.6 },
  { date: '2024-01-09', sales: 52000, orders: 142, average: 366, change: 8.1 },
  { date: '2024-01-10', sales: 48500, orders: 132, average: 367, change: -1.2 }
])

// 方法
const handleDateChange = (val: [Date, Date] | null) => {
  console.log('日期范围变化:', val)
  // 这里可以根据日期范围重新获取数据
}

const exportReport = () => {
  console.log('导出报表')
  // 实现导出逻辑
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  console.log(`每页 ${size} 条`)
}

const handleCurrentChange = (current: number) => {
  currentPage.value = current
  console.log(`当前页: ${current}`)
}

// 初始化图表
const initChart = () => {
  if (salesTrendChart.value) {
    chartInstance = echarts.init(salesTrendChart.value)
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['销售额', '订单数']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: [
        {
          type: 'value',
          name: '销售额',
          position: 'left'
        },
        {
          type: 'value',
          name: '订单数',
          position: 'right'
        }
      ],
      series: [
        {
          name: '销售额',
          type: 'line',
          data: [120000, 190000, 300000, 250000, 360000, 420000, 380000, 450000, 520000, 480000, 550000, 620000],
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 122, 255, 0.5)' },
              { offset: 1, color: 'rgba(0, 122, 255, 0.1)' }
            ])
          }
        },
        {
          name: '订单数',
          type: 'line',
          yAxisIndex: 1,
          data: [320, 450, 800, 650, 950, 1100, 1000, 1200, 1350, 1250, 1400, 1550],
          smooth: true
        }
      ]
    }
    
    chartInstance.setOption(option)
  }
}

// 监听窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
}

// 生命周期
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.sales-report-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.overview-section {
  margin-bottom: 20px;
}

.overview-card {
  margin-bottom: 20px;
}

.overview-item {
  text-align: center;
}

.overview-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.overview-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.overview-change {
  font-size: 12px;
}

.positive {
  color: #67c23a;
}

.negative {
  color: #f56c6c;
}

.chart-section {
  margin-bottom: 20px;
}

.chart-card {
  height: 400px;
}

.chart-container {
  width: 100%;
  height: 350px;
}

.table-section {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>