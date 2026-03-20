<template>
  <div class="inventory-management">
    <h2 class="page-title">库存管理</h2>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="small" @click="addInventory">
        <el-icon><Plus /></el-icon> 新增库存
      </el-button>
      <el-button type="success" size="small" @click="batchAdjust">
        <el-icon><Edit /></el-icon> 批量调整
      </el-button>
      <el-button type="warning" size="small" @click="batchLock">
        <el-icon><Lock /></el-icon> 批量锁定
      </el-button>
      <el-button type="danger" size="small" @click="batchUnlock">
        <el-icon><Unlock /></el-icon> 批量解锁
      </el-button>
      <el-button type="info" size="small" @click="batchExport">
        <el-icon><Download /></el-icon> 批量导出
      </el-button>
    </div>
    
    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="商品编码">
          <el-input v-model="searchForm.sku" placeholder="请输入商品编码" size="small" />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称" size="small" />
        </el-form-item>
        <el-form-item label="仓库">
          <el-select v-model="searchForm.warehouseId" placeholder="请选择仓库" size="small">
            <el-option label="国内主仓" value="1" />
            <el-option label="美国海外仓" value="2" />
            <el-option label="保税仓" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="库存状态">
          <el-select v-model="searchForm.status" placeholder="请选择库存状态" size="small">
            <el-option label="正常" value="normal" />
            <el-option label="预警" value="warning" />
            <el-option label="缺货" value="out_of_stock" />
          </el-select>
        </el-form-item>
        <el-form-item label="库存范围">
          <el-input-number v-model="searchForm.minStock" placeholder="最小库存" size="small" style="width: 100px" />
          <span style="margin: 0 8px">至</span>
          <el-input-number v-model="searchForm.maxStock" placeholder="最大库存" size="small" style="width: 100px" />
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
    
    <!-- 库存列表 -->
    <el-card class="list-card">
      <el-table
        :data="inventoryList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="库存ID" width="120" />
        <el-table-column prop="sku" label="商品编码" width="150" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="warehouseName" label="仓库" width="120" />
        <el-table-column prop="quantity" label="总库存" width="100" />
        <el-table-column prop="reserved" label="已预留" width="100" />
        <el-table-column prop="available" label="可用库存" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewInventory(scope.row)">
              查看
            </el-button>
            <el-button size="small" @click="editInventory(scope.row)">
              编辑
            </el-button>
            <el-button :type="scope.row.reserved > 0 ? 'danger' : 'success'" size="small" @click="toggleLock(scope.row)">
              {{ scope.row.reserved > 0 ? '解锁' : '锁定' }}
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
    
    <!-- 库存详情弹窗 -->
    <el-dialog
      title="库存详情"
      v-model="inventoryDetailVisible"
      width="80%"
    >
      <div v-if="currentInventory" class="inventory-detail">
        <el-descriptions :column="2">
          <el-descriptions-item label="库存ID">{{ currentInventory.id }}</el-descriptions-item>
          <el-descriptions-item label="商品编码">{{ currentInventory.sku }}</el-descriptions-item>
          <el-descriptions-item label="商品名称">{{ currentInventory.name }}</el-descriptions-item>
          <el-descriptions-item label="仓库">{{ currentInventory.warehouseName }}</el-descriptions-item>
          <el-descriptions-item label="总库存">{{ currentInventory.quantity }}</el-descriptions-item>
          <el-descriptions-item label="已预留">{{ currentInventory.reserved }}</el-descriptions-item>
          <el-descriptions-item label="可用库存">{{ currentInventory.available }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ getStatusText(currentInventory.status) }}</el-descriptions-item>
          <el-descriptions-item label="最后更新">{{ currentInventory.updatedAt }}</el-descriptions-item>
          <el-descriptions-item label="商品描述" :span="2">{{ currentInventory.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
    
    <!-- 新增/编辑库存弹窗 -->
    <el-dialog
      :title="editingInventory ? '编辑库存' : '新增库存'"
      v-model="inventoryFormVisible"
      width="600px"
    >
      <el-form :model="inventoryForm" :rules="inventoryRules" ref="inventoryFormRef" label-width="100px">
        <el-form-item label="商品编码" prop="sku">
          <el-input v-model="inventoryForm.sku" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="inventoryForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="仓库" prop="warehouseId">
          <el-select v-model="inventoryForm.warehouseId" placeholder="请选择仓库">
            <el-option label="国内主仓" value="1" />
            <el-option label="美国海外仓" value="2" />
            <el-option label="保税仓" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="总库存" prop="quantity">
          <el-input-number v-model="inventoryForm.quantity" placeholder="请输入总库存" :min="0" />
        </el-form-item>
        <el-form-item label="已预留" prop="reserved">
          <el-input-number v-model="inventoryForm.reserved" placeholder="请输入已预留库存" :min="0" />
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input type="textarea" v-model="inventoryForm.description" placeholder="请输入商品描述" rows="3" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveInventory">保存</el-button>
          <el-button @click="inventoryFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
    <!-- 批量调整弹窗 -->
    <el-dialog
      title="批量调整库存"
      v-model="batchAdjustVisible"
      width="600px"
    >
      <el-form :model="batchAdjustForm" :rules="batchAdjustRules" ref="batchAdjustFormRef" label-width="100px">
        <el-form-item label="调整类型" prop="adjustType">
          <el-radio-group v-model="batchAdjustForm.adjustType">
            <el-radio label="增加">增加</el-radio>
            <el-radio label="减少">减少</el-radio>
            <el-radio label="设置">设置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调整数量" prop="adjustValue">
          <el-input-number v-model="batchAdjustForm.adjustValue" placeholder="请输入调整数量" :min="0" />
        </el-form-item>
        <el-form-item label="调整原因" prop="reason">
          <el-input type="textarea" v-model="batchAdjustForm.reason" placeholder="请输入调整原因" rows="3" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmBatchAdjust">确认调整</el-button>
          <el-button @click="batchAdjustVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Edit, Lock, Unlock, Download } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  sku: '',
  name: '',
  warehouseId: '',
  status: '',
  minStock: undefined,
  maxStock: undefined
})

