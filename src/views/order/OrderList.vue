<template>
  <div class="order-list">
    <h2 class="page-title">订单管理</h2>
    
    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderId" placeholder="请输入订单号" size="small" />
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="searchForm.platform" placeholder="请选择平台" size="small">
            <el-option label="Amazon" value="Amazon" />
            <el-option label="AliExpress" value="AliExpress" />
            <el-option label="Shopee" value="Shopee" />
            <el-option label="Lazada" value="Lazada" />
            <el-option label="TikTok Shop" value="TikTok Shop" />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺">
          <el-select v-model="searchForm.shopId" placeholder="请选择店铺" size="small">
            <el-option label="Amazon US" value="1" />
            <el-option label="AliExpress Global" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" size="small">
            <el-option label="待审核" value="pending_review" />
            <el-option label="待备货" value="pending_fulfillment" />
            <el-option label="已发货" value="shipped" />
            <el-option label="清关中" value="customs_clearance" />
            <el-option label="运输中" value="in_transit" />
            <el-option label="已签收" value="delivered" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
            <el-option label="售后中" value="after_sales" />
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
      <el-button type="primary" size="small" @click="batchAudit">
        <el-icon><Check /></el-icon> 批量审核
      </el-button>
      <el-button type="success" size="small" @click="batchShip">
        <el-icon><Van /></el-icon> 批量发货
      </el-button>
      <el-button type="warning" size="small" @click="batchExport">
        <el-icon><Download /></el-icon> 批量导出
      </el-button>
      <el-button type="danger" size="small" @click="batchCancel">
        <el-icon><Close /></el-icon> 批量取消
      </el-button>
    </div>
    
    <!-- 订单列表 -->
    <el-card class="list-card">
      <el-table
        :data="filteredOrders"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="orderId" label="订单号" width="180" />
        <el-table-column prop="platform" label="平台" width="120" />
        <el-table-column prop="shopName" label="店铺" width="150" />
        <el-table-column prop="customerName" label="客户姓名" width="150" />
        <el-table-column prop="totalAmount" label="总金额" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.statusText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewOrder(scope.row)">
              查看
            </el-button>
            <el-button type="success" size="small" @click="auditOrder(scope.row)" v-if="scope.row.status === 'pending_review'">
              审核
            </el-button>
            <el-button size="small" @click="editOrder(scope.row)">
              编辑
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
        <el-tabs v-model="detailActiveTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions :column="2">
              <el-descriptions-item label="订单号">{{ currentOrder.orderId }}</el-descriptions-item>
              <el-descriptions-item label="平台">{{ currentOrder.platform }}</el-descriptions-item>
              <el-descriptions-item label="店铺">{{ currentOrder.shopName }}</el-descriptions-item>
              <el-descriptions-item label="订单状态">{{ currentOrder.statusText }}</el-descriptions-item>
              <el-descriptions-item label="总金额">{{ currentOrder.totalAmount }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ currentOrder.createdAt }}</el-descriptions-item>
              <el-descriptions-item label="客户姓名" :span="2">{{ currentOrder.customerName }}</el-descriptions-item>
              <el-descriptions-item label="收货地址" :span="2">{{ currentOrder.address }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="商品信息" name="products">
            <el-table :data="currentOrder.products" style="width: 100%">
              <el-table-column prop="sku" label="SKU" width="150" />
              <el-table-column prop="name" label="商品名称" />
              <el-table-column prop="quantity" label="数量" width="100" />
              <el-table-column prop="price" label="单价" width="120" />
              <el-table-column prop="subtotal" label="小计" width="120" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="物流信息" name="logistics">
            <el-descriptions :column="2">
              <el-descriptions-item label="物流方式">{{ currentOrder.logistics?.method || '-' }}</el-descriptions-item>
              <el-descriptions-item label="物流单号">{{ currentOrder.logistics?.trackingNumber || '-' }}</el-descriptions-item>
              <el-descriptions-item label="发货时间">{{ currentOrder.logistics?.shipDate || '-' }}</el-descriptions-item>
              <el-descriptions-item label="预计送达">{{ currentOrder.logistics?.estimatedDelivery || '-' }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="财务信息" name="finance">
            <el-descriptions :column="2">
              <el-descriptions-item label="商品总额">{{ currentOrder.finance?.subtotal || '-' }}</el-descriptions-item>
              <el-descriptions-item label="运费">{{ currentOrder.finance?.shippingFee || '-' }}</el-descriptions-item>
              <el-descriptions-item label="税费">{{ currentOrder.finance?.tax || '-' }}</el-descriptions-item>
              <el-descriptions-item label="平台佣金">{{ currentOrder.finance?.commission || '-' }}</el-descriptions-item>
              <el-descriptions-item label="总金额" :span="2">{{ currentOrder.totalAmount }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    
    <!-- 编辑订单弹窗 -->
    <el-dialog
      title="编辑订单"
      v-model="orderFormVisible"
      width="60%"
    >
      <el-form :model="orderForm" label-width="120px">
        <el-form-item label="订单号" :required="true">
          <el-input v-model="orderForm.orderId" placeholder="请输入订单号" disabled />
        </el-form-item>
        <el-form-item label="客户姓名" :required="true">
          <el-input v-model="orderForm.customerName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="收货地址" :required="true">
          <el-input type="textarea" v-model="orderForm.address" placeholder="请输入收货地址" rows="3" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="orderForm.status">
            <el-option label="待审核" value="pending_review" />
            <el-option label="待备货" value="pending_fulfillment" />
            <el-option label="已发货" value="shipped" />
            <el-option label="清关中" value="customs_clearance" />
            <el-option label="运输中" value="in_transit" />
            <el-option label="已签收" value="delivered" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
            <el-option label="售后中" value="after_sales" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="orderFormVisible = false">取消</el-button>
          <el-button type="primary" @click="saveOrder">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 批量发货弹窗 -->
    <el-dialog
      title="批量发货"
      v-model="batchShipVisible"
      width="50%"
    >
      <el-form :model="shipForm" label-width="100px">
        <el-form-item label="物流方式" :required="true">
          <el-select v-model="shipForm.method" placeholder="请选择物流方式">
            <el-option label="DHL" value="DHL" />
            <el-option label="FedEx" value="FedEx" />
            <el-option label="UPS" value="UPS" />
            <el-option label="USPS" value="USPS" />
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号前缀">
          <el-input v-model="shipForm.trackingPrefix" placeholder="例如：DHL" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchShipVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmBatchShip">确认发货</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Search, Check, Van, Download, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  orderId: '',
  platform: '',
  shopId: '',
  status: '',
  dateRange: []
})

// 订单列表数据
const orders = ref([
  {
    id: '1',
    orderId: 'AMZ-2026-001',
    platform: 'Amazon',
    shopName: 'Amazon US',
    customerName: 'John Doe',
    totalAmount: '$1000',
    status: 'pending_review',
    statusText: '待审核',
    createdAt: '2026-03-01 10:00:00',
    address: '123 Main St, New York, NY 10001, USA',
    products: [
      { sku: 'SKU001', name: 'Smartphone', quantity: 1, price: '$800', subtotal: '$800' },
      { sku: 'SKU002', name: 'Phone Case', quantity: 2, price: '$50', subtotal: '$100' }
    ],
    logistics: {
      method: 'DHL',
      trackingNumber: 'DHL1234567890',
      shipDate: '',
      estimatedDelivery: ''
    },
    finance: {
      subtotal: '$900',
      shippingFee: '$50',
      tax: '$50',
      commission: '$80'
    }
  },
  {
    id: '2',
    orderId: 'AMZ-2026-002',
    platform: 'Amazon',
    shopName: 'Amazon US',
    customerName: 'Jane Smith',
    totalAmount: '$1500',
    status: 'shipped',
    statusText: '已发货',
    createdAt: '2026-03-02 11:00:00',
    address: '456 Oak Ave, Los Angeles, CA 90001, USA',
    products: [
      { sku: 'SKU003', name: 'Laptop', quantity: 1, price: '$1400', subtotal: '$1400' },
      { sku: 'SKU004', name: 'Laptop Bag', quantity: 1, price: '$100', subtotal: '$100' }
    ],
    logistics: {
      method: 'FedEx',
      trackingNumber: 'FEDEX9876543210',
      shipDate: '2026-03-03 14:00:00',
      estimatedDelivery: '2026-03-07'
    },
    finance: {
      subtotal: '$1500',
      shippingFee: '$0',
      tax: '$150',
      commission: '$120'
    }
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
const detailActiveTab = ref('basic')

// 编辑订单
const orderFormVisible = ref(false)
const orderForm = reactive({
  id: '',
  orderId: '',
  customerName: '',
  address: '',
  status: ''
})

// 批量发货
const batchShipVisible = ref(false)
const shipForm = reactive({
  method: '',
  trackingPrefix: ''
})

// 状态文本映射
const statusTextMap: Record<string, string> = {
  'pending_review': '待审核',
  'pending_fulfillment': '待备货',
  'shipped': '已发货',
  'customs_clearance': '清关中',
  'in_transit': '运输中',
  'delivered': '已签收',
  'completed': '已完成',
  'cancelled': '已取消',
  'after_sales': '售后中'
}

// 过滤后的订单列表
const filteredOrders = computed(() => {
  let result = [...orders.value]
  
  // 根据搜索条件过滤
  if (searchForm.orderId) {
    result = result.filter(item => item.orderId.includes(searchForm.orderId))
  }
  if (searchForm.platform) {
    result = result.filter(item => item.platform === searchForm.platform)
  }
  if (searchForm.status) {
    result = result.filter(item => item.status === searchForm.status)
  }
  
  // 分页
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return result.slice(startIndex, endIndex)
})

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'pending_review': return 'info'
    case 'pending_fulfillment': return 'warning'
    case 'shipped': return 'primary'
    case 'customs_clearance': return 'warning'
    case 'in_transit': return 'primary'
    case 'delivered': return 'success'
    case 'completed': return 'success'
    case 'cancelled': return 'danger'
    case 'after_sales': return 'warning'
    default: return 'default'
  }
}

// 搜索
const search = () => {
  currentPage.value = 1
  ElMessage.success('搜索成功')
}

// 重置
const reset = () => {
  Object.assign(searchForm, {
    orderId: '',
    platform: '',
    shopId: '',
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

// 批量审核
const batchAudit = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请选择要审核的订单')
    return
  }
  
  selectedOrders.value.forEach(order => {
    const index = orders.value.findIndex(item => item.id === order.id)
    if (index !== -1) {
      orders.value[index].status = 'pending_fulfillment'
      orders.value[index].statusText = statusTextMap['pending_fulfillment']
    }
  })
  
  ElMessage.success(`已成功审核 ${selectedOrders.value.length} 个订单`)
  selectedOrders.value = []
}

// 批量发货
const batchShip = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请选择要发货的订单')
    return
  }
  
  batchShipVisible.value = true
}

// 确认批量发货
const confirmBatchShip = () => {
  if (!shipForm.method) {
    ElMessage.error('请选择物流方式')
    return
  }
  
  selectedOrders.value.forEach(order => {
    const index = orders.value.findIndex(item => item.id === order.id)
    if (index !== -1) {
      orders.value[index].status = 'shipped'
      orders.value[index].statusText = statusTextMap['shipped']
      orders.value[index].logistics = {
        ...orders.value[index].logistics,
        method: shipForm.method,
        trackingNumber: `${shipForm.trackingPrefix || shipForm.method}${Math.floor(Math.random() * 10000000000)}`,
        shipDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      }
    }
  })
  
  ElMessage.success(`已成功发货 ${selectedOrders.value.length} 个订单`)
  batchShipVisible.value = false
  selectedOrders.value = []
  
  // 重置发货表单
  Object.assign(shipForm, {
    method: '',
    trackingPrefix: ''
  })
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
      orders.value[index].statusText = statusTextMap['cancelled']
    }
  })
  
  ElMessage.success(`已成功取消 ${selectedOrders.value.length} 个订单`)
  selectedOrders.value = []
}

