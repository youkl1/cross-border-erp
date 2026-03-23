<template>
  <div class="workflow-list-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>流程管理</span>
          <el-button type="primary" @click="handleAddWorkflow">新增流程</el-button>
        </div>
      </template>
      
      <div class="workflow-content">
        <!-- 搜索栏 -->
        <div class="search-section">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="流程名称">
              <el-input v-model="searchForm.name" placeholder="请输入流程名称" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="全部" value="" />
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <!-- 流程列表 -->
        <el-table :data="workflows" style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="流程ID" width="100" />
          <el-table-column prop="name" label="流程名称" width="200" />
          <el-table-column prop="description" label="流程描述" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="1"
                inactive-value="0"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180" />
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEditWorkflow(scope.row)">编辑</el-button>
              <el-button type="success" size="small" @click="handleDesignWorkflow(scope.row.id)">设计</el-button>
              <el-button type="danger" size="small" @click="handleDeleteWorkflow(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="pagination-container">
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
      </div>
    </el-card>
    
    <!-- 流程编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑流程' : '新增流程'"
      width="600px"
    >
      <el-form :model="workflowForm" :rules="workflowRules" ref="workflowFormRef">
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="workflowForm.name" placeholder="请输入流程名称" />
        </el-form-item>
        <el-form-item label="流程描述" prop="description">
          <el-input
            v-model="workflowForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入流程描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="workflowForm.status" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveWorkflow">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const workflows = ref([
  {
    id: 1,
    name: '订单处理流程',
    description: '处理跨境电商订单的完整流程',
    status: '1',
    createdAt: '2024-01-01 00:00:00'
  },
  {
    id: 2,
    name: '采购审批流程',
    description: '采购申请的审批流程',
    status: '1',
    createdAt: '2024-01-02 10:00:00'
  },
  {
    id: 3,
    name: '财务报销流程',
    description: '员工报销的审批流程',
    status: '0',
    createdAt: '2024-01-03 14:00:00'
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)
const dialogVisible = ref(false)
const isEdit = ref(false)
const workflowFormRef = ref()

const searchForm = reactive({
  name: '',
  status: ''
})

const workflowForm = reactive({
  id: 0,
  name: '',
  description: '',
  status: '1'
})

const workflowRules = {
  name: [
    { required: true, message: '请输入流程名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入流程描述', trigger: 'blur' }
  ]
}

// 方法
const handleSearch = () => {
  console.log('搜索条件:', searchForm)
  // 实现搜索逻辑
}

const resetForm = () => {
  Object.assign(searchForm, {
    name: '',
    status: ''
  })
}

const handleAddWorkflow = () => {
  isEdit.value = false
  Object.assign(workflowForm, {
    id: 0,
    name: '',
    description: '',
    status: '1'
  })
  dialogVisible.value = true
}

const handleEditWorkflow = (row: any) => {
  isEdit.value = true
  Object.assign(workflowForm, {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status
  })
  dialogVisible.value = true
}

const handleDeleteWorkflow = (id: number) => {
  const index = workflows.value.findIndex(workflow => workflow.id === id)
  if (index !== -1) {
    workflows.value.splice(index, 1)
    total.value--
  }
}

const handleStatusChange = (row: any) => {
  console.log('状态变化:', row)
  // 实现状态变更逻辑
}

const handleDesignWorkflow = (id: number) => {
  router.push(`/workflow/design?id=${id}`)
}

const handleSaveWorkflow = () => {
  if (workflowFormRef.value) {
    workflowFormRef.value.validate((valid: boolean) => {
      if (valid) {
        if (isEdit.value) {
          const index = workflows.value.findIndex(workflow => workflow.id === workflowForm.id)
          if (index !== -1) {
            workflows.value[index] = {
              ...workflows.value[index],
              name: workflowForm.name,
              description: workflowForm.description,
              status: workflowForm.status
            }
          }
        } else {
          const newWorkflow = {
            id: Date.now(),
            name: workflowForm.name,
            description: workflowForm.description,
            status: workflowForm.status,
            createdAt: new Date().toLocaleString()
          }
          workflows.value.push(newWorkflow)
          total.value++
        }
        dialogVisible.value = false
      }
    })
  }
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  console.log(`每页 ${size} 条`)
}

const handleCurrentChange = (current: number) => {
  currentPage.value = current
  console.log(`当前页: ${current}`)
}
</script>

<style scoped>
.workflow-list-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-section {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>