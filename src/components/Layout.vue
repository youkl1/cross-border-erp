<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <h1 class="logo">跨境ERP</h1>
        <el-button 
          type="text" 
          @click="toggleSidebar"
          class="collapse-btn"
        >
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        router
        :collapse="isSidebarCollapsed"
        active-text-color="#409eff"
        background-color="#ffffff"
        text-color="#303133"
      >
        <el-menu-item index="/dashboard">
          <el-icon><House /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-sub-menu index="/operation">
          <template #title>
            <el-icon><Operation /></el-icon>
            <span>运营中心</span>
          </template>
          <el-menu-item index="/operation/shop">店铺管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/product">
          <template #title>
            <el-icon><Goods /></el-icon>
            <span>商品中心</span>
          </template>
          <el-menu-item index="/product/list">商品管理</el-menu-item>
          <el-menu-item index="/product/category">分类管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/order">
          <template #title>
            <el-icon><Ticket /></el-icon>
            <span>订单中心</span>
          </template>
          <el-menu-item index="/order/list">订单管理</el-menu-item>
          <el-menu-item index="/order/after-sales">售后管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/warehouse">
          <template #title>
            <el-icon><Box /></el-icon>
            <span>仓储物流</span>
          </template>
          <el-menu-item index="/warehouse/list">仓库管理</el-menu-item>
          <el-menu-item index="/warehouse/inventory">库存管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/purchase">
          <template #title>
            <el-icon><ShoppingCart /></el-icon>
            <span>采购中心</span>
          </template>
          <el-menu-item index="/purchase/supplier">供应商管理</el-menu-item>
          <el-menu-item index="/purchase/order">采购订单</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/finance" class="finance-menu">
          <template #title>
            <el-icon><Money /></el-icon>
            <span>财税合规中心</span>
          </template>
          <el-menu-item index="/finance/config">基础配置</el-menu-item>
          <el-menu-item index="/finance/vat">VAT管理</el-menu-item>
          <el-menu-item index="/finance/customs">关税清关</el-menu-item>
          <el-menu-item index="/finance/tax-refund">出口退税</el-menu-item>
          <el-menu-item index="/finance/exchange">汇兑损益</el-menu-item>
          <el-menu-item index="/finance/bill">账单对账</el-menu-item>
          <el-menu-item index="/finance/profit">利润核算</el-menu-item>
          <el-menu-item index="/finance/invoice">发票报表</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/report">
          <template #title>
            <el-icon><DataAnalysis /></el-icon>
            <span>数据报表</span>
          </template>
          <el-menu-item index="/report/dashboard">经营看板</el-menu-item>
          <el-menu-item index="/report/sales">销售报表</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/bigscreen">
          <el-icon><Monitor /></el-icon>
          <span>统计大屏</span>
        </el-menu-item>
        <el-sub-menu index="/workflow">
          <template #title>
            <el-icon><Collection /></el-icon>
            <span>业务流程</span>
          </template>
          <el-menu-item index="/workflow/list">流程管理</el-menu-item>
          <el-menu-item index="/workflow/design">流程设计</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/system/role">角色权限</el-menu-item>
          <el-menu-item index="/system/user">用户管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部导航栏 -->
      <header class="navbar">
        <div class="navbar-left">
          <el-button 
            type="text" 
            @click="toggleSidebar"
            class="mobile-toggle"
          >
            <el-icon><Menu /></el-icon>
          </el-button>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
              {{ item.label }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="navbar-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar size="small" :icon="UserFilled">
                {{ userInfo?.username?.charAt(0) || 'U' }}
              </el-avatar>
              <span class="username">{{ userInfo?.username || '用户' }}</span>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-icon><User /></el-icon>
                  <span>个人中心</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-icon><SwitchButton /></el-icon>
                  <span>切换账号</span>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <el-icon><Switch /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 页面内容 -->
      <div class="page-container">
        <div class="page-header">
          <h2 class="page-title">{{ currentPageTitle }}</h2>
          <div class="page-actions">
            <slot name="actions"></slot>
          </div>
        </div>
        <div class="page-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>

      <!-- 页脚 -->
      <footer class="footer">
        <div class="footer-content">
          <p>© 2026 跨境电商ERP系统 | 版权所有</p>
          <p class="footer-version">版本 1.0.0</p>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { 
  House, Operation, Goods, Ticket, Box, ShoppingCart, 
  Money, DataAnalysis, Setting, ArrowLeft, Menu, 
  UserFilled, User, SwitchButton, Switch, ArrowDown, 
  Monitor, Collection 
} from '@element-plus/icons-vue'

// 侧边栏状态
const isSidebarCollapsed = ref(false)

// 从用户状态管理获取用户信息
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 路由信息
const route = useRoute()

// 计算当前激活的菜单
const activeMenu = computed(() => {
  return route.path.split('/').slice(0, 3).join('/')
})

// 计算当前页面标题
const currentPageTitle = computed(() => {
  const breadcrumbList = breadcrumb.value
  return breadcrumbList[breadcrumbList.length - 1]?.label || '首页'
})

// 面包屑
const breadcrumb = computed(() => {
  const path = route.path
  const breadcrumbMap: Record<string, string> = {
    '/dashboard': '仪表盘',
    '/operation': '运营中心',
    '/operation/shop': '店铺管理',
    '/product': '商品中心',
    '/product/list': '商品管理',
    '/product/category': '分类管理',
    '/order': '订单中心',
    '/order/list': '订单管理',
    '/order/after-sales': '售后管理',
    '/warehouse': '仓储物流',
    '/warehouse/list': '仓库管理',
    '/warehouse/inventory': '库存管理',
    '/purchase': '采购中心',
    '/purchase/supplier': '供应商管理',
    '/purchase/order': '采购订单',
    '/finance': '财税合规中心',
    '/finance/config': '基础配置',
    '/finance/vat': 'VAT管理',
    '/finance/customs': '关税清关',
    '/finance/tax-refund': '出口退税',
    '/finance/exchange': '汇兑损益',
    '/finance/bill': '账单对账',
    '/finance/profit': '利润核算',
    '/finance/invoice': '发票报表',
    '/report': '数据报表',
    '/report/dashboard': '经营看板',
    '/report/sales': '销售报表',
    '/bigscreen': '统计大屏',
    '/workflow': '业务流程',
    '/workflow/list': '流程管理',
    '/workflow/design': '流程设计',
    '/system': '系统管理',
    '/system/role': '角色权限',
    '/system/user': '用户管理'
  }
  
  const parts = path.split('/').filter(Boolean)
  const breadcrumbList = [{ label: '首页', path: '/' }]
  
  let currentPath = ''
  parts.forEach(part => {
    currentPath += `/${part}`
    if (breadcrumbMap[currentPath]) {
      breadcrumbList.push({
        label: breadcrumbMap[currentPath],
        path: currentPath
      })
    }
  })
  
  return breadcrumbList
})

// 切换侧边栏
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
:deep(*) {
  box-sizing: border-box;
}

.layout-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #f5f7fa;
}