// 库存列表数据
const inventoryList = ref([
  {
    id: '1',
    sku: 'SKU001',
    name: 'Smartphone',
    warehouseId: '1',
    warehouseName: '国内主仓',
    quantity: 100,
    reserved: 20,
    available: 80,
    status: 'normal',
    updatedAt: '2026-03-20 10:00:00',
    description: '智能手机'
  },
  {
    id: '2',
    sku: 'SKU002',
    name: 'Laptop',
    warehouseId: '1',
    warehouseName: '国内主仓',
    quantity: 50,
    reserved: 10,
    available: 40,
    status: 'normal',
    updatedAt: '2026-03-20 11:00:00',
    description: '笔记本电脑'
  },
  {
    id: '3',
    sku: 'SKU001',
    name: 'Smartphone',
    warehouseId: '2',
    warehouseName: '美国海外仓',
    quantity: 200,
    reserved: 50,
    available: 150,
    status: 'normal',
    updatedAt: '2026-03-20 12:00:00',
    description: '智能手机'
  },
  {
    id: '4',
    sku: 'SKU003',
    name: 'Tablet',
    warehouseId: '3',
    warehouseName: '保税仓',
    quantity: 5,
    reserved: 0,
    available: 5,
    status: 'warning',
    updatedAt: '2026-03-20 13:00:00',
    description: '平板电脑'
  },
  {
    id: '5',
    sku: 'SKU004',
    name: 'Smartwatch',
    warehouseId: '1',
    warehouseName: '国内主仓',
    quantity: 0,
    reserved: 0,
    available: 0,
    status: 'out_of_stock',
    updatedAt: '2026-03-20 14:00:00',
    description: '智能手表'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 选中的库存
const selectedInventory = ref<any[]>([])

// 库存详情
const inventoryDetailVisible = ref(false)
const currentInventory = ref<any>(null)

// 新增/编辑库存
const inventoryFormVisible = ref(false)
const editingInventory = ref<any>(null)
const inventoryFormRef = ref()
const inventoryForm = reactive({
  sku: '',
  name: '',
  warehouseId: '',
  quantity: 0,
  reserved: 0,
  description: ''
})

const inventoryRules = {
  sku: [{ required: true, message: '请输入商品编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入总库存', trigger: 'blur' }]
}

// 批量调整
const batchAdjustVisible = ref(false)
const batchAdjustFormRef = ref()
const batchAdjustForm = reactive({
  adjustType: '增加',
  adjustValue: 0,
  reason: ''
})

const batchAdjustRules = {
  adjustType: [{ required: true, message: '请选择调整类型', trigger: 'blur' }],
  adjustValue: [{ required: true, message: '请输入调整数量', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入调整原因', trigger: 'blur' }]
}

// 搜索
const search = () => {
  // 实现搜索逻辑
  console.log('搜索条件:', searchForm)
}

// 重置
const reset = () => {
  Object.assign(searchForm, {
    sku: '',
    name: '',
    warehouseId: '',
    status: '',
    minStock: undefined,
    maxStock: undefined
  })
}

// 处理选择变化
const handleSelectionChange = (val: any[]) => {
  selectedInventory.value = val
}

// 新增库存
const addInventory = () => {
  editingInventory.value = null
  Object.assign(inventoryForm, {
    sku: '',
    name: '',
    warehouseId: '',
    quantity: 0,
    reserved: 0,
    description: ''
  })
  inventoryFormVisible.value = true
}

// 批量调整
const batchAdjust = () => {
  if (selectedInventory.value.length === 0) {
    alert('请选择要调整的库存')
    return
  }
  batchAdjustVisible.value = true
}

// 批量锁定
const batchLock = () => {
  if (selectedInventory.value.length === 0) {
    alert('请选择要锁定的库存')
    return
  }
  selectedInventory.value.forEach((inventory) => {
    inventory.reserved = inventory.quantity
    inventory.available = 0
  })
  alert('批量锁定成功')
}

// 批量解锁
const batchUnlock = () => {
  if (selectedInventory.value.length === 0) {
    alert('请选择要解锁的库存')
    return
  }
  selectedInventory.value.forEach((inventory) => {
    inventory.reserved = 0
    inventory.available = inventory.quantity
  })
  alert('批量解锁成功')
}

// 批量导出
const batchExport = () => {
  if (selectedInventory.value.length === 0) {
    alert('请选择要导出的库存')
    return
  }
  // 模拟导出功能
  const dataStr = JSON.stringify(selectedInventory.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `inventory_${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
  alert('批量导出成功')
}

// 查看库存
const viewInventory = (inventory: any) => {
  currentInventory.value = inventory
  inventoryDetailVisible.value = true
}

// 编辑库存
const editInventory = (inventory: any) => {
  editingInventory.value = inventory
  Object.assign(inventoryForm, {
    sku: inventory.sku,
    name: inventory.name,
    warehouseId: inventory.warehouseId,
    quantity: inventory.quantity,
    reserved: inventory.reserved,
    description: inventory.description
  })
  inventoryFormVisible.value = true
}

// 保存库存
const saveInventory = async () => {
  if (!inventoryFormRef.value) return
  
  try {
    await inventoryFormRef.value.validate()
    if (editingInventory.value) {
      // 编辑
      const index = inventoryList.value.findIndex((item) => item.id === editingInventory.value.id)
      if (index > -1) {
        inventoryList.value[index] = {
          ...inventoryList.value[index],
          ...inventoryForm,
          available: inventoryForm.quantity - inventoryForm.reserved,
          updatedAt: new Date().toLocaleString()
        }
        alert('库存编辑成功')
      }
    } else {
      // 新增
      inventoryList.value.push({
        id: (inventoryList.value.length + 1).toString(),
        ...inventoryForm,
        warehouseName: inventoryForm.warehouseId === '1' ? '国内主仓' : inventoryForm.warehouseId === '2' ? '美国海外仓' : '保税仓',
        available: inventoryForm.quantity - inventoryForm.reserved,
        status: inventoryForm.quantity > 10 ? 'normal' : inventoryForm.quantity > 0 ? 'warning' : 'out_of_stock',
        updatedAt: new Date().toLocaleString()
      })
      alert('库存新增成功')
    }
    inventoryFormVisible.value = false
  } catch (error) {
    console.error('验证失败:', error)
  }
}

// 确认批量调整
const confirmBatchAdjust = async () => {
  if (!batchAdjustFormRef.value) return
  
  try {
    await batchAdjustFormRef.value.validate()
    selectedInventory.value.forEach((inventory) => {
      if (batchAdjustForm.adjustType === '增加') {
        inventory.quantity += batchAdjustForm.adjustValue
      } else if (batchAdjustForm.adjustType === '减少') {
        inventory.quantity = Math.max(0, inventory.quantity - batchAdjustForm.adjustValue)
      } else if (batchAdjustForm.adjustType === '设置') {
        inventory.quantity = batchAdjustForm.adjustValue
      }
      inventory.available = inventory.quantity - inventory.reserved
      inventory.status = inventory.quantity > 10 ? 'normal' : inventory.quantity > 0 ? 'warning' : 'out_of_stock'
      inventory.updatedAt = new Date().toLocaleString()
    })
    batchAdjustVisible.value = false
    alert('批量调整成功')
  } catch (error) {
    console.error('验证失败:', error)
  }
}

// 切换锁定状态
const toggleLock = (inventory: any) => {
  if (inventory.reserved > 0) {
    inventory.reserved = 0
    inventory.available = inventory.quantity
  } else {
    inventory.reserved = inventory.quantity
    inventory.available = 0
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'normal': return 'success'
    case 'warning': return 'warning'
    case 'out_of_stock': return 'danger'
    default: return 'default'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'normal': return '正常'
    case 'warning': return '预警'
    case 'out_of_stock': return '缺货'
    default: return '未知'
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
.inventory-management {
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

.inventory-detail {
  width: 100%;
}
</style>