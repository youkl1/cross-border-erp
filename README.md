<<<<<<< HEAD
# 跨境电商ERP系统前端

## 项目简介

跨境电商ERP系统前端是一个基于Vue 3 + TypeScript + Element Plus开发的现代化后台管理系统，专为跨境电商企业设计，提供全流程的业务管理功能，包括运营、商品、订单、财税、数据报表和系统管理等核心模块。

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **类型系统**: TypeScript
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **网络请求**: Axios
- **构建工具**: Vite
- **数据可视化**: ECharts

## 核心功能模块

### 1. 运营中心
- 多平台店铺管理（支持Amazon、Temu、速卖通、Shopee、Lazada、TikTok Shop等）
- 店铺授权管理
- 多店铺数据隔离
- 店铺绩效分析

### 2. 商品中心
- 跨境商品管理（SPU/SKU全生命周期）
- 多语言商品信息
- 产品合规管理（ASIN、海关编码等）
- 多仓SKU映射
- 分类与品牌管理
- 商品库存预警

### 3. 订单中心
- 多平台订单同步
- 订单全状态管理
- 订单详情管理
- 售后退款管理
- 批量订单处理
- 订单物流跟踪

### 4. 仓储物流
- 仓库管理
- 库存管理
- 库存调整
- 库存锁定/解锁
- 库存导出

### 5. 采购中心
- 供应商管理
- 采购订单管理
- 采购流程跟踪

### 6. 财税合规中心
- 基础财税配置（汇率、税则、科目）
- VAT税务管理
- 关税与清关财税管理
- 出口退税管理
- 汇兑损益管理
- 账单与对账管理
- 利润核算中心
- 发票与财务报表管理

### 7. 数据报表中心
- 核心经营看板
- 销售报表
- 库存报表
- 运营报表
- 财务报表

### 8. 系统管理
- 角色与权限管理
- 组织与用户管理
- 审批流程管理
- 操作日志
- 系统配置

## 项目结构

```
src/
├── views/          # 页面文件，按业务模块分子文件夹
├── components/     # 公共组件+业务通用组件
├── api/            # API接口封装，按模块拆分文件
├── stores/         # Pinia全局状态管理
├── router/         # 路由配置+路由守卫
├── utils/          # 通用工具函数
├── assets/         # 静态资源
└── types/          # 全局TypeScript类型定义
```

## 快速开始

### 环境要求
- Node.js 16.0+
- npm 8.0+

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 生产环境构建

```bash
npm run build
```

### 类型检查

```bash
npm run typecheck
```

### 代码格式化

```bash
npm run format
```

## 登录信息

默认登录账号：
- 用户名: admin
- 密码: 123456

## 浏览器兼容性

- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)

## 响应式支持

- 桌面端 (1200px+)
- 平板端 (768px-1199px)
- 移动端 (320px-767px)

## 开发规范

### 代码风格
- 使用ESLint和Prettier进行代码检查和格式化
- 遵循Vue 3 Composition API最佳实践
- 使用TypeScript进行类型定义
- 组件命名使用PascalCase，文件命名使用kebab-case
- 变量命名使用camelCase，常量使用UPPER_CASE

### 目录结构规范
- 按业务模块组织代码
- 公共组件放在components目录
- 页面组件放在views目录
- API接口按模块拆分
- 工具函数放在utils目录

### 提交规范
- 使用Conventional Commits规范
- 提交信息格式：`[模块名] 简要描述修改内容 - 关联任务/需求编号`
- 提交前运行类型检查和代码格式化

## 部署指南

### 开发环境
1. 安装依赖：`npm install`
2. 运行开发服务器：`npm run dev`
3. 访问：`http://localhost:3000`

### 生产环境
1. 构建项目：`npm run build`
2. 将dist目录部署到服务器
3. 配置Nginx或其他Web服务器

### Docker部署
```bash
# 构建镜像
docker build -t cross-border-erp-frontend .

# 运行容器
docker run -p 80:80 cross-border-erp-frontend
```

## 贡献指南

1. Fork项目仓库
2. 创建功能分支：`git checkout -b feature/xxx`
3. 提交代码：`git commit -m "[模块名] 功能描述"`
4. 推送到远程：`git push origin feature/xxx`
5. 创建Pull Request

## 常见问题解答

### Q: 安装依赖失败怎么办？
A: 尝试使用`npm install --legacy-peer-deps`或清理npm缓存后重新安装。

### Q: 开发服务器启动失败怎么办？
A: 检查端口是否被占用，尝试使用其他端口启动。

### Q: 类型检查失败怎么办？
A: 检查TypeScript类型定义是否正确，修复类型错误后重新运行。

## 项目特点

1. **现代化技术栈**: 使用Vue 3 Composition API和TypeScript，代码类型安全
2. **模块化设计**: 清晰的目录结构，便于维护和扩展
3. **多平台适配**: 支持主流跨境电商平台
4. **财税合规**: 完整的跨境财税合规功能
5. **用户体验**: 响应式设计，流畅的交互体验
6. **权限管理**: 基于角色的精细化权限控制
7. **数据可视化**: 使用ECharts实现丰富的数据图表
8. **批量操作**: 支持批量处理订单、库存等业务操作

## 后续规划

- [ ] 国际化支持
- [ ] 深色模式
- [ ] 更多平台集成
- [ ] 智能数据分析
- [ ] 移动端APP
- [ ] 自动化测试
- [ ] CI/CD集成

## 许可证

MIT License
=======
# cross-border-erp
>>>>>>> 354708e8647d678fd00806bda8d7c54c4ba5dfdc
