<template>
  <div class="purchase-order">
    <h2 class="page-title">采购订单</h2>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="small" @click="addOrder">
        <el-icon><Plus /></el-icon> 新增订单
      </el-button>
      <el-button type="success" size="small" @click="batchApprove">
        <el-icon><Check /></el-icon> 批量审批
      </el-button>
      <el-button type="warning" size="small" @click="batchCancel">
        <el-icon><Close /></el-icon> 批量取消
      </el-button>
      <el-button type="danger" size="small" @click="batchDelete">
        <el-icon><Delete /></el-icon> 批量删除
      </el-button>
      <el-button type="info" size="small" @click="batchExport">
        <el-icon><Download /></el-icon> 批量导出
      </el-button>
    </div>
    
    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="订单编号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单编号" size="small" />
        </el-form-item>
        <el-form-item label="供应商">
          <el-select v-model="searchForm.supplierId" placeholder="请选择供应商" size="small">
            <el-option label="全部供应商" value="" />
            <el-option label="供应商A" value="1" />
            <el-option label="供应商B" value="2" />
            <el-option label="供应商C" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" size="small">
            <el-option label="全部状态" value="" />
            <el-option label="待审批" value="pending" />
            <el-option label="已审批" value="approved" />
            <el-option label="已取消" value="cancelled" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
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
    
    <!-- 订单列表 -->
    <el-card class="list-card">
      <el-table
        :data="filteredOrders"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="订单ID" width="120" />
        <el-table-column prop="orderNo" label="订单编号" width="180" />
        <el-table-column prop="supplierName" label="供应商" width="150" />
        <el-table-column prop="totalAmount" label="总金额" width="120">
          <template #default="scope">
            ¥{{ formatCurrency(scope.row.totalAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewOrder(scope.row)">
              查看
            </el-button>
            <el-button size="small" @click="editOrder(scope.row)">
              编辑
            </el-button>
            <el-button :type="scope.row.status === 'pending' ? 'success' : 'warning'" size="small" @click="handleStatus(scope.row)">
              {{ scope.row.status === 'pending' ? '审批' : '取消' }}
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
          :total="filteredOrders.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 订单详情弹窗 -->
    <el-dialog
      title="订单详情"
      v-model="orderDetailVisible"
      width="80%"
    >
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2">
          <el-descriptions-item label="订单ID">{{ currentOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="订单编号">{{ currentOrder.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="供应商">{{ currentOrder.supplierName }}</el-descriptions-item>
          <el-descriptions-item label="总金额">¥{{ formatCurrency(currentOrder.totalAmount) }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ getStatusText(currentOrder.status) }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentOrder.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentOrder.remark }}</el-descriptions-item>
        </el-descriptions>
        
        <h3 style="margin-top: 20px;">商品列表</h3>
        <el-table :data="currentOrder.items" style="width: 100%">
          <el-table-column prop="sku" label="商品编码" width="150" />
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column prop="price" label="单价" width="100">
            <template #default="scope">
              ¥{{ formatCurrency(scope.row.price) }}
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额" width="120">
            <template #default="scope">
              ¥{{ formatCurrency(scope.row.amount) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    
    <!-- 新增/编辑订单弹窗 -->
    <el-dialog
      :title="isEdit ? '编辑订单' : '新增订单'"
      v-model="orderFormVisible"
      width="70%"
    >
      <el-form :model="orderForm" label-width="100px">
        <el-form-item label="订单编号" :required="true">
          <el-input v-model="orderForm.orderNo" placeholder="请输入订单编号" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="供应商" :required="true">
          <el-select v-model="orderForm.supplierId" placeholder="请选择供应商">
            <el-option label="供应商A" value="1" />
            <el-option label="供应商B" value="2" />
            <el-option label="供应商C" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="orderForm.remark" placeholder="请输入备注" rows="3" />
        </el-form-item>
        
        <h3 style="margin-top: 20px;">商品列表</h3>
        <el-table :data="orderForm.items" style="width: 100%">
          <el-table-column prop="sku" label="商品编码" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.sku" placeholder="请输入商品编码" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品名称">
            <template #default="scope">
              <el-input v-model="scope.row.name" placeholder="请输入商品名称" />
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="100">
            <template #default="scope">
              <el-input type="number" v-model="scope.row.quantity" placeholder="数量" @change="updateTotal" />
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" width="100">
            <template #default="scope">
              <el-input type="number" v-model="scope.row.price" placeholder="单价" @change="updateTotal" />
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额" width="120">
            <template #default="scope">
              ¥{{ formatCurrency(scope.row.amount) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <el-button type="danger" size="small" @click="removeItem(scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <el-button type="primary" size="small" style="margin-top: 10px;" @click="addItem">
          <el-icon><Plus /></el-icon> 添加商品
        </el-button>
        
        <el-form-item label="总金额" :required="true" style="margin-top: 20px;">
          <el-input v-model="orderForm.totalAmount" placeholder="总金额" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="orderFormVisible = false">取消</el-button>
          <el-button type="primary" @click="saveOrder">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Search, Plus, Check, Close, Delete, Download } from '@element-plus/icons-vue'
import { formatCurrency } from '../../utils/format'
import { ElMessage } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  supplierId: '',
  status: '',
  dateRange: []
})

// 订单列表数据
const orders = ref([
  {
    id: '1',
    orderNo: 'PO20240101001',
    supplierId: '1',
    supplierName: '供应商A',
    totalAmount: 15000,
    status: 'pending',
    createdAt: '2026-01-01 10:00:00',
    remark: '批量采购商品',
    items: [
      { sku: 'SKU001', name: 'Smartphone', quantity: 10, price: 1000, amount: 10000 },
      { sku: 'SKU002', name: 'Laptop', quantity: 5, price: 1000, amount: 5000 }
    ]
  },
  {
    id: '2',
    orderNo: 'PO20240102002',
    supplierId: '2',
    supplierName: '供应商B',
    totalAmount: 8000,
    status: 'approved',
    createdAt: '2026-01-02 10:00:00',
    remark: '紧急采购',
    items: [
      { sku: 'SKU003', name: 'Tablet', quantity: 8, price: 1000, amount: 8000 }
    ]
  },
  {
    id: '3',
    orderNo: 'PO20240103003',
    supplierId: '3',
    supplierName: '供应商C',
    totalAmount: 12000,
    status: 'completed',
    createdAt: '2026-01-03 10:00:00',
    remark: '常规采购',
    items: [
      { sku: 'SKU004', name: 'Smartwatch', quantity: 12, price: 1000, amount: 12000 }
    ]
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 选中的订单
const selectedOrders = ref<any[]>([])

// 订单详情
const orderDetailVisible = ref(false)
const currentOrder = ref<any>(null)

// 新增/编辑订单
const orderFormVisible = ref(false)
const isEdit = ref(false)
const orderForm = reactive({
  id: '',
  orderNo: '',
  supplierId: '',
  totalAmount: 0,
  remark: '',
  items: [] as any[]
})

// 供应商映射
const supplierMap: Record<string, string> = {
  '1': '供应商A',
  '2': '供应商B',
  '3': '供应商C'
}

// 过滤后的订单列表
const filteredOrders = computed(() => {
  let result = [...orders.value]
  
  // 根据搜索条件过滤
  if (searchForm.orderNo) {
    result = result.filter(item => item.orderNo.includes(searchForm.orderNo))
  }
  if (searchForm.supplierId) {
    result = result.filter(item => item.supplierId === searchForm.supplierId)
  }
  if (searchForm.status) {
    result = result.filter(item => item.status === searchForm.status)
  }
  
  // 分页
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return result.slice(startIndex, endIndex)
})

// 搜索
const search = () => {
  currentPage.value = 1
  ElMessage.success('搜索成功')
}

// 重置
const reset = () => {
  Object.assign(searchForm, {
    orderNo: '',
    supplierId: '',
    status: '',
    dateRange: []
  })
  currentPage.value = 1
  ElMessage.info('已重置搜索条件')
}

// 处理选择变化
const handleSelectionChange = (val: any[]) => {
  selectedOrders.value = val
}

// 新增订单
const addOrder = () => {
  isEdit.value = false
  const orderNo = `PO${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
  Object.assign(orderForm, {
    id: '',
    orderNo: orderNo,
    supplierId: '',
    totalAmount: 0,
    remark: '',
    items: [{
      sku: '',
      name: '',
      quantity: 1,
      price: 0,
      amount: 0
    }]
  })
  orderFormVisible.value = true
}

// 编辑订单
const editOrder = (order: any) => {
  isEdit.value = true
  Object.assign(orderForm, {
    id: order.id,
    orderNo: order.orderNo,
    supplierId: order.supplierId,
    totalAmount: order.totalAmount,
    remark: order.remark,
    items: JSON.parse(JSON.stringify(order.items))
  })
  orderFormVisible.value = true
}

// 添加商品
const addItem = () => {
  orderForm.items.push({
    sku: '',
    name: '',
    quantity: 1,
    price: 0,
    amount: 0
  })
}

// 删除商品
const removeItem = (index: number) => {
  orderForm.items.splice(index, 1)
  updateTotal()
}

// 更新总金额
const updateTotal = () => {
  orderForm.totalAmount = orderForm.items.reduce((total, item) => {
    const itemAmount = (item.quantity || 0) * (item.price || 0)
    item.amount = itemAmount
    return total + itemAmount
  }, 0)
}

// 保存订单
const saveOrder = () => {
  if (!orderForm.orderNo || !orderForm.supplierId || orderForm.items.length === 0) {
    ElMessage.error('请填写必填项并添加商品')
    return
  }
  
  if (isEdit.value) {
    // 编辑订单
    const index = orders.value.findIndex(item => item.id === orderForm.id)
    if (index !== -1) {
      orders.value[index] = {
        ...orders.value[index],
        orderNo: orderForm.orderNo,
        supplierId: orderForm.supplierId,
        supplierName: supplierMap[orderForm.supplierId],
        totalAmount: orderForm.totalAmount,
        remark: orderForm.remark,
        items: orderForm.items
      }
      ElMessage.success('订单编辑成功')
    }
  } else {
    // 新增订单
    const newOrder = {
      id: Date.now().toString(),
      orderNo: orderForm.orderNo,
      supplierId: orderForm.supplierId,
      supplierName: supplierMap[orderForm.supplierId],
      totalAmount: orderForm.totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      remark: orderForm.remark,
      items: orderForm.items
    }
    orders.value.unshift(newOrder)
    ElMessage.success('订单新增成功')
  }
  
  orderFormVisible.value = false
}

// 批量审批
const batchApprove = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请选择要审批的订单')
    return
  }
  
  selectedOrders.value.forEach(order => {
    const index = orders.value.findIndex(item => item.id === order.id)
    if (index !== -1) {
      orders.value[index].status = 'approved'
    }
  })
  
  ElMessage.success(`已成功审批 ${selectedOrders.value.length} 个订单`)
  selectedOrders.value = []
}

// 批量取消
const batchCancel = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请选择要取消的订单')
    return
  }
  
  selectedOrders.value.forEach(order => {
    const index = orders.value.findIndex(item => item.id === order.id)
    if (index !== -1) {
      orders.value[index].status = 'cancelled'
    }
  })
  
  ElMessage.success(`已成功取消 ${selectedOrders.value.length} 个订单`)
  selectedOrders.value = []
}

// 批量删除
const batchDelete = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请选择要删除的订单')
    return
  }
  
  const selectedIds = selectedOrders.value.map(item => item.id)
  orders.value = orders.value.filter(item => !selectedIds.includes(item.id))
  
  ElMessage.success(`已成功删除 ${selectedOrders.value.length} 个订单`)
  selectedOrders.value = []
}

// 批量导出
const batchExport = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请选择要导出的订单')
    return
  }
  
  // 模拟导出功能
  ElMessage.success(`已成功导出 ${selectedOrders.value.length} 个订单数据`)
}

// 查看订单
const viewOrder = (order: any) => {
  currentOrder.value = order
  orderDetailVisible.value = true
}

// 处理状态
const handleStatus = (order: any) => {
  const index = orders.value.findIndex(item => item.id === order.id)
  if (index !== -1) {
    if (orders.value[index].status === 'pending') {
      orders.value[index].status = 'approved'
      ElMessage.success('订单审批成功')
    } else if (orders.value[index].status === 'approved') {
      orders.value[index].status = 'cancelled'
      ElMessage.success('订单取消成功')
    }
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'approved': return 'success'
    case 'cancelled': return 'danger'
    case 'completed': return 'info'
    default: return 'default'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '待审批'
    case 'approved': return '已审批'
    case 'cancelled': return '已取消'
    case 'completed': return '已完成'
    default: return '未知'
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (current: number) => {
  currentPage.value = current
}
</script>

<style scoped>
.purchase-order {
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

.order-detail {
  width: 100%;
}
</style>