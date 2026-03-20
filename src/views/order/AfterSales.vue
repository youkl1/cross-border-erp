<template>
  <div class="after-sales">
    <h2 class="page-title">售后管理</h2>
    
    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="售后单号">
          <el-input v-model="searchForm.afterSalesId" placeholder="请输入售后单号" size="small" />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderId" placeholder="请输入订单号" size="small" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" size="small">
            <el-option label="退货" value="return" />
            <el-option label="退款" value="refund" />
            <el-option label="换货" value="exchange" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" size="small">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
          />
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
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="small" @click="batchApprove">
        <el-icon><Check /></el-icon> 批量批准
      </el-button>
      <el-button type="danger" size="small" @click="batchReject">
        <el-icon><Close /></el-icon> 批量拒绝
      </el-button>
      <el-button type="warning" size="small" @click="batchExport">
        <el-icon><Download /></el-icon> 批量导出
      </el-button>
    </div>
    
    <!-- 售后列表 -->
    <el-card class="list-card">
      <el-table
        :data="afterSalesList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="afterSalesId" label="售后单号" width="180" />
        <el-table-column prop="orderId" label="订单号" width="180" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeType(scope.row.type)">
              {{ scope.row.typeText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="amount" label="金额" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.statusText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewAfterSales(scope.row)">
              查看
            </el-button>
            <el-button type="success" size="small" @click="approveAfterSales(scope.row)">
              批准
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 售后详情弹窗 -->
    <el-dialog
      title="售后详情"
      v-model="afterSalesDetailVisible"
      width="80%"
    >
      <div v-if="currentAfterSales" class="after-sales-detail">
        <el-tabs v-model="detailActiveTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions :column="2">
              <el-descriptions-item label="售后单号">{{ currentAfterSales.afterSalesId }}</el-descriptions-item>
              <el-descriptions-item label="订单号">{{ currentAfterSales.orderId }}</el-descriptions-item>
              <el-descriptions-item label="类型">{{ currentAfterSales.typeText }}</el-descriptions-item>
              <el-descriptions-item label="状态">{{ currentAfterSales.statusText }}</el-descriptions-item>
              <el-descriptions-item label="金额">{{ currentAfterSales.amount }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ currentAfterSales.createdAt }}</el-descriptions-item>
              <el-descriptions-item label="申请人" :span="2">{{ currentAfterSales.customerName }}</el-descriptions-item>
              <el-descriptions-item label="申请原因" :span="2">{{ currentAfterSales.reason }}</el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">{{ currentAfterSales.remarks }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="商品信息" name="product">
            <el-table :data="[currentAfterSales.product]" style="width: 100%">
              <el-table-column prop="sku" label="SKU" width="150" />
              <el-table-column prop="name" label="商品名称" />
              <el-table-column prop="quantity" label="数量" width="100" />
              <el-table-column prop="price" label="单价" width="120" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="处理记录" name="process">
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in currentAfterSales.processRecords"
                :key="index"
                :timestamp="item.time"
              >
                {{ item.content }}
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
        </el-tabs>
        
        <!-- 处理表单 -->
        <div v-if="currentAfterSales.status === 'pending'" class="process-form">
          <h3>处理售后</h3>
          <el-form :model="processForm" label-width="100px">
            <el-form-item label="处理结果">
              <el-radio-group v-model="processForm.result">
                <el-radio label="approve">批准</el-radio>
                <el-radio label="reject">拒绝</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="处理意见">
              <el-input v-model="processForm.comment" type="textarea" rows="3" placeholder="请输入处理意见" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="processAfterSales">提交处理</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Check, Close, Download } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  afterSalesId: '',
  orderId: '',
  type: '',
  status: '',
  dateRange: []
})

