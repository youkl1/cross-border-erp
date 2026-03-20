<template>
  <div class="user-management-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAddUser">新增用户</el-button>
        </div>
      </template>
      
      <div class="user-content">
        <!-- 搜索栏 -->
        <div class="search-section">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="searchForm.role" placeholder="请选择角色">
                <el-option label="全部" value="" />
                <el-option label="管理员" value="admin" />
                <el-option label="财务" value="finance" />
                <el-option label="运营" value="operation" />
              </el-select>
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
        
        <!-- 用户列表 -->
        <el-table :data="users" style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="用户ID" width="100" />
          <el-table-column prop="username" label="用户名" width="180" />
          <el-table-column prop="name" label="姓名" width="180" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="role" label="角色" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.role === 'admin' ? 'danger' : scope.row.role === 'finance' ? 'warning' : 'info'">
                {{ scope.row.role === 'admin' ? '管理员' : scope.row.role === 'finance' ? '财务' : '运营' }}
              </el-tag>
            </template>
          </el-table-column>
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
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEditUser(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDeleteUser(scope.row.id)" :disabled="scope.row.username === 'admin'">删除</el-button>
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
    
    <!-- 用户编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="600px"
    >
      <el-form :model="userForm" :rules="userRules" ref="userFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" type="email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="财务" value="finance" />
            <el-option label="运营" value="operation" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="userForm.status" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveUser">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 响应式数据
const users = ref([
  {
    id: 1,
    username: 'admin',
    name: '管理员',
    email: 'admin@example.com',
    role: 'admin',
    status: '1',
    createdAt: '2024-01-01 00:00:00'
  },
  {
    id: 2,
    username: 'finance',
    name: '财务人员',
    email: 'finance@example.com',
    role: 'finance',
    status: '1',
    createdAt: '2024-01-02 10:00:00'
  },
  {
    id: 3,
    username: 'operation',
    name: '运营人员',
    email: 'operation@example.com',
    role: 'operation',
    status: '1',
    createdAt: '2024-01-03 14:00:00'
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)
const dialogVisible = ref(false)
const isEdit = ref(false)
const userFormRef = ref()

const searchForm = reactive({
  username: '',
  role: '',
  status: ''
})

const userForm = reactive({
  id: '',
  username: '',
  name: '',
  email: '',
  password: '',
  role: '',
  status: '1'
})

const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 位', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 方法
const handleSearch = () => {
  console.log('搜索条件:', searchForm)
  // 实现搜索逻辑
}

const resetForm = () => {
  Object.assign(searchForm, {
    username: '',
    role: '',
    status: ''
  })
}

const handleAddUser = () => {
  isEdit.value = false
  Object.assign(userForm, {
    id: '',
    username: '',
    name: '',
    email: '',
    password: '',
    role: '',
    status: '1'
  })
  dialogVisible.value = true
}

const handleEditUser = (row: any) => {
  isEdit.value = true
  Object.assign(userForm, {
    id: row.id,
    username: row.username,
    name: row.name,
    email: row.email,
    password: '',
    role: row.role,
    status: row.status
  })
  dialogVisible.value = true
}

const handleDeleteUser = (id: number) => {
  const index = users.value.findIndex(user => user.id === id)
  if (index !== -1) {
    users.value.splice(index, 1)
    total.value--
  }
}

const handleStatusChange = (row: any) => {
  console.log('状态变化:', row)
  // 实现状态变更逻辑
}

const handleSaveUser = () => {
  if (userFormRef.value) {
    userFormRef.value.validate((valid: boolean) => {
      if (valid) {
        if (isEdit.value) {
          const index = users.value.findIndex(user => user.id === userForm.id)
          if (index !== -1) {
            users.value[index] = {
              ...users.value[index],
              name: userForm.name,
              email: userForm.email,
              role: userForm.role,
              status: userForm.status
            }
          }
        } else {
          const newUser = {
            id: Date.now(),
            username: userForm.username,
            name: userForm.name,
            email: userForm.email,
            role: userForm.role,
            status: userForm.status,
            createdAt: new Date().toLocaleString()
          }
          users.value.push(newUser)
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
.user-management-container {
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