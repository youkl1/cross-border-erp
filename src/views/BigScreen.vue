<template>
  <div class="big-screen-container">
    <!-- 顶部标题 -->
    <div class="screen-header">
      <h1>跨境电商ERP系统 - 统计大屏</h1>
      <div class="header-info">
        <span>更新时间: {{ updateTime }}</span>
        <el-button type="primary" size="small" @click="refreshData">刷新数据</el-button>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="screen-content">
      <!-- 第一行：核心指标 -->
      <div class="row">
        <div class="col">
          <div class="metric-card">
            <div class="metric-title">总销售额</div>
            <div class="metric-value">¥{{ formatCurrency(totalSales) }}</div>
            <div class="metric-change positive">+12.5%</div>
          </div>
        </div>
        <div class="col">
          <div class="metric-card">
            <div class="metric-title">订单数量</div>
            <div class="metric-value">{{ totalOrders }}</div>
            <div class="metric-change positive">+8.3%</div>
          </div>
        </div>
        <div class="col">
          <div class="metric-card">
            <div class="metric-title">客单价</div>
            <div class="metric-value">¥{{ formatCurrency(averageOrderValue) }}</div>
            <div class="metric-change positive">+4.2%</div>
          </div>
        </div>
        <div class="col">
          <div class="metric-card">
            <div class="metric-title">转化率</div>
            <div class="metric-value">{{ conversionRate }}%</div>
            <div class="metric-change negative">-0.8%</div>
          </div>
        </div>
      </div>
      
      <!-- 第二行：图表 -->
      <div class="row">
        <div class="col-6">
          <div class="chart-card">
            <div class="chart-title">销售趋势</div>
            <div id="salesTrendChart" ref="salesTrendChart" class="chart-container"></div>
          </div>
        </div>
        <div class="col-6">
          <div class="chart-card">
            <div class="chart-title">订单来源</div>
            <div id="orderSourceChart" ref="orderSourceChart" class="chart-container"></div>
          </div>
        </div>
      </div>
      
      <!-- 第三行：图表 -->
      <div class="row">
        <div class="col-4">
          <div class="chart-card">
            <div class="chart-title">库存状态</div>
            <div id="inventoryChart" ref="inventoryChart" class="chart-container"></div>
          </div>
        </div>
        <div class="col-4">
          <div class="chart-card">
            <div class="chart-title">热销产品</div>
            <div id="hotProductsChart" ref="hotProductsChart" class="chart-container"></div>
          </div>
        </div>
        <div class="col-4">
          <div class="chart-card">
            <div class="chart-title">平台分布</div>
            <div id="platformChart" ref="platformChart" class="chart-container"></div>
          </div>
        </div>
      </div>
      
      <!-- 第四行：实时订单 -->
      <div class="row">
        <div class="col-12">
          <div class="chart-card">
            <div class="chart-title">实时订单</div>
            <el-table :data="recentOrders" style="width: 100%">
              <el-table-column prop="orderId" label="订单号" width="180" />
              <el-table-column prop="platform" label="平台" width="120" />
              <el-table-column prop="amount" label="金额" width="120">
                <template #default="scope">
                  ¥{{ formatCurrency(scope.row.amount) }}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" />
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { formatCurrency } from '../utils/format'

// 响应式数据
const updateTime = ref(new Date().toLocaleString())
const totalSales = ref(1258000)
const totalOrders = ref(3250)
const averageOrderValue = ref(387)
const conversionRate = ref(3.8)

// 图表引用
const salesTrendChart = ref<HTMLElement>()
const orderSourceChart = ref<HTMLElement>()
const inventoryChart = ref<HTMLElement>()
const hotProductsChart = ref<HTMLElement>()
const platformChart = ref<HTMLElement>()

// 图表实例
let salesTrendInstance: echarts.ECharts | null = null
let orderSourceInstance: echarts.ECharts | null = null
let inventoryInstance: echarts.ECharts | null = null
let hotProductsInstance: echarts.ECharts | null = null
let platformInstance: echarts.ECharts | null = null