// 售后列表数据
const afterSalesList = ref([
  {
    id: '1',
    afterSalesId: 'AS-2026-001',
    orderId: 'AMZ-2026-001',
    type: 'refund',
    typeText: '退款',
    productName: 'Smartphone',
    amount: '$800',
    status: 'pending',
    statusText: '待处理',
    createdAt: '2026-03-05 10:00:00',
    customerName: 'John Doe',
    reason: '商品质量问题',
    remarks: '手机屏幕有划痕',
    product: {
      sku: 'SKU001',
      name: 'Smartphone',
      quantity: 1,
      price: '$800'
    },
    processRecords: [
      {
        time: '2026-03-05 10:00:00',
        content: '用户提交退款申请'
      }
    ]
  },
  {
    id: '2',
    afterSalesId: 'AS-2026-002',
    orderId: 'AMZ-2026-002',
    type: 'return',
    typeText: '退货',
    productName: 'Laptop',
    amount: '$1400',
    status: 'processing',
    statusText: '处理中',
    createdAt: '2026-03-06 11:00:00',
    customerName: 'Jane Smith',
    reason: '商品与描述不符',
    remarks: '笔记本配置与描述不一致',
    product: {
      sku: 'SKU003',
      name: 'Laptop',
      quantity: 1,
      price: '$1400'
    },
    processRecords: [
      {
        time: '2026-03-06 11:00:00',
        content: '用户提交退货申请'
      },
      {
        time: '2026-03-06 14:00:00',
        content: '客服确认退货申请'
      }
    ]
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)

// 选中的售后
const selectedAfterSales = ref<any[]>([])

// 售后详情
const afterSalesDetailVisible = ref(false)
const currentAfterSales = ref<any>(null)
const detailActiveTab = ref('basic')

// 处理表单
const processForm = reactive({
  result: 'approve',
  comment: ''
})

// 获取类型类型
const getTypeType = (type: string) => {
  switch (type) {
    case 'return': return 'warning'
    case 'refund': return 'danger'
    case 'exchange': return 'primary'
    default: return 'default'
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'pending': return 'info'
    case 'processing': return 'warning'
    case 'completed': return 'success'
    case 'rejected': return 'danger'
    default: return 'default'
  }
}

// 搜索
const search = () => {
  // 实现搜索逻辑
  console.log('搜索条件:', searchForm)
}

// 重置
const reset = () => {
  Object.assign(searchForm, {
    afterSalesId: '',
    orderId: '',
    type: '',
    status: '',
    dateRange: []
  })
}

// 处理选择变化
const handleSelectionChange = (val: any[]) => {
  selectedAfterSales.value = val
}

// 批量批准
const batchApprove = () => {
  if (selectedAfterSales.value.length === 0) {
    alert('请选择要批准的售后申请')
    return
  }
  selectedAfterSales.value.forEach((afterSales) => {
    if (afterSales.status === 'pending') {
      afterSales.status = 'processing'
      afterSales.statusText = '处理中'
      afterSales.processRecords.push({
        time: new Date().toLocaleString(),
        content: '系统批量批准售后申请'
      })
    }
  })
  alert('批量批准成功')
}

// 批量拒绝
const batchReject = () => {
  if (selectedAfterSales.value.length === 0) {
    alert('请选择要拒绝的售后申请')
    return
  }
  selectedAfterSales.value.forEach((afterSales) => {
    if (afterSales.status === 'pending') {
      afterSales.status = 'rejected'
      afterSales.statusText = '已拒绝'
      afterSales.processRecords.push({
        time: new Date().toLocaleString(),
        content: '系统批量拒绝售后申请'
      })
    }
  })
  alert('批量拒绝成功')
}

// 批量导出
const batchExport = () => {
  if (selectedAfterSales.value.length === 0) {
    alert('请选择要导出的售后申请')
    return
  }
  // 模拟导出功能
  const dataStr = JSON.stringify(selectedAfterSales.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `after_sales_${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
  alert('批量导出成功')
}

// 查看售后
const viewAfterSales = (afterSales: any) => {
  currentAfterSales.value = afterSales
  afterSalesDetailVisible.value = true
}

// 批准售后
const approveAfterSales = (afterSales: any) => {
  if (afterSales.status === 'pending') {
    afterSales.status = 'processing'
    afterSales.statusText = '处理中'
    afterSales.processRecords.push({
      time: new Date().toLocaleString(),
      content: '系统批准售后申请'
    })
    alert('批准成功')
  }
}

// 处理售后
const processAfterSales = () => {
  if (!currentAfterSales.value) return
  if (currentAfterSales.value.status === 'pending') {
    if (processForm.result === 'approve') {
      currentAfterSales.value.status = 'processing'
      currentAfterSales.value.statusText = '处理中'
      currentAfterSales.value.processRecords.push({
        time: new Date().toLocaleString(),
        content: `客服批准售后申请，意见：${processForm.comment}`
      })
    } else {
      currentAfterSales.value.status = 'rejected'
      currentAfterSales.value.statusText = '已拒绝'
      currentAfterSales.value.processRecords.push({
        time: new Date().toLocaleString(),
        content: `客服拒绝售后申请，意见：${processForm.comment}`
      })
    }
    alert('处理成功')
    afterSalesDetailVisible.value = false
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
}

const handleCurrentChange = (current: number) => {
  currentPage.value = current
}
</script>

<style scoped>
.after-sales {
  width: 100%;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 24px;
}

.filter-card {
  margin-bottom: 16px;
}

.action-buttons {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
}

.list-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.after-sales-detail {
  width: 100%;
}

.process-form {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.process-form h3 {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
</style>