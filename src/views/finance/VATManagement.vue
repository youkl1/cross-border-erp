<template>
  <div class="vat-management">
    <h2 class="page-title">VAT税务管理</h2>
    
    <!-- 标签页 -->
    <el-tabs v-model="activeTab">
      <!-- 税号管理 -->
      <el-tab-pane label="税号管理" name="tax-number">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>税号管理</span>
                <el-button type="primary" size="small" @click="openTaxNumberDrawer">
                  <el-icon><Plus /></el-icon> 新增税号
                </el-button>
              </div>
            </template>
            
            <el-table :data="taxNumbers" style="width: 100%">
              <el-table-column prop="country" label="国家/地区" width="150" />
              <el-table-column prop="taxNumber" label="VAT/EORI税号" width="200" />
              <el-table-column prop="registrationInfo" label="注册信息" />
              <el-table-column prop="validUntil" label="有效期" width="180" />
              <el-table-column prop="reportingCycle" label="申报周期" width="120" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="editTaxNumber(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteTaxNumber(scope.row.id)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- VAT税金核算 -->
      <el-tab-pane label="税金核算" name="tax-calculation">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>VAT税金核算</span>
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
            
            <el-table :data="taxCalculations" style="width: 100%">
              <el-table-column prop="orderId" label="订单号" width="180" />
              <el-table-column prop="platform" label="平台" width="120" />
              <el-table-column prop="salesAmount" label="销售金额" width="120" />
              <el-table-column prop="vatRate" label="VAT税率" width="100" />
              <el-table-column prop="vatAmount" label="VAT金额" width="120" />
              <el-table-column prop="calculationDate" label="核算日期" width="180" />
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- VAT申报管理 -->
      <el-tab-pane label="申报管理" name="tax-reporting">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>VAT申报管理</span>
                <el-button type="primary" size="small" @click="generateReport">
                  <el-icon><Document /></el-icon> 生成申报单
                </el-button>
              </div>
            </template>
            
            <el-table :data="taxReports" style="width: 100%">
              <el-table-column prop="reportId" label="申报单号" width="180" />
              <el-table-column prop="country" label="国家/地区" width="150" />
              <el-table-column prop="period" label="申报周期" width="150" />
              <el-table-column prop="totalVat" label="VAT总额" width="120" />
              <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="viewReport(scope.row)">
                    查看
                  </el-button>
                  <el-button type="success" size="small" @click="submitReport(scope.row)">
                    提交
                  </el-button>
                  <el-button size="small" @click="exportReport(scope.row)">
                    导出
                  </el-button>
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
import { Plus, Document } from '@element-plus/icons-vue'

// 激活的标签页
const activeTab = ref('tax-number')

// 税号管理
const taxNumbers = ref([
  {
    id: '1',
    country: 'United Kingdom',
    taxNumber: 'GB123456789',
    registrationInfo: 'Registered with HMRC',
    validUntil: '2027-03-31',
    reportingCycle: 'Quarterly'
  },
  {
    id: '2',
    country: 'Germany',
    taxNumber: 'DE987654321',
    registrationInfo: 'Registered with Bundeszentralamt für Steuern',
    validUntil: '2027-06-30',
    reportingCycle: 'Monthly'
  }
])

// 税金核算
const dateRange = ref([])
const taxCalculations = ref([
  {
    orderId: 'AMZ-2026-001',
    platform: 'Amazon',
    salesAmount: '$1000',
    vatRate: '20%',
    vatAmount: '$200',
    calculationDate: '2026-03-01'
  },
  {
    orderId: 'AMZ-2026-002',
    platform: 'Amazon',
    salesAmount: '$1500',
    vatRate: '20%',
    vatAmount: '$300',
    calculationDate: '2026-03-02'
  }
])

// 申报管理
const taxReports = ref([
  {
    reportId: 'VAT-2026-Q1-001',
    country: 'United Kingdom',
    period: '2026 Q1',
    totalVat: '$5000',
    status: 'Draft'
  },
  {
    reportId: 'VAT-2026-FEB-001',
    country: 'Germany',
    period: '2026-02',
    totalVat: '$3000',
    status: 'Submitted'
  }
])

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'Draft': return 'info'
    case 'Submitted': return 'success'
    case 'Approved': return 'primary'
    case 'Rejected': return 'danger'
    default: return 'default'
  }
}

// 打开税号编辑抽屉
const openTaxNumberDrawer = () => {
  // 实现逻辑
}

// 编辑税号
const editTaxNumber = (_row: any) => {
  // 实现逻辑
}

// 删除税号
const deleteTaxNumber = (id: string) => {
  taxNumbers.value = taxNumbers.value.filter(r => r.id !== id)
}

// 生成申报单
const generateReport = () => {
  // 实现逻辑
}

// 查看申报单
const viewReport = (_row: any) => {
  // 实现逻辑
}

// 提交申报单
const submitReport = (_row: any) => {
  // 实现逻辑
}

// 导出申报单
const exportReport = (_row: any) => {
  // 实现逻辑
}
</script>

<style scoped>
.vat-management {
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