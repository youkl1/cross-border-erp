<template>
  <div class="bill-reconciliation">
    <h2 class="page-title">账单与对账管理</h2>
    
    <!-- 标签页 -->
    <el-tabs v-model="activeTab">
      <!-- 平台账单管理 -->
      <el-tab-pane label="平台账单管理" name="platform-bill">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>平台账单管理</span>
                <el-button type="primary" size="small" @click="syncBill">
                  <el-icon><Refresh /></el-icon> 同步账单
                </el-button>
              </div>
            </template>
            
            <el-table :data="platformBills" style="width: 100%">
              <el-table-column prop="billId" label="账单编号" width="180" />
              <el-table-column prop="platform" label="平台" width="120" />
              <el-table-column prop="shopName" label="店铺" width="150" />
              <el-table-column prop="period" label="账单周期" width="150" />
              <el-table-column prop="totalAmount" label="总金额" width="120" />
              <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="viewBill(scope.row)">
                    查看
                  </el-button>
                  <el-button size="small" @click="exportBill(scope.row)">
                    导出
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 往来对账管理 -->
      <el-tab-pane label="往来对账管理" name="reconciliation">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>往来对账管理</span>
                <el-select v-model="reconciliationType" size="small">
                  <el-option label="物流商" value="logistics" />
                  <el-option label="供应商" value="supplier" />
                  <el-option label="服务商" value="service" />
                </el-select>
              </div>
            </template>
            
            <el-table :data="reconciliations" style="width: 100%">
              <el-table-column prop="reconciliationId" label="对账单号" width="180" />
              <el-table-column prop="counterparty" label="对方单位" width="150" />
              <el-table-column prop="period" label="对账周期" width="150" />
              <el-table-column prop="systemAmount" label="系统金额" width="120" />
              <el-table-column prop="counterpartyAmount" label="对方金额" width="120" />
              <el-table-column prop="difference" label="差异" width="120">
                <template #default="scope">
                  <span :class="scope.row.difference === '0' ? 'no-difference' : 'has-difference'">
                    {{ scope.row.difference }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="viewReconciliation(scope.row)">
                    查看
                  </el-button>
                  <el-button type="success" size="small" @click="confirmReconciliation(scope.row)">
                    确认
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 收支流水管理 -->
      <el-tab-pane label="收支流水管理" name="payment-flow">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>收支流水管理</span>
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
            
            <el-table :data="paymentFlows" style="width: 100%">
              <el-table-column prop="flowId" label="流水号" width="180" />
              <el-table-column prop="type" label="类型" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.type === '收入' ? 'success' : 'danger'">
                    {{ scope.row.type }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="金额" width="120" />
              <el-table-column prop="category" label="分类" width="120" />
              <el-table-column prop="relatedId" label="关联单号" width="180" />
              <el-table-column prop="transactionDate" label="交易日期" width="180" />
              <el-table-column prop="remarks" label="备注" />
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'

// 激活的标签页
const activeTab = ref('platform-bill')

// 平台账单管理
const platformBills = ref([
  {
    billId: 'AMZ-2026-02',
    platform: 'Amazon',
    shopName: 'Amazon US',
    period: '2026-02',
    totalAmount: '$12000',
    status: 'Reconciled'
  },
  {
    billId: 'ALI-2026-02',
    platform: 'AliExpress',
    shopName: 'AliExpress Global',
    period: '2026-02',
    totalAmount: '$8000',
    status: 'Pending'
  }
])

// 往来对账管理
const reconciliationType = ref('logistics')
const reconciliations = ref([
  {
    reconciliationId: 'REC-2026-02-001',
    counterparty: 'DHL',
    period: '2026-02',
    systemAmount: '$5000',
    counterpartyAmount: '$5000',
    difference: '0',
    status: 'Confirmed'
  },
  {
    reconciliationId: 'REC-2026-02-002',
    counterparty: 'FedEx',
    period: '2026-02',
    systemAmount: '$3000',
    counterpartyAmount: '$3050',
    difference: '$50',
    status: 'Pending'
  }
])

// 收支流水管理
const dateRange = ref([])
const paymentFlows = ref([
  {
    flowId: 'FLOW-2026-03-001',
    type: '收入',
    amount: '$1000',
    category: '平台收入',
    relatedId: 'AMZ-2026-001',
    transactionDate: '2026-03-01',
    remarks: 'Amazon销售'
  },
  {
    flowId: 'FLOW-2026-03-002',
    type: '支出',
    amount: '$50',
    category: '物流费用',
    relatedId: 'DHL-2026-001',
    transactionDate: '2026-03-01',
    remarks: '国际物流'
  }
])

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'Pending': return 'info'
    case 'Reconciled': return 'success'
    case 'Confirmed': return 'success'
    case 'Unreconciled': return 'warning'
    default: return 'default'
  }
}

// 同步账单
const syncBill = () => {
  // 实现逻辑
}

// 查看账单
const viewBill = (_row: any) => {
  // 实现逻辑
}

// 导出账单
const exportBill = (_row: any) => {
  // 实现逻辑
}

// 查看对账
const viewReconciliation = (_row: any) => {
  // 实现逻辑
}

// 确认对账
const confirmReconciliation = (_row: any) => {
  // 实现逻辑
}
</script>

<style scoped>
.bill-reconciliation {
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

.no-difference {
  color: #67c23a;
}

.has-difference {
  color: #f56c6c;
}
</style>