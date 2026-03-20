<template>
  <div class="profit-calculation">
    <h2 class="page-title">利润核算中心</h2>
    
    <!-- 标签页 -->
    <el-tabs v-model="activeTab">
      <!-- 多维度利润核算 -->
      <el-tab-pane label="多维度利润核算" name="multi-dimension">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>多维度利润核算</span>
                <el-select v-model="dimension" size="small">
                  <el-option label="订单维度" value="order" />
                  <el-option label="商品维度" value="product" />
                  <el-option label="店铺维度" value="shop" />
                  <el-option label="平台维度" value="platform" />
                  <el-option label="月度维度" value="month" />
                </el-select>
              </div>
            </template>
            
            <el-table :data="profitCalculations" style="width: 100%">
              <el-table-column prop="dimensionValue" label="维度值" width="180" />
              <el-table-column prop="salesAmount" label="销售额" width="120" />
              <el-table-column prop="costAmount" label="成本" width="120" />
              <el-table-column prop="grossProfit" label="毛利" width="120">
                <template #default="scope">
                  <span :class="scope.row.grossProfit.startsWith('+') ? 'profit' : 'loss'">
                    {{ scope.row.grossProfit }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="grossProfitRate" label="毛利率" width="120" />
              <el-table-column prop="expenses" label="费用" width="120" />
              <el-table-column prop="netProfit" label="净利" width="120">
                <template #default="scope">
                  <span :class="scope.row.netProfit.startsWith('+') ? 'profit' : 'loss'">
                    {{ scope.row.netProfit }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="netProfitRate" label="净利率" width="120" />
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 费用分摊管理 -->
      <el-tab-pane label="费用分摊管理" name="expense-allocation">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>费用分摊管理</span>
                <el-button type="primary" size="small" @click="openAllocationDrawer">
                  <el-icon><Plus /></el-icon> 新增分摊规则
                </el-button>
              </div>
            </template>
            
            <el-table :data="allocationRules" style="width: 100%">
              <el-table-column prop="ruleId" label="规则编号" width="150" />
              <el-table-column prop="expenseType" label="费用类型" width="120" />
              <el-table-column prop="allocationMethod" label="分摊方式" width="120" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="editAllocation(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteAllocation(scope.row.id)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 利润报表 -->
      <el-tab-pane label="利润报表" name="profit-report">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>利润报表</span>
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="small"
                />
              </div>
            </template>
            
            <div class="report-summary">
              <el-statistic title="总销售额" :value="totalSales" prefix="$" />
              <el-statistic title="总成本" :value="totalCost" prefix="$" />
              <el-statistic title="总毛利" :value="totalGrossProfit" prefix="$" />
              <el-statistic title="总净利" :value="totalNetProfit" prefix="$" />
              <el-statistic title="毛利率" :value="grossProfitRate" suffix="%" />
              <el-statistic title="净利率" :value="netProfitRate" suffix="%" />
            </div>
            
            <div id="profitChart" class="chart-container"></div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 激活的标签页
const activeTab = ref('multi-dimension')

// 多维度利润核算
const dimension = ref('order')
const profitCalculations = ref([
  {
    dimensionValue: 'AMZ-2026-001',
    salesAmount: '$1000',
    costAmount: '$600',
    grossProfit: '+$400',
    grossProfitRate: '40%',
    expenses: '$100',
    netProfit: '+$300',
    netProfitRate: '30%'
  },
  {
    dimensionValue: 'AMZ-2026-002',
    salesAmount: '$1500',
    costAmount: '$900',
    grossProfit: '+$600',
    grossProfitRate: '40%',
    expenses: '$150',
    netProfit: '+$450',
    netProfitRate: '30%'
  }
])

// 费用分摊管理
const allocationRules = ref([
  {
    id: '1',
    ruleId: 'RULE-001',
    expenseType: '平台佣金',
    allocationMethod: '按销售额',
    description: '按订单销售额比例分摊平台佣金'
  },
  {
    id: '2',
    ruleId: 'RULE-002',
    expenseType: '物流费',
    allocationMethod: '按订单',
    description: '按订单数量平均分摊物流费用'
  }
])

// 利润报表
const dateRange = ref([])
const totalSales = ref(2500)
const totalCost = ref(1500)
const totalGrossProfit = ref(1000)
const totalNetProfit = ref(750)
const grossProfitRate = ref(40)
const netProfitRate = ref(30)
let profitChart: echarts.ECharts | null = null

// 打开分摊规则编辑抽屉
const openAllocationDrawer = () => {
  // 实现逻辑
}

// 编辑分摊规则
const editAllocation = (_row: any) => {
  // 实现逻辑
}

// 删除分摊规则
const deleteAllocation = (id: string) => {
  allocationRules.value = allocationRules.value.filter(r => r.id !== id)
}

// 初始化图表
const initChart = () => {
  profitChart = echarts.init(document.getElementById('profitChart'))
  profitChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['销售额', '成本', '毛利', '净利']
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
    series: [
      {
        name: '销售额',
        type: 'bar',
        data: [2000, 2500, 3000, 3500, 4000, 4500]
      },
      {
        name: '成本',
        type: 'bar',
        data: [1200, 1500, 1800, 2100, 2400, 2700]
      },
      {
        name: '毛利',
        type: 'bar',
        data: [800, 1000, 1200, 1400, 1600, 1800]
      },
      {
        name: '净利',
        type: 'bar',
        data: [600, 750, 900, 1050, 1200, 1350]
      }
    ]
  })

  window.addEventListener('resize', () => {
    profitChart?.resize()
  })
}

onMounted(() => {
  if (activeTab.value === 'profit-report') {
    initChart()
  }
})

onUnmounted(() => {
  profitChart?.dispose()
})
</script>

<style scoped>
.profit-calculation {
  width: 100%;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 24px;
}

.tab-content {
  margin-top: 20px;
}

.card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profit {
  color: #67c23a;
}

.loss {
  color: #f56c6c;
}

.report-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-container {
  height: 400px;
  width: 100%;
}
</style>