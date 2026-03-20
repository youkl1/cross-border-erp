<template>
  <div class="category-management">
    <h2 class="page-title">分类管理</h2>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="small" @click="addCategory">
        <el-icon><Plus /></el-icon> 新增分类
      </el-button>
      <el-button type="danger" size="small" @click="batchDelete">
        <el-icon><Delete /></el-icon> 批量删除
      </el-button>
    </div>
    
    <!-- 分类列表 -->
    <el-card class="list-card">
      <el-table
        :data="categories"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="分类ID" width="100" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="parentName" label="父分类" width="150" />
        <el-table-column prop="level" label="层级" width="100" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'info'">
              {{ scope.row.status === 'enabled' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editCategory(scope.row)">
              编辑
            </el-button>
            <el-button :type="scope.row.status === 'enabled' ? 'warning' : 'success'" size="small" @click="toggleStatus(scope.row)">
              {{ scope.row.status === 'enabled' ? '禁用' : '启用' }}
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
    
    <!-- 分类编辑抽屉 -->
    <el-drawer
      :title="editingCategory ? '编辑分类' : '新增分类'"
      v-model="categoryDrawerVisible"
      direction="rtl"
      size="500px"
    >
      <el-form :model="categoryForm" :rules="categoryRules" ref="categoryFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="父分类" prop="parentId">
          <el-select v-model="categoryForm.parentId" placeholder="请选择父分类">
            <el-option label="顶级分类" value="0" />
            <el-option
              v-for="category in parentCategories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="categoryForm.sort" type="number" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="categoryForm.status">
            <el-radio label="enabled">启用</el-radio>
            <el-radio label="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="categoryForm.description" type="textarea" rows="3" placeholder="请输入分类描述" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveCategory">保存</el-button>
          <el-button @click="categoryDrawerVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'

// 分类列表数据
const categories = ref([
  {
    id: '1',
    name: '电子产品',
    parentId: '0',
    parentName: '顶级分类',
    level: 1,
    sort: 1,
    status: 'enabled',
    createdAt: '2026-03-01 10:00:00',
    description: '电子产品分类'
  },
  {
    id: '2',
    name: '服装',
    parentId: '0',
    parentName: '顶级分类',
    level: 1,
    sort: 2,
    status: 'enabled',
    createdAt: '2026-03-01 10:00:00',
    description: '服装分类'
  },
  {
    id: '3',
    name: '家居用品',
    parentId: '0',
    parentName: '顶级分类',
    level: 1,
    sort: 3,
    status: 'enabled',
    createdAt: '2026-03-01 10:00:00',
    description: '家居用品分类'
  },
  {
    id: '4',
    name: '手机',
    parentId: '1',
    parentName: '电子产品',
    level: 2,
    sort: 1,
    status: 'enabled',
    createdAt: '2026-03-01 10:00:00',
    description: '手机分类'
  },
  {
    id: '5',
    name: '笔记本电脑',
    parentId: '1',
    parentName: '电子产品',
    level: 2,
    sort: 2,
    status: 'enabled',
    createdAt: '2026-03-01 10:00:00',
    description: '笔记本电脑分类'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)

// 选中的分类
const selectedCategories = ref<any[]>([])

// 分类编辑
const categoryDrawerVisible = ref(false)
const editingCategory = ref<any>(null)
const categoryFormRef = ref()
const categoryForm = reactive({
  name: '',
  parentId: '0',
  sort: 0,
  status: 'enabled',
  description: ''
})

const categoryRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
}

// 父分类选项
const parentCategories = computed(() => {
  return categories.value.filter(cat => cat.level === 1)
})

// 处理选择变化
const handleSelectionChange = (val: any[]) => {
  selectedCategories.value = val
}

// 新增分类
const addCategory = () => {
  editingCategory.value = null
  Object.assign(categoryForm, {
    name: '',
    parentId: '0',
    sort: 0,
    status: 'enabled',
    description: ''
  })
  categoryDrawerVisible.value = true
}

// 编辑分类
const editCategory = (category: any) => {
  editingCategory.value = category
  Object.assign(categoryForm, category)
  categoryDrawerVisible.value = true
}

// 保存分类
const saveCategory = async () => {
  if (!categoryFormRef.value) return
  
  try {
    await categoryFormRef.value.validate()
    if (editingCategory.value) {
        // 编辑
        const index = categories.value.findIndex(cat => cat.id === editingCategory.value.id)
        if (index > -1) {
          categories.value[index] = { 
            ...categoryForm, 
            id: editingCategory.value.id,
            parentName: categoryForm.parentId === '0' ? '顶级分类' : categories.value.find(cat => cat.id === categoryForm.parentId)?.name || '',
            level: categoryForm.parentId === '0' ? 1 : 2,
            createdAt: editingCategory.value.createdAt
          }
        }
      } else {
      // 新增
      categories.value.push({
        ...categoryForm,
        id: (categories.value.length + 1).toString(),
        parentName: categoryForm.parentId === '0' ? '顶级分类' : categories.value.find(cat => cat.id === categoryForm.parentId)?.name || '',
        level: categoryForm.parentId === '0' ? 1 : 2,
        createdAt: new Date().toLocaleString()
      })
    }
    categoryDrawerVisible.value = false
  } catch (error) {
    console.error('验证失败:', error)
  }
}

// 批量删除
const batchDelete = () => {
  if (selectedCategories.value.length === 0) {
    alert('请选择要删除的分类')
    return
  }
  const ids = selectedCategories.value.map(cat => cat.id)
  categories.value = categories.value.filter(cat => !ids.includes(cat.id))
}

// 切换状态
const toggleStatus = (category: any) => {
  category.status = category.status === 'enabled' ? 'disabled' : 'enabled'
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
.category-management {
  width: 100%;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 24px;
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
</style>