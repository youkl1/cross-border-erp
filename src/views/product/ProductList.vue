<template>
  <div class="product-list">
    <h2 class="page-title">商品管理</h2>
    
    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="商品编码">
          <el-input v-model="searchForm.sku" placeholder="请输入商品编码" size="small" />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称" size="small" />
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="searchForm.platform" placeholder="请选择平台" size="small">
            <el-option label="Amazon" value="Amazon" />
            <el-option label="AliExpress" value="AliExpress" />
            <el-option label="Shopee" value="Shopee" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" size="small">
            <el-option label="电子产品" value="1" />
            <el-option label="服装" value="2" />
            <el-option label="家居用品" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" size="small">
            <el-option label="上架" value="online" />
            <el-option label="下架" value="offline" />
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
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="small" @click="addProduct">
        <el-icon><Plus /></el-icon> 新增商品
      </el-button>
      <el-button type="success" size="small" @click="batchOnline">
        <el-icon><Top /></el-icon> 批量上架
      </el-button>
      <el-button type="warning" size="small" @click="batchOffline">
        <el-icon><Bottom /></el-icon> 批量下架
      </el-button>
      <el-button type="danger" size="small" @click="batchDelete">
        <el-icon><Delete /></el-icon> 批量删除
      </el-button>
      <el-button type="info" size="small" @click="batchExport">
        <el-icon><Download /></el-icon> 批量导出
      </el-button>
    </div>
    
    <!-- 商品列表 -->
    <el-card class="list-card">
      <el-table
        :data="filteredProducts"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="sku" label="商品编码" width="150" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="platform" label="平台" width="120" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'online' ? 'success' : 'info'">
              {{ scope.row.status === 'online' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewProduct(scope.row)">
              查看
            </el-button>
            <el-button size="small" @click="editProduct(scope.row)">
              编辑
            </el-button>
            <el-button :type="scope.row.status === 'online' ? 'warning' : 'success'" size="small" @click="toggleStatus(scope.row)">
              {{ scope.row.status === 'online' ? '下架' : '上架' }}
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
          :total="filteredProducts.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 商品详情弹窗 -->
    <el-dialog
      title="商品详情"
      v-model="productDetailVisible"
      width="80%"
    >
      <div v-if="currentProduct" class="product-detail">
        <el-tabs v-model="detailActiveTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions :column="2">
              <el-descriptions-item label="商品编码">{{ currentProduct.sku }}</el-descriptions-item>
              <el-descriptions-item label="商品名称">{{ currentProduct.name }}</el-descriptions-item>
              <el-descriptions-item label="平台">{{ currentProduct.platform }}</el-descriptions-item>
              <el-descriptions-item label="分类">{{ currentProduct.category }}</el-descriptions-item>
              <el-descriptions-item label="价格">{{ currentProduct.price }}</el-descriptions-item>
              <el-descriptions-item label="库存">{{ currentProduct.stock }}</el-descriptions-item>
              <el-descriptions-item label="状态">{{ currentProduct.status === 'online' ? '上架' : '下架' }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ currentProduct.createdAt }}</el-descriptions-item>
              <el-descriptions-item label="描述" :span="2">{{ currentProduct.description }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="多语言信息" name="language">
            <el-table :data="currentProduct.languageInfo" style="width: 100%">
              <el-table-column prop="language" label="语言" width="120" />
              <el-table-column prop="name" label="商品名称" />
              <el-table-column prop="description" label="描述" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="合规信息" name="compliance">
            <el-descriptions :column="2">
              <el-descriptions-item label="ASIN">{{ currentProduct.compliance?.asin || '-' }}</el-descriptions-item>
              <el-descriptions-item label="海关编码">{{ currentProduct.compliance?.hsCode || '-' }}</el-descriptions-item>
              <el-descriptions-item label="报关要素">{{ currentProduct.compliance?.customsElements || '-' }}</el-descriptions-item>
              <el-descriptions-item label="认证信息">{{ currentProduct.compliance?.certifications || '-' }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="多仓映射" name="warehouse">
            <el-table :data="currentProduct.warehouseMapping" style="width: 100%">
              <el-table-column prop="warehouse" label="仓库" width="150" />
              <el-table-column prop="sku" label="仓库SKU" width="150" />
              <el-table-column prop="stock" label="库存" width="100" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    
    <!-- 新增/编辑商品弹窗 -->
    <el-dialog
      :title="isEdit ? '编辑商品' : '新增商品'"
      v-model="productFormVisible"
      width="60%"
    >
      <el-form :model="productForm" label-width="120px">
        <el-form-item label="商品编码" :required="true">
          <el-input v-model="productForm.sku" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="商品名称" :required="true">
          <el-input v-model="productForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="平台" :required="true">
          <el-select v-model="productForm.platform" placeholder="请选择平台">
            <el-option label="Amazon" value="Amazon" />
            <el-option label="AliExpress" value="AliExpress" />
            <el-option label="Shopee" value="Shopee" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" :required="true">
          <el-select v-model="productForm.category" placeholder="请选择分类">
            <el-option label="电子产品" value="电子产品" />
            <el-option label="服装" value="服装" />
            <el-option label="家居用品" value="家居用品" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" :required="true">
          <el-input v-model="productForm.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="库存" :required="true">
          <el-input type="number" v-model="productForm.stock" placeholder="请输入库存" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="productForm.status">
            <el-option label="上架" value="online" />
            <el-option label="下架" value="offline" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="productForm.description" placeholder="请输入商品描述" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="productFormVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProduct">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Search, Plus, Top, Bottom, Delete, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  sku: '',
  name: '',
  platform: '',
  categoryId: '',
  status: '',
  dateRange: []
})

// 商品列表数据
const products = ref([
  {
    id: '1',
    sku: 'SKU001',
    name: 'Smartphone',
    platform: 'Amazon',
    category: '电子产品',
    price: '$800',
    stock: 100,
    status: 'online',
    createdAt: '2026-03-01 10:00:00',
    description: '智能手机，支持5G网络',
    languageInfo: [
      { language: 'English', name: 'Smartphone', description: 'Smartphone with 5G support' },
      { language: 'Spanish', name: 'Teléfono inteligente', description: 'Teléfono inteligente con soporte 5G' }
    ],
    compliance: {
      asin: 'B08X123456',
      hsCode: '85171200',
      customsElements: '手机，触摸屏，5G',
      certifications: 'CE, FCC'
    },
    warehouseMapping: [
      { warehouse: '国内仓', sku: 'CN-SKU001', stock: 50 },
      { warehouse: '海外仓', sku: 'US-SKU001', stock: 50 }
    ]
  },
  {
    id: '2',
    sku: 'SKU002',
    name: 'Laptop',
    platform: 'Amazon',
    category: '电子产品',
    price: '$1400',
    stock: 50,
    status: 'online',
    createdAt: '2026-03-02 11:00:00',
    description: '笔记本电脑，16GB内存，512GB SSD',
    languageInfo: [
      { language: 'English', name: 'Laptop', description: 'Laptop with 16GB RAM and 512GB SSD' },
      { language: 'Spanish', name: 'Portátil', description: 'Portátil con 16GB RAM y 512GB SSD' }
    ],
    compliance: {
      asin: 'B09Y654321',
      hsCode: '84713000',
      customsElements: '笔记本电脑，16GB内存',
      certifications: 'CE, FCC'
    },
    warehouseMapping: [
      { warehouse: '国内仓', sku: 'CN-SKU002', stock: 20 },
      { warehouse: '海外仓', sku: 'US-SKU002', stock: 30 }
    ]
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 选中的商品
const selectedProducts = ref<any[]>([])

// 商品详情
const productDetailVisible = ref(false)
const currentProduct = ref<any>(null)
const detailActiveTab = ref('basic')

// 新增/编辑商品
const productFormVisible = ref(false)
const isEdit = ref(false)
const productForm = reactive({
  id: '',
  sku: '',
  name: '',
  platform: '',
  category: '',
  price: '',
  stock: 0,
  status: 'online',
  description: ''
})

// 过滤后的商品列表
const filteredProducts = computed(() => {
  let result = [...products.value]
  
  // 根据搜索条件过滤
  if (searchForm.sku) {
    result = result.filter(item => item.sku.includes(searchForm.sku))
  }
  if (searchForm.name) {
    result = result.filter(item => item.name.includes(searchForm.name))
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

// 搜索
const search = () => {
  currentPage.value = 1
  ElMessage.success('搜索成功')
}

// 重置
const reset = () => {
  Object.assign(searchForm, {
    sku: '',
    name: '',
    platform: '',
    categoryId: '',
    status: '',
    dateRange: []
  })
  currentPage.value = 1
  ElMessage.info('已重置搜索条件')
}

// 处理选择变化
const handleSelectionChange = (val: any[]) => {
  selectedProducts.value = val
}

// 新增商品
const addProduct = () => {
  isEdit.value = false
  Object.assign(productForm, {
    id: '',
    sku: '',
    name: '',
    platform: '',
    category: '',
    price: '',
    stock: 0,
    status: 'online',
    description: ''
  })
  productFormVisible.value = true
}

// 编辑商品
const editProduct = (product: any) => {
  isEdit.value = true
  Object.assign(productForm, {
    id: product.id,
    sku: product.sku,
    name: product.name,
    platform: product.platform,
    category: product.category,
    price: product.price,
    stock: product.stock,
    status: product.status,
    description: product.description
  })
  productFormVisible.value = true
}

// 保存商品
const saveProduct = () => {
  if (!productForm.sku || !productForm.name || !productForm.platform || !productForm.category || !productForm.price || !productForm.stock) {
    ElMessage.error('请填写必填项')
    return
  }
  
  if (isEdit.value) {
    // 编辑商品
    const index = products.value.findIndex(item => item.id === productForm.id)
    if (index !== -1) {
      products.value[index] = {
        ...products.value[index],
        ...productForm
      }
      ElMessage.success('商品编辑成功')
    }
  } else {
    // 新增商品
    const newProduct = {
      ...productForm,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      languageInfo: [],
      compliance: {
        asin: '',
        hsCode: '',
        customsElements: '',
        certifications: ''
      },
      warehouseMapping: []
    }
    products.value.unshift(newProduct)
    ElMessage.success('商品新增成功')
  }
  
  productFormVisible.value = false
}

// 批量上架
const batchOnline = () => {
  if (selectedProducts.value.length === 0) {
    ElMessage.warning('请选择要上架的商品')
    return
  }
  
  selectedProducts.value.forEach(product => {
    const index = products.value.findIndex(item => item.id === product.id)
    if (index !== -1) {
      products.value[index].status = 'online'
    }
  })
  
  ElMessage.success(`已成功上架 ${selectedProducts.value.length} 个商品`)
  selectedProducts.value = []
}

// 批量下架
const batchOffline = () => {
  if (selectedProducts.value.length === 0) {
    ElMessage.warning('请选择要下架的商品')
    return
  }
  
  selectedProducts.value.forEach(product => {
    const index = products.value.findIndex(item => item.id === product.id)
    if (index !== -1) {
      products.value[index].status = 'offline'
    }
  })
  
  ElMessage.success(`已成功下架 ${selectedProducts.value.length} 个商品`)
  selectedProducts.value = []
}

// 批量删除
const batchDelete = () => {
  if (selectedProducts.value.length === 0) {
    ElMessage.warning('请选择要删除的商品')
    return
  }
  
  const selectedIds = selectedProducts.value.map(item => item.id)
  products.value = products.value.filter(item => !selectedIds.includes(item.id))
  
  ElMessage.success(`已成功删除 ${selectedProducts.value.length} 个商品`)
  selectedProducts.value = []
}

// 批量导出
const batchExport = () => {
  if (selectedProducts.value.length === 0) {
    ElMessage.warning('请选择要导出的商品')
    return
  }
  
  // 模拟导出功能
  ElMessage.success(`已成功导出 ${selectedProducts.value.length} 个商品数据`)
}

// 查看商品
const viewProduct = (product: any) => {
  currentProduct.value = product
  productDetailVisible.value = true
}

// 切换状态
const toggleStatus = (product: any) => {
  const index = products.value.findIndex(item => item.id === product.id)
  if (index !== -1) {
    const newStatus = products.value[index].status === 'online' ? 'offline' : 'online'
    products.value[index].status = newStatus
    ElMessage.success(`商品已${newStatus === 'online' ? '上架' : '下架'}`)
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
.product-list {
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

.product-detail {
  width: 100%;
}
</style>