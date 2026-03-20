<template>
  <div class="finance-config">
    <h2 class="page-title">基础财税配置</h2>
    
    <!-- 标签页 -->
    <el-tabs v-model="activeTab">
      <!-- 汇率管理 -->
      <el-tab-pane label="汇率管理" name="exchange">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>汇率管理</span>
                <el-button type="primary" size="small" @click="openExchangeDrawer">
                  <el-icon><Plus /></el-icon> 新增汇率
                </el-button>
              </div>
            </template>
            
            <el-table :data="exchangeRates" style="width: 100%">
              <el-table-column prop="fromCurrency" label="源币种" width="120" />
              <el-table-column prop="toCurrency" label="目标币种" width="120" />
              <el-table-column prop="rate" label="汇率" width="120" />
              <el-table-column prop="effectiveDate" label="生效日期" width="180" />
              <el-table-column prop="updatedAt" label="更新时间" width="180" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="editExchange(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteExchange(scope.row.id)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 税则配置 -->
      <el-tab-pane label="税则配置" name="tax">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>税则配置</span>
                <el-button type="primary" size="small" @click="openTaxDrawer">
                  <el-icon><Plus /></el-icon> 新增税则
                </el-button>
              </div>
            </template>
            
            <el-table :data="taxRules" style="width: 100%">
              <el-table-column prop="country" label="国家/地区" width="150" />
              <el-table-column prop="vatRate" label="VAT税率" width="120" />
              <el-table-column prop="tariffRate" label="关税税率" width="120" />
              <el-table-column prop="consumptionTaxRate" label="消费税税率" width="150" />
              <el-table-column prop="taxCodeRule" label="税号规则" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="editTax(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteTax(scope.row.id)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      
      <!-- 财税科目配置 -->
      <el-tab-pane label="财税科目配置" name="account">
        <div class="tab-content">
          <el-card class="card">
            <template #header>
              <div class="card-header">
                <span>财税科目配置</span>
                <el-button type="primary" size="small" @click="openAccountDrawer">
                  <el-icon><Plus /></el-icon> 新增科目
                </el-button>
              </div>
            </template>
            
            <el-table :data="accountItems" style="width: 100%">
              <el-table-column prop="code" label="科目编码" width="120" />
              <el-table-column prop="name" label="科目名称" width="180" />
              <el-table-column prop="type" label="科目类型" width="120" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="editAccount(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteAccount(scope.row.id)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 汇率编辑抽屉 -->
    <el-drawer
      :title="editingExchange ? '编辑汇率' : '新增汇率'"
      v-model="exchangeDrawerVisible"
      direction="rtl"
      size="500px"
    >
      <el-form :model="exchangeForm" :rules="exchangeRules" ref="exchangeFormRef" label-width="100px">
        <el-form-item label="源币种" prop="fromCurrency">
          <el-select v-model="exchangeForm.fromCurrency" placeholder="请选择源币种">
            <el-option label="USD" value="USD" />
            <el-option label="CNY" value="CNY" />
            <el-option label="EUR" value="EUR" />
            <el-option label="GBP" value="GBP" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标币种" prop="toCurrency">
          <el-select v-model="exchangeForm.toCurrency" placeholder="请选择目标币种">
            <el-option label="USD" value="USD" />
            <el-option label="CNY" value="CNY" />
            <el-option label="EUR" value="EUR" />
            <el-option label="GBP" value="GBP" />
          </el-select>
        </el-form-item>
        <el-form-item label="汇率" prop="rate">
          <el-input v-model.number="exchangeForm.rate" type="number" placeholder="请输入汇率" />
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker v-model="exchangeForm.effectiveDate" type="date" placeholder="请选择生效日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveExchange">保存</el-button>
          <el-button @click="exchangeDrawerVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    
    <!-- 税则编辑抽屉 -->
    <el-drawer
      :title="editingTax ? '编辑税则' : '新增税则'"
      v-model="taxDrawerVisible"
      direction="rtl"
      size="500px"
    >
      <el-form :model="taxForm" :rules="taxRulesForm" ref="taxFormRef" label-width="120px">
        <el-form-item label="国家/地区" prop="country">
          <el-input v-model="taxForm.country" placeholder="请输入国家/地区" />
        </el-form-item>
        <el-form-item label="VAT税率" prop="vatRate">
          <el-input v-model="taxForm.vatRate" placeholder="请输入VAT税率，如：20%" />
        </el-form-item>
        <el-form-item label="关税税率" prop="tariffRate">
          <el-input v-model="taxForm.tariffRate" placeholder="请输入关税税率，如：0-10%" />
        </el-form-item>
        <el-form-item label="消费税税率" prop="consumptionTaxRate">
          <el-input v-model="taxForm.consumptionTaxRate" placeholder="请输入消费税税率，如：0%" />
        </el-form-item>
        <el-form-item label="税号规则" prop="taxCodeRule">
          <el-input v-model="taxForm.taxCodeRule" placeholder="请输入税号规则，如：GBXXXXXXXX" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveTax">保存</el-button>
          <el-button @click="taxDrawerVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    
    <!-- 财税科目编辑抽屉 -->
    <el-drawer
      :title="editingAccount ? '编辑科目' : '新增科目'"
      v-model="accountDrawerVisible"
      direction="rtl"
      size="500px"
    >
      <el-form :model="accountForm" :rules="accountRules" ref="accountFormRef" label-width="100px">
        <el-form-item label="科目编码" prop="code">
          <el-input v-model="accountForm.code" placeholder="请输入科目编码" />
        </el-form-item>
        <el-form-item label="科目名称" prop="name">
          <el-input v-model="accountForm.name" placeholder="请输入科目名称" />
        </el-form-item>
        <el-form-item label="科目类型" prop="type">
          <el-select v-model="accountForm.type" placeholder="请选择科目类型">
            <el-option label="资产" value="资产" />
            <el-option label="负债" value="负债" />
            <el-option label="所有者权益" value="所有者权益" />
            <el-option label="成本" value="成本" />
            <el-option label="损益" value="损益" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="accountForm.description" placeholder="请输入科目描述" rows="3" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveAccount">保存</el-button>
          <el-button @click="accountDrawerVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 激活的标签页
