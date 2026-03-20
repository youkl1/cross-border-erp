<template>
  <div class="exchange-gain">
    <h2 class="page-title">汇兑损益管理</h2>
    
    <!-- 标签页 -->
    <el-tabs v-model="activeTab">
      <!-- 汇率波动损益 -->
      <el-tab-pane label="汇率波动损益" name="exchange-fluctuation">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>汇率波动损益</span>
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
            
            <el-table :data="exchangeFluctuations" style="width: 100%">
              <el-table-column prop="orderId" label="订单号" width="180" />
              <el-table-column prop="currency" label="币种" width="100" />
              <el-table-column prop="transactionAmount" label="交易金额" width="120" />
              <el-table-column prop="transactionRate" label="交易汇率" width="120" />
              <el-table-column prop="currentRate" label="当前汇率" width="120" />
              <el-table-column prop="gainLoss" label="汇兑损益" width="120">
                <template #default="scope">
                  <span :class="scope.row.gainLoss.startsWith('+') ? 'gain' : 'loss'">
                    {{ scope.row.gainLoss }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="calculationDate" label="核算日期" width="180" />
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 期末调汇管理 -->
      <el-tab-pane label="期末调汇管理" name="period-end-adjustment">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>期末调汇管理</span>
                <el-button type="primary" size="small" @click="generateAdjustment">
                  <el-icon><Calculator /></el-icon> 生成调汇
                </el-button>
              </div>
            </template>
            
            <el-table :data="periodEndAdjustments" style="width: 100%">
              <el-table-column prop="adjustmentId" label="调汇单号" width="180" />
              <el-table-column prop="period" label="调汇期间" width="150" />
              <el-table-column prop="currency" label="币种" width="100" />
              <el-table-column prop="adjustmentAmount" label="调汇金额" width="120">
                <template #default="scope">
                  <span :class="scope.row.adjustmentAmount.startsWith('+') ? 'gain' : 'loss'">
                    {{ scope.row.adjustmentAmount }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="adjustmentDate" label="调汇日期" width="180" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="viewAdjustment(scope.row)">
                    查看
                  </el-button>
                  <el-button size="small" @click="exportAdjustment(scope.row)">
                    导出
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 汇兑损益报表 -->
      <el-tab-pane label="汇兑损益报表" name="exchange-report">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>汇兑损益报表</span>
                <el-select v-model="reportType" size="small">
                  <el-option label="按币种" value="currency" />
                  <el-option label="按周期" value="period" />
                  <el-option label="按店铺" value="shop" />
                </el-select>
              </div>
            </template>
            
            <el-table :data="exchangeReports" style="width: 100%">
              <el-table-column prop="currency" label="币种" width="100" />
              <el-table-column prop="period" label="周期" width="150" />
              <el-table-column prop="shopName" label="店铺" width="150" />
              <el-table-column prop="totalGain" label="汇兑收益" width="120" />
              <el-table-column prop="totalLoss" label="汇兑损失" width="120" />
              <el-table-column prop="netGainLoss" label="净损益" width="120">
                <template #default="scope">
                  <span :class="scope.row.netGainLoss.startsWith('+') ? 'gain' : 'loss'">
                    {{ scope.row.netGainLoss }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 激活的标签页
const activeTab = ref('exchange-fluctuation')

// 汇率波动损益
const dateRange = ref([])
const exchangeFluctuations = ref([
  {
    orderId: 'AMZ-2026-001',
    currency: 'USD',
    transactionAmount: '$1000',
    transactionRate: '7.2',
    currentRate: '7.3',
    gainLoss: '+$100',
    calculationDate: '2026-03-01'
  },
  {
    orderId: 'AMZ-2026-002',
    currency: 'EUR',
    transactionAmount: '€500',
    transactionRate: '7.8',
    currentRate: '7.7',
    gainLoss: '-$50',
    calculationDate: '2026-03-02'
  }
])

// 期末调汇管理
const periodEndAdjustments = ref([
  {
    adjustmentId: 'ADJ-2026-02',
    period: '2026-02',
    currency: 'USD',
    adjustmentAmount: '+$1500',
    adjustmentDate: '2026-03-01'
  },
  {
    adjustmentId: 'ADJ-2026-01',
    period: '2026-01',
    currency: 'EUR',
    adjustmentAmount: '-$800',
    adjustmentDate: '2026-02-01'
  }
])

// 汇兑损益报表
const reportType = ref('currency')
const exchangeReports = ref([
  {
    currency: 'USD',
    period: '2026-02',
    shopName: 'Amazon US',
    totalGain: '$2000',
    totalLoss: '$500',
    netGainLoss: '+$1500'
  },
  {
    currency: 'EUR',
    period: '2026-02',
    shopName: 'Amazon DE',
    totalGain: '$800',
    totalLoss: '$1600',
    netGainLoss: '-$800'
  }
])

// 生成调汇
const generateAdjustment = () => {
  // 实现逻辑
}

// 查看调汇
const viewAdjustment = (_row: any) => {
  // 实现逻辑
}

const exportAdjustment = (_row: any) => {
  // 实现逻辑
}
</script>

<style scoped>
.exchange-gain {
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

.gain {
  color: #67c23a;
}

.loss {
  color: #f56c6c;
}
</style>