// 查看订单
const viewOrder = (order: any) => {
  currentOrder.value = order
  orderDetailVisible.value = true
}

// 审核订单
const auditOrder = (order: any) => {
  const index = orders.value.findIndex(item => item.id === order.id)
  if (index !== -1) {
    orders.value[index].status = 'pending_fulfillment'
    orders.value[index].statusText = statusTextMap['pending_fulfillment']
    ElMessage.success('订单审核成功')
  }
}

// 编辑订单
const editOrder = (order: any) => {
  Object.assign(orderForm, {
    id: order.id,
    orderId: order.orderId,
    customerName: order.customerName,
    address: order.address,
    status: order.status
  })
  orderFormVisible.value = true
}

// 保存订单
const saveOrder = () => {
  if (!orderForm.customerName || !orderForm.address) {
    ElMessage.error('请填写必填项')
    return
  }
  
  const index = orders.value.findIndex(item => item.id === orderForm.id)
  if (index !== -1) {
    orders.value[index] = {
      ...orders.value[index],
      customerName: orderForm.customerName,
      address: orderForm.address,
      status: orderForm.status,
      statusText: statusTextMap[orderForm.status]
    }
    ElMessage.success('订单编辑成功')
  }
  
  orderFormVisible.value = false
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
.order-list {
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