/* 侧边栏 */
.sidebar {
  width: 256px;
  background-color: #ffffff;
  border-right: 1px solid #e4e7ed;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #ffffff;
}

.logo {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
  margin: 0;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.sidebar.collapsed .logo {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.collapse-btn {
  color: #606266;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 4px;
}

.collapse-btn:hover {
  background-color: #f0f2f5;
}

.sidebar.collapsed .collapse-btn {
  transform: rotate(180deg);
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  background-color: #ffffff;
  overflow-y: auto;
}

.sidebar-menu .el-menu-item {
  height: 48px;
  line-height: 48px;
  margin: 0 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  color: #606266;
  transition: all 0.3s ease;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #f0f9ff;
  color: #1890ff;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #e6f7ff;
  color: #1890ff;
  font-weight: 500;
}

.sidebar-menu .el-sub-menu__title {
  height: 48px;
  line-height: 48px;
  margin: 0 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  transition: all 0.3s ease;
}

.sidebar-menu .el-sub-menu__title:hover {
  background-color: #f0f2f5;
  color: #1890ff;
}

.sidebar-menu .el-sub-menu .el-menu {
  background-color: #ffffff;
  padding: 8px 0;
}

.sidebar-menu .el-sub-menu .el-menu-item {
  height: 40px;
  line-height: 40px;
  margin: 0 24px;
  font-size: 13px;
  font-weight: 400;
}

.finance-menu {
  border-left: 3px solid #1890ff;
  margin-left: 16px;
  border-radius: 0 8px 8px 0;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f5f7fa;
}

/* 顶部导航栏 */
.navbar {
  height: 64px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
  border-bottom: 1px solid #e4e7ed;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.mobile-toggle {
  display: none;
  color: #606266;
}

.breadcrumb {
  font-size: 14px;
}

.breadcrumb .el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #1890ff;
  font-weight: 500;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background-color: #f0f2f5;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  white-space: nowrap;
}

.dropdown-icon {
  font-size: 12px;
  color: #909399;
  transition: transform 0.3s ease;
}

/* 页面内容 */
.page-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  min-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 8px;
}

.page-content {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
  min-height: 600px;
}

/* 页脚 */
.footer {
  height: 60px;
  background-color: #ffffff;
  border-top: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1440px;
  padding: 0 24px;
}

.footer p {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

.footer-version {
  font-size: 11px;
  color: #c0c4cc;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .page-container {
    min-width: 960px;
  }
}

@media screen and (max-width: 992px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(0);
  }
  
  .sidebar.collapsed {
    transform: translateX(-100%);
  }
  
  .mobile-toggle {
    display: block;
  }
  
  .page-container {
    min-width: 768px;
  }
}

@media screen and (max-width: 768px) {
  .page-container {
    min-width: 100%;
    padding: 16px;
  }
  
  .page-content {
    padding: 16px;
  }
  
  .navbar {
    padding: 0 16px;
  }
  
  .sidebar-header {
    padding: 0 16px;
  }
}
</style>