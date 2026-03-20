import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../components/Layout.vue'
import { useUserStore } from '../stores/user'

// 基础路由
const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  }
]

// 带权限的路由
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { requiresAuth: true, title: '仪表盘' }
      },
      // 运营中心
      {
        path: 'operation',
        meta: { requiresAuth: true, title: '运营中心' },
        children: [
          {
            path: 'shop',
            name: 'ShopManagement',
            component: () => import('../views/operation/ShopManagement.vue'),
            meta: { requiresAuth: true, title: '店铺管理' }
          }
        ]
      },
      // 商品中心
      {
        path: 'product',
        meta: { requiresAuth: true, title: '商品中心' },
        children: [
          {
            path: 'list',
            name: 'ProductList',
            component: () => import('../views/product/ProductList.vue'),
            meta: { requiresAuth: true, title: '商品管理' }
          },
          {
            path: 'category',
            name: 'CategoryManagement',
            component: () => import('../views/product/CategoryManagement.vue'),
            meta: { requiresAuth: true, title: '分类管理' }
          }
        ]
      },
      // 订单中心
      {
        path: 'order',
        meta: { requiresAuth: true, title: '订单中心' },
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: () => import('../views/order/OrderList.vue'),
            meta: { requiresAuth: true, title: '订单管理' }
          },
          {
            path: 'after-sales',
            name: 'AfterSales',
            component: () => import('../views/order/AfterSales.vue'),
            meta: { requiresAuth: true, title: '售后管理' }
          }
        ]
      },
      // 仓储物流
      {
        path: 'warehouse',
        meta: { requiresAuth: true, title: '仓储物流' },
        children: [
          {
            path: 'list',
            name: 'WarehouseList',
            component: () => import('../views/warehouse/WarehouseList.vue'),
            meta: { requiresAuth: true, title: '仓库管理' }
          },
          {
            path: 'inventory',
            name: 'InventoryManagement',
            component: () => import('../views/warehouse/InventoryManagement.vue'),
            meta: { requiresAuth: true, title: '库存管理' }
          }
        ]
      },
      // 采购中心
      {
        path: 'purchase',
        meta: { requiresAuth: true, title: '采购中心' },
        children: [
          {
            path: 'supplier',
            name: 'SupplierManagement',
            component: () => import('../views/purchase/SupplierManagement.vue'),
            meta: { requiresAuth: true, title: '供应商管理' }
          },
          {
            path: 'order',
            name: 'PurchaseOrder',
            component: () => import('../views/purchase/PurchaseOrder.vue'),
            meta: { requiresAuth: true, title: '采购订单' }
          }
        ]
      },
      // 财税合规中心
      {
        path: 'finance',
        meta: { requiresAuth: true, title: '财税合规中心' },
        children: [
          {
            path: 'config',
            name: 'FinanceConfig',
            component: () => import('../views/finance/FinanceConfig.vue'),
            meta: { requiresAuth: true, title: '基础配置', roles: ['admin', 'finance', 'finance_manager'] }
          },
          {
            path: 'vat',
            name: 'VATManagement',
            component: () => import('../views/finance/VATManagement.vue'),
            meta: { requiresAuth: true, title: 'VAT管理', roles: ['admin', 'finance', 'finance_manager'] }
          },
          {
            path: 'customs',
            name: 'CustomsTax',
            component: () => import('../views/finance/CustomsTax.vue'),
            meta: { requiresAuth: true, title: '关税清关', roles: ['admin', 'finance', 'finance_manager'] }
          },
          {
            path: 'tax-refund',
            name: 'TaxRefund',
            component: () => import('../views/finance/TaxRefund.vue'),
            meta: { requiresAuth: true, title: '出口退税', roles: ['admin', 'finance', 'finance_manager'] }
          },
          {
            path: 'exchange',
            name: 'ExchangeGain',
            component: () => import('../views/finance/ExchangeGain.vue'),
            meta: { requiresAuth: true, title: '汇兑损益', roles: ['admin', 'finance', 'finance_manager'] }
          },
          {
            path: 'bill',
            name: 'BillReconciliation',
            component: () => import('../views/finance/BillReconciliation.vue'),
            meta: { requiresAuth: true, title: '账单对账', roles: ['admin', 'finance', 'finance_manager'] }
          },
          {
            path: 'profit',
            name: 'ProfitCalculation',
            component: () => import('../views/finance/ProfitCalculation.vue'),
            meta: { requiresAuth: true, title: '利润核算', roles: ['admin', 'finance', 'finance_manager'] }
          },
          {
            path: 'invoice',
            name: 'InvoiceReport',
            component: () => import('../views/finance/InvoiceReport.vue'),
            meta: { requiresAuth: true, title: '发票报表', roles: ['admin', 'finance', 'finance_manager'] }
          }
        ]
      },
      // 数据报表
      {
        path: 'report',
        meta: { requiresAuth: true, title: '数据报表' },
        children: [
          {
            path: 'dashboard',
            name: 'ReportDashboard',
            component: () => import('../views/report/ReportDashboard.vue'),
            meta: { requiresAuth: true, title: '经营看板' }
          },
          {
            path: 'sales',
            name: 'SalesReport',
            component: () => import('../views/report/SalesReport.vue'),
            meta: { requiresAuth: true, title: '销售报表' }
          }
        ]
      },
      // 统计大屏
      {
        path: 'bigscreen',
        name: 'BigScreen',
        component: () => import('../views/BigScreen.vue'),
        meta: { requiresAuth: true, title: '统计大屏' }
      },
      // 业务流程
      {
        path: 'workflow',
        meta: { requiresAuth: true, title: '业务流程' },
        children: [
          {
            path: 'list',
            name: 'WorkflowList',
            component: () => import('../views/workflow/WorkflowList.vue'),
            meta: { requiresAuth: true, title: '流程管理' }
          },
          {
            path: 'design',
            name: 'WorkflowDesign',
            component: () => import('../views/workflow/WorkflowDesign.vue'),
            meta: { requiresAuth: true, title: '流程设计' }
          }
        ]
      },
      // 系统管理
      {
        path: 'system',
        meta: { requiresAuth: true, title: '系统管理' },
        children: [
          {
            path: 'role',
            name: 'RoleManagement',
            component: () => import('../views/system/RoleManagement.vue'),
            meta: { requiresAuth: true, title: '角色权限', roles: ['admin'] }
          },
          {
            path: 'user',
            name: 'UserManagement',
            component: () => import('../views/system/UserManagement.vue'),
            meta: { requiresAuth: true, title: '用户管理', roles: ['admin'] }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...basicRoutes, ...routes]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.meta.requiresAuth !== false
  
  // 检查是否需要认证
  if (requiresAuth && !userStore.isLoggedIn) {
    next('/login')
    return
  }
  
  // 检查角色权限
  if (to.meta.roles && Array.isArray(to.meta.roles)) {
    const userRole = userStore.userInfo?.role
    if (!userRole || !to.meta.roles.includes(userRole)) {
      next('/dashboard')
      return
    }
  }
  
  next()
})

export default router