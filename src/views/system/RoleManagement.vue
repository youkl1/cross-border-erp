<template>
  <div class="role-management-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>角色权限管理</span>
          <el-button type="primary" @click="handleAddRole">新增角色</el-button>
        </div>
      </template>
      
      <div class="role-content">
        <!-- 角色列表 -->
        <el-table :data="roles" style="width: 100%">
          <el-table-column prop="id" label="角色ID" width="100" />
          <el-table-column prop="name" label="角色名称" width="180" />
          <el-table-column prop="description" label="角色描述" />
          <el-table-column prop="createdAt" label="创建时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEditRole(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDeleteRole(scope.row.id)" :disabled="scope.row.name === 'admin'">删除</el-button>
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
    
    <!-- 角色编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑角色' : '新增角色'"
      width="600px"
    >
      <el-form :model="roleForm" :rules="roleRules" ref="roleFormRef">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="权限设置">
          <el-checkbox-group v-model="roleForm.permissions">
            <el-checkbox label="dashboard">仪表盘</el-checkbox>
            <el-checkbox label="operation">运营中心</el-checkbox>
            <el-checkbox label="product">商品中心</el-checkbox>
            <el-checkbox label="order">订单中心</el-checkbox>
            <el-checkbox label="warehouse">仓储物流</el-checkbox>
            <el-checkbox label="purchase">采购中心</el-checkbox>
            <el-checkbox label="finance">财税合规中心</el-checkbox>
            <el-checkbox label="report">数据报表</el-checkbox>
            <el-checkbox label="system">系统管理</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveRole">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 响应式数据
const roles = ref([
  {
    id: 1,
    name: 'admin',
    description: '超级管理员，拥有所有权限',
    createdAt: '2024-01-01 00:00:00'
  },
  {
    id: 2,
    name: 'finance',
    description: '财务人员，拥有财务相关权限',
    createdAt: '2024-01-02 10:00:00'
  },
  {
    id: 3,
    name: 'operation',
    description: '运营人员，拥有运营相关权限',
    createdAt: '2024-01-03 14:00:00'
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)
const dialogVisible = ref(false)
const isEdit = ref(false)
const roleFormRef = ref()

const roleForm = reactive({
  id: 0,
  name: '',
  description: '',
  permissions: []
})

const roleRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' }
  ]
}

// 方法
const handleAddRole = () => {
  isEdit.value = false
  Object.assign(roleForm, {
    id: 0,
    name: '',
    description: '',
    permissions: []
  })
  dialogVisible.value = true
}

const handleEditRole = (row: any) => {
  isEdit.value = true
  Object.assign(roleForm, {
    id: row.id,
    name: row.name,
    description: row.description,
    permissions: row.permissions || []
  })
  dialogVisible.value = true
}

const handleDeleteRole = (id: number) => {
  const index = roles.value.findIndex(role => role.id === id)
  if (index !== -1) {
    roles.value.splice(index, 1)
    total.value--
  }
}

const handleSaveRole = () => {
  if (roleFormRef.value) {
    roleFormRef.value.validate((valid: boolean) => {
      if (valid) {
        if (isEdit.value) {
          const index = roles.value.findIndex(role => role.id === roleForm.id)
          if (index !== -1) {
            roles.value[index] = {
              ...roles.value[index],
              name: roleForm.name,
              description: roleForm.description
            }
          }
        } else {
          const newRole = {
            id: Date.now(),
            name: roleForm.name,
            description: roleForm.description,
            permissions: roleForm.permissions,
            createdAt: new Date().toLocaleString()
          }
          roles.value.push(newRole)
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
.role-management-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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