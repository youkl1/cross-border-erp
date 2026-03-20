<template>
  <div class="supplier-management">
    <h2 class="page-title">供应商管理</h2>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="small" @click="addSupplier">
        <el-icon><Plus /></el-icon> 新增供应商
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
        <el-form-item label="供应商名称">
          <el-input v-model="searchForm.name" placeholder="请输入供应商名称" size="small" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="searchForm.contact" placeholder="请输入联系人" size="small" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" size="small">
            <el-option label="全部状态" value="" />
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
    
    <!-- 供应商列表 -->
    <el-card class="list-card">
      <el-table
        :data="suppliers"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="供应商ID" width="120" />
        <el-table-column prop="name" label="供应商名称" />
        <el-table-column prop="contact" label="联系人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="150" />
        <el-table-column prop="email" label="邮箱" width="180" />
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
            <el-button type="primary" size="small" @click="viewSupplier(scope.row)">
              查看
            </el-button>
            <el-button size="small" @click="editSupplier(scope.row)">
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
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 供应商详情弹窗 -->
    <el-dialog
      title="供应商详情"
      v-model="supplierDetailVisible"
      width="80%"
    >
      <div v-if="currentSupplier" class="supplier-detail">
        <el-descriptions :column="2">
          <el-descriptions-item label="供应商ID">{{ currentSupplier.id }}</el-descriptions-item>
          <el-descriptions-item label="供应商名称">{{ currentSupplier.name }}</el-descriptions-item>
          <el-descriptions-item label="联系人">{{ currentSupplier.contact }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentSupplier.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentSupplier.email }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ currentSupplier.status === 'active' ? '启用' : '禁用' }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ currentSupplier.address }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentSupplier.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentSupplier.remark }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Check, Close, Delete, Download } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  name: '',
  contact: '',
  status: '',
  dateRange: []
})

// 供应商列表数据
const suppliers = ref([
  {
    id: '1',
    name: '供应商A',
    contact: '张三',
    phone: '13800138000',
    email: 'supplierA@example.com',
    status: 'active',
    address: '深圳市宝安区',
    createdAt: '2026-01-01 10:00:00',
    remark: '主要供应商'
  },
  {
    id: '2',
    name: '供应商B',
    contact: '李四',
    phone: '13900139000',
    email: 'supplierB@example.com',
    status: 'active',
    address: '广州市天河区',
    createdAt: '2026-01-02 10:00:00',
    remark: '备用供应商'
  },
  {
    id: '3',
    name: '供应商C',
    contact: '王五',
    phone: '13700137000',
    email: 'supplierC@example.com',
    status: 'inactive',
    address: '上海市浦东新区',
    createdAt: '2026-01-03 10:00:00',
    remark: '已暂停合作'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)

// 选中的供应商
const selectedSuppliers = ref<any[]>([])

// 供应商详情
const supplierDetailVisible = ref(false)
const currentSupplier = ref<any>(null)

// 搜索
const search = () => {
  // 实现搜索逻辑
  console.log('搜索条件:', searchForm)
}

// 重置
const reset = () => {
  Object.assign(searchForm, {
    name: '',
    contact: '',
    status: '',
    dateRange: []
  })
}

// 处理选择变化
const handleSelectionChange = (val: any[]) => {
  selectedSuppliers.value = val
}

// 新增供应商
const addSupplier = () => {
  console.log('新增供应商')
}

// 批量启用
const batchEnable = () => {
  if (selectedSuppliers.value.length === 0) {
    alert('请选择要启用的供应商')
    return
  }
  console.log('批量启用:', selectedSuppliers.value)
}

// 批量禁用
const batchDisable = () => {
  if (selectedSuppliers.value.length === 0) {
    alert('请选择要禁用的供应商')
    return
  }
  console.log('批量禁用:', selectedSuppliers.value)
}

// 批量删除
const batchDelete = () => {
  if (selectedSuppliers.value.length === 0) {
    alert('请选择要删除的供应商')
    return
  }
  console.log('批量删除:', selectedSuppliers.value)
}

// 批量导出
const batchExport = () => {
  if (selectedSuppliers.value.length === 0) {
    alert('请选择要导出的供应商')
    return
  }
  console.log('批量导出:', selectedSuppliers.value)
}

// 查看供应商
const viewSupplier = (supplier: any) => {
  currentSupplier.value = supplier
  supplierDetailVisible.value = true
}

// 编辑供应商
const editSupplier = (supplier: any) => {
  console.log('编辑供应商:', supplier)
}

// 切换状态
const toggleStatus = (supplier: any) => {
  supplier.status = supplier.status === 'active' ? 'inactive' : 'active'
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
.supplier-management {
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

.supplier-detail {
  width: 100%;
}
</style>