const activeTab = ref('exchange')

// 汇率管理
const exchangeRates = ref([
  {
    id: '1',
    fromCurrency: 'USD',
    toCurrency: 'CNY',
    rate: 7.2,
    effectiveDate: '2026-03-01',
    updatedAt: '2026-03-01 10:00:00'
  },
  {
    id: '2',
    fromCurrency: 'EUR',
    toCurrency: 'CNY',
    rate: 7.8,
    effectiveDate: '2026-03-01',
    updatedAt: '2026-03-01 10:00:00'
  }
])

const exchangeDrawerVisible = ref(false)
const editingExchange = ref<any>(null)
const exchangeFormRef = ref()
const exchangeForm = reactive({
  fromCurrency: '',
  toCurrency: '',
  rate: 1,
  effectiveDate: ''
})

const exchangeRules = {
  fromCurrency: [{ required: true, message: '请选择源币种', trigger: 'blur' }],
  toCurrency: [{ required: true, message: '请选择目标币种', trigger: 'blur' }],
  rate: [{ required: true, message: '请输入汇率', trigger: 'blur' }],
  effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'blur' }]
}

// 税则配置
const taxRules = ref([
  {
    id: '1',
    country: 'United Kingdom',
    vatRate: '20%',
    tariffRate: '0-10%',
    consumptionTaxRate: '0%',
    taxCodeRule: 'GBXXXXXXXX'
  },
  {
    id: '2',
    country: 'Germany',
    vatRate: '19%',
    tariffRate: '0-15%',
    consumptionTaxRate: '0%',
    taxCodeRule: 'DEXXXXXXXX'
  }
])

const taxDrawerVisible = ref(false)
const editingTax = ref<any>(null)
const taxFormRef = ref()
const taxForm = reactive({
  country: '',
  vatRate: '',
  tariffRate: '',
  consumptionTaxRate: '',
  taxCodeRule: ''
})

const taxRulesForm = {
  country: [{ required: true, message: '请输入国家/地区', trigger: 'blur' }],
  vatRate: [{ required: true, message: '请输入VAT税率', trigger: 'blur' }],
  tariffRate: [{ required: true, message: '请输入关税税率', trigger: 'blur' }],
  consumptionTaxRate: [{ required: true, message: '请输入消费税税率', trigger: 'blur' }],
  taxCodeRule: [{ required: true, message: '请输入税号规则', trigger: 'blur' }]
}

// 财税科目配置
const accountItems = ref([
  {
    id: '1',
    code: '1001',
    name: '银行存款',
    type: '资产',
    description: '企业存入银行的各种款项'
  },
  {
    id: '2',
    code: '2001',
    name: '应付账款',
    type: '负债',
    description: '企业应付给供应单位的款项'
  }
])

const accountDrawerVisible = ref(false)
const editingAccount = ref<any>(null)
const accountFormRef = ref()
const accountForm = reactive({
  code: '',
  name: '',
  type: '',
  description: ''
})

