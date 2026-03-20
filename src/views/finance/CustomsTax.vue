<template>
  <div class="customs-tax">
    <h2 class="page-title">关税与清关财税管理</h2>
    
    <!-- 标签页 -->
    <el-tabs v-model="activeTab">
      <!-- 报关税费核算 -->
      <el-tab-pane label="报关税费核算" name="duty-calculation">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>报关税费核算</span>
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
            
            <el-table :data="dutyCalculations" style="width: 100%">
              <el-table-column prop="customsId" label="报关单号" width="180" />
              <el-table-column prop="orderId" label="订单号" width="180" />
              <el-table-column prop="productName" label="商品名称" />
              <el-table-column prop="declaredValue" label="申报价值" width="120" />
              <el-table-column prop="tariffRate" label="关税税率" width="100" />
              <el-table-column prop="tariffAmount" label="关税金额" width="120" />
              <el-table-column prop="vatAmount" label="增值税金额" width="120" />
              <el-table-column prop="consumptionTaxAmount" label="消费税金额" width="150" />
              <el-table-column prop="totalTax" label="总税费" width="120" />
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 清关费用管理 -->
      <el-tab-pane label="清关费用管理" name="customs-fee">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>清关费用管理</span>
                <el-button type="primary" size="small" @click="openFeeDrawer">
                  <el-icon><Plus /></el-icon> 新增费用
                </el-button>
              </div>
            </template>
            
            <el-table :data="customsFees" style="width: 100%">
              <el-table-column prop="feeId" label="费用单号" width="180" />
              <el-table-column prop="customsId" label="报关单号" width="180" />
              <el-table-column prop="feeType" label="费用类型" width="120" />
              <el-table-column prop="amount" label="费用金额" width="120" />
              <el-table-column prop="allocationMethod" label="分摊方式" width="120" />
              <el-table-column prop="paymentDate" label="支付日期" width="180" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="editFee(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteFee(scope.row.id)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 海关合规管理 -->
      <el-tab-pane label="海关合规管理" name="customs-compliance">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>海关合规管理</span>
              </div>
            </template>
            
            <el-table :data="complianceChecks" style="width: 100%">
              <el-table-column prop="checkId" label="检查单号" width="180" />
              <el-table-column prop="orderId" label="订单号" width="180" />
              <el-table-column prop="declaredValue" label="申报价值" width="120" />
              <el-table-column prop="marketValue" label="市场价值" width="120" />
              <el-table-column prop="riskLevel" label="风险等级" width="100">
                <template #default="scope">
                  <el-tag :type="getRiskType(scope.row.riskLevel)">
                    {{ scope.row.riskLevel }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="checkResult" label="检查结果" width="120" />
              <el-table-column prop="checkDate" label="检查日期" width="180" />
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

// 激活的标签页
const activeTab = ref('duty-calculation')

// 报关税费核算
const dateRange = ref([])
const dutyCalculations = ref([
  {
    customsId: 'CUS-2026-001',
    orderId: 'AMZ-2026-001',
    productName: 'Smartphone',
    declaredValue: '$1000',
    tariffRate: '10%',
    tariffAmount: '$100',
    vatAmount: '$220',
    consumptionTaxAmount: '$0',
    totalTax: '$320'
  },
  {
    customsId: 'CUS-2026-002',
    orderId: 'AMZ-2026-002',
    productName: 'Laptop',
    declaredValue: '$2000',
    tariffRate: '5%',
    tariffAmount: '$100',
    vatAmount: '$440',
    consumptionTaxAmount: '$0',
    totalTax: '$540'
  }
])

// 清关费用管理
const customsFees = ref([
  {
    id: '1',
    feeId: 'FEE-2026-001',
    customsId: 'CUS-2026-001',
    feeType: '清关费',
    amount: '$50',
    allocationMethod: '按订单',
    paymentDate: '2026-03-01'
  },
  {
    id: '2',
    feeId: 'FEE-2026-002',
    customsId: 'CUS-2026-001',
    feeType: '查验费',
    amount: '$30',
    allocationMethod: '按订单',
    paymentDate: '2026-03-02'
  }
])

// 海关合规管理
const complianceChecks = ref([
  {
    checkId: 'CHECK-2026-001',
    orderId: 'AMZ-2026-001',
    declaredValue: '$1000',
    marketValue: '$1200',
    riskLevel: 'Low',
    checkResult: '通过',
    checkDate: '2026-03-01'
  },
  {
    checkId: 'CHECK-2026-002',
    orderId: 'AMZ-2026-002',
    declaredValue: '$2000',
    marketValue: '$2100',
    riskLevel: 'Low',
    checkResult: '通过',
    checkDate: '2026-03-02'
  }
])

// 获取风险类型
const getRiskType = (level: string) => {
  switch (level) {
    case 'Low': return 'success'
    case 'Medium': return 'warning'
    case 'High': return 'danger'
    default: return 'default'
  }
}

// 打开费用编辑抽屉
const openFeeDrawer = () => {
  // 实现逻辑
}

// 编辑费用
const editFee = (_row: any) => {
  // 实现逻辑
}

// 删除费用
const deleteFee = (id: string) => {
  customsFees.value = customsFees.value.filter(r => r.id !== id)
}
</script>

<style scoped>
.customs-tax {
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
</style>