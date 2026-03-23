<template>
  <div class="warehouse-list">
    <h2 class="page-title">仓库管理</h2>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="small" @click="addWarehouse">
        <el-icon><Plus /></el-icon> 新增仓库
      </el-button>
      <el-button type="success" size="small" @click="batchEnable">
        <el-icon><Check /></el-icon> 批量启用
      </el-button>
      <el-button type="warning" size="small" @click="batchDisable">
        <el-icon><Close /></el-icon> 批量禁用
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
        <el-form-item label="仓库名称">
          <el-input v-model="searchForm.name" placeholder="请输入仓库名称" size="small" />
        </el-form-item>
        <el-form-item label="仓库类型">
          <el-select v-model="searchForm.type" placeholder="请选择仓库类型" size="small">
            <el-option label="国内仓" value="domestic" />
            <el-option label="保税仓" value="bonded" />
            <el-option label="海外仓" value="overseas" />
            <el-option label="中转仓" value="transit" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" size="small">
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
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
    
    <!-- 仓库列表 -->
    <el-card class="list-card">
      <el-table
        :data="filteredWarehouses"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="仓库ID" width="120" />
        <el-table-column prop="name" label="仓库名称" />
        <el-table-column prop="type" label="仓库类型" width="120">
          <template #default="scope">
            {{ getTypeText(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" width="150" />
        <el-table-column prop="contact" label="联系人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewWarehouse(scope.row)">
              查看
            </el-button>
            <el-button size="small" @click="editWarehouse(scope.row)">
              编辑
            </el-button>
            <el-button :type="scope.row.status === 'active' ? 'warning' : 'success'" size="small" @click="toggleStatus(scope.row)">
              {{ scope.row.status === 'active' ? '禁用' : '启用' }}
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
          :total="filteredWarehouses.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 仓库详情弹窗 -->
    <el-dialog
      title="仓库详情"
      v-model="warehouseDetailVisible"
      width="80%"
    >
      <div v-if="currentWarehouse" class="warehouse-detail">
        <el-descriptions :column="2">
          <el-descriptions-item label="仓库ID">{{ currentWarehouse.id }}</el-descriptions-item>
          <el-descriptions-item label="仓库名称">{{ currentWarehouse.name }}</el-descriptions-item>
          <el-descriptions-item label="仓库类型">{{ getTypeText(currentWarehouse.type) }}</el-descriptions-item>
          <el-descriptions-item label="位置">{{ currentWarehouse.location }}</el-descriptions-item>
          <el-descriptions-item label="联系人">{{ currentWarehouse.contact }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentWarehouse.phone }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ currentWarehouse.status === 'active' ? '启用' : '禁用' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentWarehouse.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ currentWarehouse.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
    
    <!-- 新增/编辑仓库弹窗 -->
    <el-dialog
      :title="isEdit ? '编辑仓库' : '新增仓库'"
      v-model="warehouseFormVisible"
      width="60%"
    >
      <el-form :model="warehouseForm" label-width="120px">
        <el-form-item label="仓库名称" :required="true">
          <el-input v-model="warehouseForm.name" placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="仓库类型" :required="true">
          <el-select v-model="warehouseForm.type" placeholder="请选择仓库类型">
            <el-option label="国内仓" value="domestic" />
            <el-option label="保税仓" value="bonded" />
            <el-option label="海外仓" value="overseas" />
            <el-option label="中转仓" value="transit" />
          </el-select>
        </el-form-item>
        <el-form-item label="位置" :required="true">
          <el-input v-model="warehouseForm.location" placeholder="请输入仓库位置" />
        </el-form-item>
        <el-form-item label="联系人" :required="true">
          <el-input v-model="warehouseForm.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" :required="true">
          <el-input v-model="warehouseForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="warehouseForm.status">
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="warehouseForm.description" placeholder="请输入仓库描述" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="warehouseFormVisible = false">取消</el-button>
          <el-button type="primary" @click="saveWarehouse">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Search, Plus, Check, Close, Delete, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
  status: '',
  dateRange: []
})

// 仓库列表数据
const warehouses = ref([
  {
    id: '1',
    name: '国内主仓',
    type: 'domestic',
    location: '深圳市宝安区',
    contact: '张三',
    phone: '13800138000',
    status: 'active',
    createdAt: '2026-01-01 10:00:00',
    description: '国内主要仓储中心'
  },
  {
    id: '2',
    name: '美国海外仓',
    type: 'overseas',
    location: '美国加利福尼亚',
    contact: 'John Smith',
    phone: '+1 123 456 7890',
    status: 'active',
    createdAt: '2026-02-01 10:00:00',
    description: '美国海外仓储中心'
  },
  {
    id: '3',
    name: '保税仓',
    type: 'bonded',
    location: '广州市南沙区',
    contact: '李四',
    phone: '13900139000',
    status: 'inactive',
    createdAt: '2026-03-01 10:00:00',
    description: '保税仓储中心'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 选中的仓库
const selectedWarehouses = ref<any[]>([])

// 仓库详情
const warehouseDetailVisible = ref(false)
const currentWarehouse = ref<any>(null)

// 新增/编辑仓库
const warehouseFormVisible = ref(false)
const isEdit = ref(false)
const warehouseForm = reactive({
  id: '',
  name: '',
  type: 'domestic',
  location: '',
  contact: '',
  phone: '',
  status: 'active',
  description: ''
})

// 过滤后的仓库列表
const filteredWarehouses = computed(() => {
  let result = [...warehouses.value]
  
  // 根据搜索条件过滤
  if (searchForm.name) {
    result = result.filter(item => item.name.includes(searchForm.name))
  }
  if (searchForm.type) {
    result = result.filter(item => item.type === searchForm.type)
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
    name: '',
    type: '',
    status: '',
    dateRange: []
  })
  currentPage.value = 1
  ElMessage.info('已重置搜索条件')
}

// 处理选择变化
const handleSelectionChange = (val: any[]) => {
  selectedWarehouses.value = val
}

// 新增仓库
const addWarehouse = () => {
  isEdit.value = false
  Object.assign(warehouseForm, {
    id: '',
    name: '',
    type: 'domestic',
    location: '',
    contact: '',
    phone: '',
    status: 'active',
    description: ''
  })
  warehouseFormVisible.value = true
}

// 编辑仓库
const editWarehouse = (warehouse: any) => {
  isEdit.value = true
  Object.assign(warehouseForm, {
    id: warehouse.id,
    name: warehouse.name,
    type: warehouse.type,
    location: warehouse.location,
    contact: warehouse.contact,
    phone: warehouse.phone,
    status: warehouse.status,
    description: warehouse.description
  })
  warehouseFormVisible.value = true
}

// 保存仓库
const saveWarehouse = () => {
  if (!warehouseForm.name || !warehouseForm.type || !warehouseForm.location || !warehouseForm.contact || !warehouseForm.phone) {
    ElMessage.error('请填写必填项')
    return
  }
  
  if (isEdit.value) {
    // 编辑仓库
    const index = warehouses.value.findIndex(item => item.id === warehouseForm.id)
    if (index !== -1) {
      warehouses.value[index] = {
        ...warehouses.value[index],
        ...warehouseForm
      }
      ElMessage.success('仓库编辑成功')
    }
  } else {
    // 新增仓库
    const newWarehouse = {
      ...warehouseForm,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    warehouses.value.unshift(newWarehouse)
    ElMessage.success('仓库新增成功')
  }
  
  warehouseFormVisible.value = false
}

// 批量启用
const batchEnable = () => {
  if (selectedWarehouses.value.length === 0) {
    ElMessage.warning('请选择要启用的仓库')
    return
  }
  
  selectedWarehouses.value.forEach(warehouse => {
    const index = warehouses.value.findIndex(item => item.id === warehouse.id)
    if (index !== -1) {
      warehouses.value[index].status = 'active'
    }
  })
  
  ElMessage.success(`已成功启用 ${selectedWarehouses.value.length} 个仓库`)
  selectedWarehouses.value = []
}

// 批量禁用
const batchDisable = () => {
  if (selectedWarehouses.value.length === 0) {
    ElMessage.warning('请选择要禁用的仓库')
    return
  }
  
  selectedWarehouses.value.forEach(warehouse => {
    const index = warehouses.value.findIndex(item => item.id === warehouse.id)
    if (index !== -1) {
      warehouses.value[index].status = 'inactive'
    }
  })
  
  ElMessage.success(`已成功禁用 ${selectedWarehouses.value.length} 个仓库`)
  selectedWarehouses.value = []
}

// 批量删除
const batchDelete = () => {
  if (selectedWarehouses.value.length === 0) {
    ElMessage.warning('请选择要删除的仓库')
    return
  }
  
  const selectedIds = selectedWarehouses.value.map(item => item.id)
  warehouses.value = warehouses.value.filter(item => !selectedIds.includes(item.id))
  
  ElMessage.success(`已成功删除 ${selectedWarehouses.value.length} 个仓库`)
  selectedWarehouses.value = []
}

// 批量导出
const batchExport = () => {
  if (selectedWarehouses.value.length === 0) {
    ElMessage.warning('请选择要导出的仓库')
    return
  }
  
  // 模拟导出功能
  ElMessage.success(`已成功导出 ${selectedWarehouses.value.length} 个仓库数据`)
}

// 查看仓库
const viewWarehouse = (warehouse: any) => {
  currentWarehouse.value = warehouse
  warehouseDetailVisible.value = true
}

// 切换状态
const toggleStatus = (warehouse: any) => {
  const index = warehouses.value.findIndex(item => item.id === warehouse.id)
  if (index !== -1) {
    const newStatus = warehouses.value[index].status === 'active' ? 'inactive' : 'active'
    warehouses.value[index].status = newStatus
    ElMessage.success(`仓库已${newStatus === 'active' ? '启用' : '禁用'}`)
  }
}

// 获取仓库类型文本
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    domestic: '国内仓',
    bonded: '保税仓',
    overseas: '海外仓',
    transit: '中转仓'
  }
  return typeMap[type] || type
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
.warehouse-list {
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

.warehouse-detail {
  width: 100%;
}
</style>