const accountRules = {
  code: [{ required: true, message: '请输入科目编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入科目名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择科目类型', trigger: 'blur' }],
  description: [{ required: true, message: '请输入科目描述', trigger: 'blur' }]
}

// 打开汇率编辑抽屉
const openExchangeDrawer = () => {
  editingExchange.value = null
  Object.assign(exchangeForm, {
    fromCurrency: '',
    toCurrency: '',
    rate: 1,
    effectiveDate: ''
  })
  exchangeDrawerVisible.value = true
}

// 编辑汇率
const editExchange = (row: any) => {
  editingExchange.value = row
  Object.assign(exchangeForm, row)
  exchangeDrawerVisible.value = true
}

// 保存汇率
const saveExchange = async () => {
  if (!exchangeFormRef.value) return
  
  try {
    await exchangeFormRef.value.validate()
    if (editingExchange.value) {
      // 编辑
      const index = exchangeRates.value.findIndex(r => r.id === editingExchange.value.id)
      if (index > -1) {
        exchangeRates.value[index] = { ...exchangeForm, id: editingExchange.value.id, updatedAt: new Date().toLocaleString() }
        ElMessage.success('汇率编辑成功')
      }
    } else {
      // 新增
      exchangeRates.value.push({
        ...exchangeForm,
        id: (exchangeRates.value.length + 1).toString(),
        updatedAt: new Date().toLocaleString()
      })
      ElMessage.success('汇率新增成功')
    }
    exchangeDrawerVisible.value = false
  } catch (error) {
    console.error('验证失败:', error)
  }
}

// 删除汇率
const deleteExchange = (id: string) => {
  exchangeRates.value = exchangeRates.value.filter(r => r.id !== id)
  ElMessage.success('汇率删除成功')
}

// 打开税则编辑抽屉
const openTaxDrawer = () => {
  editingTax.value = null
  Object.assign(taxForm, {
    country: '',
    vatRate: '',
    tariffRate: '',
    consumptionTaxRate: '',
    taxCodeRule: ''
  })
  taxDrawerVisible.value = true
}

// 编辑税则
const editTax = (row: any) => {
  editingTax.value = row
  Object.assign(taxForm, row)
  taxDrawerVisible.value = true
}

// 保存税则
const saveTax = async () => {
  if (!taxFormRef.value) return
  
  try {
    await taxFormRef.value.validate()
    if (editingTax.value) {
      // 编辑
      const index = taxRules.value.findIndex(r => r.id === editingTax.value.id)
      if (index > -1) {
        taxRules.value[index] = { ...taxForm, id: editingTax.value.id }
        ElMessage.success('税则编辑成功')
      }
    } else {
      // 新增
      taxRules.value.push({
        ...taxForm,
        id: (taxRules.value.length + 1).toString()
      })
      ElMessage.success('税则新增成功')
    }
    taxDrawerVisible.value = false
  } catch (error) {
    console.error('验证失败:', error)
  }
}

// 删除税则
const deleteTax = (id: string) => {
  taxRules.value = taxRules.value.filter(r => r.id !== id)
  ElMessage.success('税则删除成功')
}

// 打开科目编辑抽屉
const openAccountDrawer = () => {
  editingAccount.value = null
  Object.assign(accountForm, {
    code: '',
    name: '',
    type: '',
    description: ''
  })
  accountDrawerVisible.value = true
}

// 编辑科目
const editAccount = (row: any) => {
  editingAccount.value = row
  Object.assign(accountForm, row)
  accountDrawerVisible.value = true
}

// 保存科目
const saveAccount = async () => {
  if (!accountFormRef.value) return
  
  try {
    await accountFormRef.value.validate()
    if (editingAccount.value) {
      // 编辑
      const index = accountItems.value.findIndex(r => r.id === editingAccount.value.id)
      if (index > -1) {
        accountItems.value[index] = { ...accountForm, id: editingAccount.value.id }
        ElMessage.success('科目编辑成功')
      }
    } else {
      // 新增
      accountItems.value.push({
        ...accountForm,
        id: (accountItems.value.length + 1).toString()
      })
      ElMessage.success('科目新增成功')
    }
    accountDrawerVisible.value = false
  } catch (error) {
    console.error('验证失败:', error)
  }
}

// 删除科目
const deleteAccount = (id: string) => {
  accountItems.value = accountItems.value.filter(r => r.id !== id)
  ElMessage.success('科目删除成功')
}
</script>

<style scoped>
.finance-config {
  width: 100%;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 24px;
}

.tab-content {
  margin-top: 20px;
}

.card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>