// 全局TypeScript类型定义

// 用户相关类型
export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  permissions: string[];
  avatar?: string;
  email?: string;
  phone?: string;
  lastLogin?: string;
}

export type Role = 'admin' | 'operation' | 'warehouse' | 'finance' | 'finance_manager';

// 商品相关类型
export interface Product {
  id: string;
  sku: string;
  name: string;
  platform: string;
  category: string;
  categoryId: string;
  price: number;
  stock: number;
  status: 'online' | 'offline';
  createdAt: string;
  description: string;
  languageInfo: LanguageInfo[];
  compliance?: ComplianceInfo;
  warehouseMapping: WarehouseMapping[];
}

export interface LanguageInfo {
  language: string;
  name: string;
  description: string;
}

export interface ComplianceInfo {
  asin: string;
  hsCode: string;
  customsElements: string;
  certifications: string;
}

export interface WarehouseMapping {
  warehouse: string;
  sku: string;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  parentId: string;
  parentName: string;
  level: number;
  sort: number;
  status: 'enabled' | 'disabled';
  createdAt: string;
  description: string;
}

// 订单相关类型
export interface Order {
  id: string;
  orderNo: string;
  platform: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  products: OrderProduct[];
  logistics?: LogisticsInfo;
  payment?: PaymentInfo;
  taxInfo?: TaxInfo;
  afterSales?: AfterSalesInfo[];
}

export type OrderStatus = 
  | 'pending_approval' 
  | 'pending_shipment' 
  | 'shipped' 
  | 'customs_clearance' 
  | 'in_transit' 
  | 'delivered' 
  | 'completed' 
  | 'cancelled' 
  | 'after_sales';

export interface OrderProduct {
  id: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface LogisticsInfo {
  trackingNumber: string;
  carrier: string;
  shippingMethod: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  status: string;
}

export interface PaymentInfo {
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  paymentTime: string;
}

export interface TaxInfo {
  vat: number;
  customsDuty: number;
  consumptionTax: number;
  totalTax: number;
}

export interface AfterSalesInfo {
  id: string;
  type: 'refund' | 'return' | 'exchange';
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  amount: number;
  createdAt: string;
  updatedAt: string;
}

// 财务相关类型
export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  effectiveDate: string;
  createdAt: string;
}

export interface TaxRule {
  id: string;
  country: string;
  taxType: 'vat' | 'customs' | 'consumption';
  rate: number;
  minAmount?: number;
  maxAmount?: number;
  effectiveDate: string;
  description: string;
}

export interface VatTaxInfo {
  id: string;
  taxNumber: string;
  country: string;
  registrationDate: string;
  expiryDate: string;
  filingCycle: 'monthly' | 'quarterly' | 'annually';
  status: 'active' | 'expired' | 'pending';
}

export interface TaxRefund {
  id: string;
  refundNo: string;
  orderIds: string[];
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
  applicationDate: string;
  approvalDate?: string;
}

export interface ExchangeGain {
  id: string;
  transactionId: string;
  currency: string;
  amount: number;
  exchangeRate: number;
  gainLoss: number;
  date: string;
  type: 'gain' | 'loss';
}

export interface Bill {
  id: string;
  billNo: string;
  platform: string;
  storeId: string;
  period: string;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'reconciled' | 'paid';
  createdAt: string;
  items: BillItem[];
}

export interface BillItem {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
}

export interface ProfitInfo {
  orderId: string;
  productId: string;
  storeId: string;
  platform: string;
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
  period: string;
}

// 仓储相关类型
export interface Warehouse {
  id: string;
  name: string;
  type: 'domestic' | 'bonded' | 'overseas' | 'transit';
  location: string;
  contact: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Inventory {
  id: string;
  productId: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reserved: number;
  available: number;
  updatedAt: string;
}

// 响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  total?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

// 通用类型
export interface PaginationParams {
  page: number;
  pageSize: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchParams {
  [key: string]: any;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