// 实时订单数据
const recentOrders = ref([
  { orderId: 'ORD20240101001', platform: 'Amazon', amount: 299, status: '已支付', createTime: '2024-01-01 10:00:00' },
  { orderId: 'ORD20240101002', platform: 'eBay', amount: 199, status: '待发货', createTime: '2024-01-01 10:05:00' },
  { orderId: 'ORD20240101003', platform: 'Shopee', amount: 149, status: '已发货', createTime: '2024-01-01 10:10:00' },
  { orderId: 'ORD20240101004', platform: 'Amazon', amount: 399, status: '已支付', createTime: '2024-01-01 10:15:00' },
  { orderId: 'ORD20240101005', platform: 'eBay', amount: 249, status: '待发货', createTime: '2024-01-01 10:20:00' }
])

// 方法
const refreshData = () => {
  updateTime.value = new Date().toLocaleString()
  console.log('刷新数据')
  // 实现数据刷新逻辑
}

const getStatusType = (status: string) => {
  switch (status) {
    case '已支付': return 'success'
    case '待发货': return 'warning'
    case '已发货': return 'info'
    case '已完成': return 'primary'
    case '已取消': return 'danger'
    default: return ''
  }
}

// 初始化销售趋势图表
const initSalesTrendChart = () => {
  if (salesTrendChart.value) {
    salesTrendInstance = echarts.init(salesTrendChart.value)
    
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
    
    salesTrendInstance.setOption(option)
  }
}

// 初始化订单来源图表
const initOrderSourceChart = () => {
  if (orderSourceChart.value) {
    orderSourceInstance = echarts.init(orderSourceChart.value)
    
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '订单来源',
          type: 'pie',
          radius: '60%',
          data: [
            { value: 45, name: 'Amazon' },
            { value: 25, name: 'eBay' },
            { value: 15, name: 'Shopee' },
            { value: 10, name: 'Wish' },
            { value: 5, name: '其他' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    
    orderSourceInstance.setOption(option)
  }
}

// 初始化库存状态图表
const initInventoryChart = () => {
  if (inventoryChart.value) {
    inventoryInstance = echarts.init(inventoryChart.value)
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: ['库存充足', '库存预警', '库存不足']
      },
      series: [
        {
          name: '商品数量',
          type: 'bar',
          data: [1200, 350, 150],
          itemStyle: {
            color: function(params: any) {
              const colors = ['#67c23a', '#e6a23c', '#f56c6c']
              return colors[params.dataIndex]
            }
          }
        }
      ]
    }
    
    inventoryInstance.setOption(option)
  }
}

// 初始化热销产品图表
const initHotProductsChart = () => {
  if (hotProductsChart.value) {
    hotProductsInstance = echarts.init(hotProductsChart.value)
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['产品A', '产品B', '产品C', '产品D', '产品E'],
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '销量'
      },
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [1200, 980, 850, 720, 650],
          itemStyle: {
            color: '#409eff'
          }
        }
      ]
    }
    
    hotProductsInstance.setOption(option)
  }
}

// 初始化平台分布图表
const initPlatformChart = () => {
  if (platformChart.value) {
    platformInstance = echarts.init(platformChart.value)
    
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '平台分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 45, name: 'Amazon' },
            { value: 25, name: 'eBay' },
            { value: 15, name: 'Shopee' },
            { value: 10, name: 'Wish' },
            { value: 5, name: '其他' }
          ]
        }
      ]
    }
    
    platformInstance.setOption(option)
  }
}

// 监听窗口大小变化
const handleResize = () => {
  salesTrendInstance?.resize()
  orderSourceInstance?.resize()
  inventoryInstance?.resize()
  hotProductsInstance?.resize()
  platformInstance?.resize()
}

// 生命周期
onMounted(() => {
  initSalesTrendChart()
  initOrderSourceChart()
  initInventoryChart()
  initHotProductsChart()
  initPlatformChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  salesTrendInstance?.dispose()
  orderSourceInstance?.dispose()
  inventoryInstance?.dispose()
  hotProductsInstance?.dispose()
  platformInstance?.dispose()
})
</script>

<style scoped>
.big-screen-container {
  width: 100%;
  height: 100vh;
  background: #f0f2f5;
  overflow: auto;
}

.screen-header {
  background: #1890ff;
  color: #fff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.screen-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.screen-content {
  padding: 20px;
}

.row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.col {
  flex: 1;
}

.col-4 {
  flex: 0 0 33.333%;
}

.col-6 {
  flex: 0 0 50%;
}

.col-12 {
  flex: 1;
}

.metric-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.metric-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.metric-change {
  font-size: 12px;
}

.positive {
  color: #67c23a;
}

.negative {
  color: #f56c6c;
}

.chart-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
}

.chart-container {
  width: 100%;
  height: 300px;
}
</style>