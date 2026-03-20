<template>
  <div class="tax-refund">
    <h2 class="page-title">出口退税管理</h2>
    
    <!-- 标签页 -->
    <el-tabs v-model="activeTab">
      <!-- 退税备案管理 -->
      <el-tab-pane label="退税备案管理" name="refund-record">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>退税备案管理</span>
                <el-button type="primary" size="small" @click="openRecordDrawer">
                  <el-icon><Plus /></el-icon> 新增备案
                </el-button>
              </div>
            </template>
            
            <el-table :data="refundRecords" style="width: 100%">
              <el-table-column prop="recordId" label="备案编号" width="180" />
              <el-table-column prop="companyName" label="企业名称" width="200" />
              <el-table-column prop="registrationNumber" label="备案号" width="180" />
              <el-table-column prop="validFrom" label="有效期起" width="150" />
              <el-table-column prop="validUntil" label="有效期止" width="150" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="editRecord(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteRecord(scope.row.id)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 退税申报管理 -->
      <el-tab-pane label="退税申报管理" name="refund-application">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>退税申报管理</span>
                <el-button type="primary" size="small" @click="generateApplication">
                  <el-icon><Document /></el-icon> 生成申报单
                </el-button>
              </div>
            </template>
            
            <el-table :data="refundApplications" style="width: 100%">
              <el-table-column prop="applicationId" label="申报单号" width="180" />
              <el-table-column prop="period" label="申报周期" width="150" />
              <el-table-column prop="totalAmount" label="退税金额" width="120" />
              <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="submitDate" label="提交日期" width="180" />
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="viewApplication(scope.row)">
                    查看
                  </el-button>
                  <el-button type="success" size="small" @click="submitApplication(scope.row)">
                    提交
                  </el-button>
                  <el-button size="small" @click="exportApplication(scope.row)">
                    导出
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 退税进度跟踪 -->
      <el-tab-pane label="退税进度跟踪" name="refund-progress">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>退税进度跟踪</span>
              </div>
            </template>
            
            <el-table :data="refundProgresses" style="width: 100%">
              <el-table-column prop="applicationId" label="申报单号" width="180" />
              <el-table-column prop="totalAmount" label="退税金额" width="120" />
              <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="approveDate" label="审批日期" width="180" />
              <el-table-column prop="refundDate" label="退税到账日期" width="180" />
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
import { Plus, Document } from '@element-plus/icons-vue'

// 激活的标签页
const activeTab = ref('refund-record')

// 退税备案管理
const refundRecords = ref([
  {
    id: '1',
    recordId: 'REC-2026-001',
    companyName: 'ABC Trading Co., Ltd.',
    registrationNumber: 'TX123456789',
    validFrom: '2026-01-01',
    validUntil: '2027-12-31',
    status: 'Valid'
  },
  {
    id: '2',
    recordId: 'REC-2026-002',
    companyName: 'XYZ Export Co., Ltd.',
    registrationNumber: 'TX987654321',
    validFrom: '2026-01-01',
    validUntil: '2027-12-31',
    status: 'Valid'
  }
])

// 退税申报管理
const refundApplications = ref([
  {
    applicationId: 'REF-2026-02-001',
    period: '2026-02',
    totalAmount: '$5000',
    status: 'Submitted',
    submitDate: '2026-03-01'
  },
  {
    applicationId: 'REF-2026-01-001',
    period: '2026-01',
    totalAmount: '$3000',
    status: 'Approved',
    submitDate: '2026-02-01'
  }
])

// 退税进度跟踪
const refundProgresses = ref([
  {
    applicationId: 'REF-2026-01-001',
    totalAmount: '$3000',
    status: 'Refunded',
    approveDate: '2026-02-15',
    refundDate: '2026-02-20',
    remarks: '已到账'
  },
  {
    applicationId: 'REF-2026-02-001',
    totalAmount: '$5000',
    status: 'Approved',
    approveDate: '2026-03-10',
    refundDate: '',
    remarks: '审批通过，等待退税'
  }
])

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'Valid': return 'success'
    case 'Expired': return 'danger'
    case 'Draft': return 'info'
    case 'Submitted': return 'primary'
    case 'Approved': return 'success'
    case 'Rejected': return 'danger'
    case 'Refunded': return 'success'
    default: return 'default'
  }
}

// 打开备案编辑抽屉
const openRecordDrawer = () => {
  // 实现逻辑
}

// 编辑备案
const editRecord = (_row: any) => {
  // 实现逻辑
}

// 删除备案
const deleteRecord = (id: string) => {
  refundRecords.value = refundRecords.value.filter(r => r.id !== id)
}

// 生成申报单
const generateApplication = () => {
  // 实现逻辑
}

// 查看申报单
const viewApplication = (_row: any) => {
  // 实现逻辑
}

// 提交申报单
const submitApplication = (_row: any) => {
  // 实现逻辑
}

// 导出申报单
const exportApplication = (_row: any) => {
  // 实现逻辑
}
</script>

<style scoped>
.tax-refund {
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