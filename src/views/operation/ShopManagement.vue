<template>
  <div class="shop-management">
    <h2 class="page-title">店铺管理</h2>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="small" @click="addShop">
        <el-icon><Plus /></el-icon> 新增店铺
      </el-button>
      <el-button type="success" size="small" @click="batchAuthorize">
        <el-icon><Check /></el-icon> 批量授权
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
        <el-form-item label="店铺名称">
          <el-input v-model="searchForm.name" placeholder="请输入店铺名称" size="small" />
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="searchForm.platform" placeholder="请选择平台" size="small">
            <el-option label="Amazon" value="Amazon" />
            <el-option label="Temu" value="Temu" />
            <el-option label="AliExpress" value="AliExpress" />
            <el-option label="Shopee" value="Shopee" />
            <el-option label="Lazada" value="Lazada" />
            <el-option label="TikTok Shop" value="TikTok" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" size="small">
            <el-option label="已授权" value="authorized" />
            <el-option label="未授权" value="unauthorized" />
            <el-option label="已禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item label="授权到期">
          <el-date-picker
            v-model="searchForm.expiryRange"
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
    
    <!-- 店铺列表 -->
    <el-card class="list-card">
      <el-table
        :data="shops"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="店铺ID" width="120" />
        <el-table-column prop="name" label="店铺名称" />
        <el-table-column prop="platform" label="平台" width="120" />
        <el-table-column prop="site" label="站点" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="authorizeDate" label="授权时间" width="180" />
        <el-table-column prop="expiryDate" label="到期时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewShop(scope.row)">
              查看
            </el-button>
            <el-button size="small" @click="editShop(scope.row)">
              编辑
            </el-button>
            <el-button :type="scope.row.status === 'authorized' ? 'warning' : 'success'" size="small" @click="toggleStatus(scope.row)">
              {{ scope.row.status === 'authorized' ? '禁用' : '启用' }}
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
    
    <!-- 店铺详情弹窗 -->
    <el-dialog
      title="店铺详情"
      v-model="shopDetailVisible"
      width="80%"
    >
      <div v-if="currentShop" class="shop-detail">
        <el-descriptions :column="2">
          <el-descriptions-item label="店铺ID">{{ currentShop.id }}</el-descriptions-item>
          <el-descriptions-item label="店铺名称">{{ currentShop.name }}</el-descriptions-item>
          <el-descriptions-item label="平台">{{ currentShop.platform }}</el-descriptions-item>
          <el-descriptions-item label="站点">{{ currentShop.site }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ getStatusText(currentShop.status) }}</el-descriptions-item>
          <el-descriptions-item label="授权时间">{{ currentShop.authorizeDate }}</el-descriptions-item>
          <el-descriptions-item label="到期时间">{{ currentShop.expiryDate }}</el-descriptions-item>
          <el-descriptions-item label="店铺URL">{{ currentShop.url }}</el-descriptions-item>
          <el-descriptions-item label="联系人" :span="2">{{ currentShop.contact }}</el-descriptions-item>
          <el-descriptions-item label="联系邮箱" :span="2">{{ currentShop.email }}</el-descriptions-item>
          <el-descriptions-item label="联系电话" :span="2">{{ currentShop.phone }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentShop.remark }}</el-descriptions-item>
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
  platform: '',
  status: '',
  expiryRange: []
})

// 店铺列表数据
const shops = ref([
  {
    id: '1',
    name: 'Amazon US Store',
    platform: 'Amazon',
    site: 'US',
    status: 'authorized',
    authorizeDate: '2026-01-01 10:00:00',
    expiryDate: '2026-12-31 23:59:59',
    url: 'https://www.amazon.com/shop/example',
    contact: 'John Doe',
    email: 'john@example.com',
    phone: '+1 123 456 7890',
    remark: 'Main US store'
  },
  {
    id: '2',
    name: 'Temu Global',
    platform: 'Temu',
    site: 'Global',
    status: 'authorized',
    authorizeDate: '2026-02-01 10:00:00',
    expiryDate: '2026-11-30 23:59:59',
    url: 'https://www.temu.com/store/example',
    contact: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 987 654 3210',
    remark: 'Temu global store'
  },
  {
    id: '3',
    name: 'AliExpress Store',
    platform: 'AliExpress',
    site: 'Global',
    status: 'unauthorized',
    authorizeDate: '',
    expiryDate: '',
    url: 'https://www.aliexpress.com/store/example',
    contact: 'Tom Wang',
    email: 'tom@example.com',
    phone: '+86 138 0013 8000',
    remark: 'AliExpress store'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)

// 选中的店铺
const selectedShops = ref<any[]>([])

// 店铺详情
const shopDetailVisible = ref(false)
const currentShop = ref<any>(null)

// 搜索
const search = () => {
  // 实现搜索逻辑
  console.log('搜索条件:', searchForm)
}

// 重置
const reset = () => {
  Object.assign(searchForm, {
    name: '',
    platform: '',
    status: '',
    expiryRange: []
  })
}

// 处理选择变化
const handleSelectionChange = (val: any[]) => {
  selectedShops.value = val
}

// 新增店铺
const addShop = () => {
  console.log('新增店铺')
}

// 批量授权
const batchAuthorize = () => {
  if (selectedShops.value.length === 0) {
    alert('请选择要授权的店铺')
    return
  }
  console.log('批量授权:', selectedShops.value)
}

// 批量禁用
const batchDisable = () => {
  if (selectedShops.value.length === 0) {
    alert('请选择要禁用的店铺')
    return
  }
  console.log('批量禁用:', selectedShops.value)
}

// 批量删除
const batchDelete = () => {
  if (selectedShops.value.length === 0) {
    alert('请选择要删除的店铺')
    return
  }
  console.log('批量删除:', selectedShops.value)
}

// 批量导出
const batchExport = () => {
  if (selectedShops.value.length === 0) {
    alert('请选择要导出的店铺')
    return
  }
  console.log('批量导出:', selectedShops.value)
}

// 查看店铺
const viewShop = (shop: any) => {
  currentShop.value = shop
  shopDetailVisible.value = true
}

// 编辑店铺
const editShop = (shop: any) => {
  console.log('编辑店铺:', shop)
}

// 切换状态
const toggleStatus = (shop: any) => {
  shop.status = shop.status === 'authorized' ? 'disabled' : 'authorized'
}

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'authorized': return 'success'
    case 'unauthorized': return 'warning'
    case 'disabled': return 'info'
    default: return 'default'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'authorized': return '已授权'
    case 'unauthorized': return '未授权'
    case 'disabled': return '已禁用'
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
.shop-management {
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

.shop-detail {
  width: 100%;
}
</style>