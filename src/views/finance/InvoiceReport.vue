<template>
  <div class="invoice-report">
    <h2 class="page-title">发票与财务报表管理</h2>
    
    <!-- 标签页 -->
    <el-tabs v-model="activeTab">
      <!-- 发票管理 -->
      <el-tab-pane label="发票管理" name="invoice">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>发票管理</span>
                <el-button type="primary" size="small" @click="openInvoiceDrawer">
                  <el-icon><Plus /></el-icon> 新增发票
                </el-button>
              </div>
            </template>
            
            <el-table :data="invoices" style="width: 100%">
              <el-table-column prop="invoiceId" label="发票编号" width="180" />
              <el-table-column prop="invoiceType" label="发票类型" width="120">
                <template #default="scope">
                  <el-tag :type="scope.row.invoiceType === '进项' ? 'success' : 'primary'">
                    {{ scope.row.invoiceType }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="金额" width="120" />
              <el-table-column prop="invoiceDate" label="开票日期" width="180" />
              <el-table-column prop="relatedId" label="关联单号" width="180" />
              <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="viewInvoice(scope.row)">
                    查看
                  </el-button>
                  <el-button size="small" @click="exportInvoice(scope.row)">
                    导出
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 标准财务报表 -->
      <el-tab-pane label="标准财务报表" name="standard-report">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>标准财务报表</span>
                <el-select v-model="reportType" size="small">
                  <el-option label="利润表" value="profit" />
                  <el-option label="资产负债表" value="balance" />
                  <el-option label="现金流量表" value="cash" />
                </el-select>
              </div>
            </template>
            
            <div class="report-header">
              <el-date-picker
                v-model="reportPeriod"
                type="month"
                placeholder="选择报表期间"
                size="small"
              />
              <el-button type="primary" size="small" @click="generateReport">
                <el-icon><Document /></el-icon> 生成报表
              </el-button>
              <el-button size="small" @click="exportReport">
                <el-icon><Download /></el-icon> 导出报表
              </el-button>
            </div>
            
            <div class="report-content">
              <!-- 利润表示例 -->
              <div v-if="reportType === 'profit'" class="profit-table">
                <h3>利润表 - {{ reportPeriod }}</h3>
                <el-table :data="profitReportData" style="width: 100%">
                  <el-table-column prop="item" label="项目" />
                  <el-table-column prop="amount" label="金额" width="150" />
                </el-table>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 跨境专项报表 -->
      <el-tab-pane label="跨境专项报表" name="cross-border-report">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>跨境专项报表</span>
                <el-select v-model="crossBorderReportType" size="small">
                  <el-option label="跨境业务收支报表" value="income" />
                  <el-option label="税务申报辅助报表" value="tax" />
                  <el-option label="库存成本报表" value="inventory" />
                  <el-option label="年度汇算辅助报表" value="annual" />
                </el-select>
              </div>
            </template>
            
            <div class="report-header">
              <el-date-picker
                v-model="crossBorderDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
              />
              <el-button type="primary" size="small" @click="generateCrossBorderReport">
                <el-icon><Document /></el-icon> 生成报表
              </el-button>
              <el-button size="small" @click="exportCrossBorderReport">
                <el-icon><Download /></el-icon> 导出报表
              </el-button>
            </div>
            
            <div class="report-content">
              <!-- 跨境业务收支报表示例 -->
              <div v-if="crossBorderReportType === 'income'" class="income-table">
                <h3>跨境业务收支报表</h3>
                <el-table :data="incomeReportData" style="width: 100%">
                  <el-table-column prop="category" label="类别" />
                  <el-table-column prop="amount" label="金额" width="150" />
                  <el-table-column prop="percentage" label="占比" width="100" />
                </el-table>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Document, Download } from '@element-plus/icons-vue'

// 激活的标签页
const activeTab = ref('invoice')

// 发票管理
const invoices = ref([
  {
    invoiceId: 'INV-2026-03-001',
    invoiceType: '进项',
    amount: '$500',
    invoiceDate: '2026-03-01',
    relatedId: 'PUR-2026-001',
    status: '已认证'
  },
  {
    invoiceId: 'INV-2026-03-002',
    invoiceType: '销项',
    amount: '$1000',
    invoiceDate: '2026-03-02',
    relatedId: 'AMZ-2026-001',
    status: '已开具'
  }
])

// 标准财务报表
const reportType = ref('profit')
const reportPeriod = ref('2026-02')
const profitReportData = ref([
  { item: '一、营业收入', amount: '$100,000' },
  { item: '减：营业成本', amount: '$60,000' },
  { item: '营业税金及附加', amount: '$5,000' },
  { item: '销售费用', amount: '$10,000' },
  { item: '管理费用', amount: '$5,000' },
  { item: '财务费用', amount: '$2,000' },
  { item: '二、营业利润', amount: '$18,000' },
  { item: '加：营业外收入', amount: '$1,000' },
  { item: '减：营业外支出', amount: '$500' },
  { item: '三、利润总额', amount: '$18,500' },
  { item: '减：所得税费用', amount: '$4,625' },
  { item: '四、净利润', amount: '$13,875' }
])

// 跨境专项报表
const crossBorderReportType = ref('income')
const crossBorderDateRange = ref([])
const incomeReportData = ref([
  { category: '平台销售收入', amount: '$80,000', percentage: '80%' },
  { category: '其他收入', amount: '$5,000', percentage: '5%' },
  { category: '平台佣金', amount: '$8,000', percentage: '8%' },
  { category: '物流费用', amount: '$5,000', percentage: '5%' },
  { category: '税费', amount: '$2,000', percentage: '2%' }
])

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case '已开具': return 'success'
    case '已认证': return 'success'
    case '待认证': return 'warning'
    case '作废': return 'danger'
    default: return 'default'
  }
}

// 打开发票编辑抽屉
const openInvoiceDrawer = () => {
  // 实现逻辑
}

// 查看发票
const viewInvoice = (_row: any) => {
  // 实现逻辑
}

const exportInvoice = (_row: any) => {
  // 实现逻辑
}

// 生成标准报表
const generateReport = () => {
  // 实现逻辑
}

// 导出标准报表
const exportReport = () => {
  // 实现逻辑
}

// 生成跨境专项报表
const generateCrossBorderReport = () => {
  // 实现逻辑
}

// 导出跨境专项报表
const exportCrossBorderReport = () => {
  // 实现逻辑
}
</script>

<style scoped>
.invoice-report {
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

.report-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.report-content {
  margin-top: 20px;
}

.profit-table h3,
.income-table h3 {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
</style>