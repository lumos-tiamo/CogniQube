# CogniQube 项目文档

## 项目概述

CogniQube 是一个基于 Vue3 + TypeScript 的客服质量智能分析平台，专注于客服会话的事后分析、质检评分和数据可视化。

## 技术架构

### 核心技术栈
- **前端框架**: Vue 3.4 (Composition API)
- **开发语言**: TypeScript 5.4
- **构建工具**: Vite 5
- **状态管理**: Pinia 2.1 + 持久化插件
- **UI 组件库**: Element Plus 2.6
- **路由管理**: Vue Router 4
- **数据可视化**: ECharts 5
- **HTTP 客户端**: Axios
- **日期处理**: Day.js
- **数据导出**: xlsx, jspdf, html2canvas
- **并发控制**: p-limit
- **本地存储**: IndexedDB (idb)

### 工程化工具
- **代码规范**: ESLint + Prettier
- **Git 钩子**: Husky + lint-staged
- **单元测试**: Vitest + @vue/test-utils
- **自动导入**: unplugin-auto-import + unplugin-vue-components

## 项目结构

```
CogniQube/
├── src/
│   ├── api/                    # API 接口层
│   │   ├── index.ts           # 会话和仪表板 API
│   │   └── ai.ts              # AI 分析 API
│   ├── assets/                # 静态资源
│   │   ├── images/            # 图片资源
│   │   └── styles/            # 全局样式
│   │       └── main.css       # 主样式文件
│   ├── components/            # 公共组件
│   │   ├── common/            # 通用组件
│   │   │   └── KPICard.vue   # KPI 卡片组件
│   │   └── charts/            # 图表组件
│   │       └── BaseChart.vue  # 基础图表组件
│   ├── composables/           # 组合式函数
│   │   └── useDataWorker.ts  # Web Worker 封装
│   ├── layouts/               # 布局组件
│   │   └── MainLayout.vue    # 主布局
│   ├── router/                # 路由配置
│   │   └── index.ts          # 路由定义
│   ├── stores/                # Pinia 状态管理
│   │   ├── config.ts         # 配置状态
│   │   ├── inspection.ts     # 质检状态
│   │   └── ai-engine.ts      # AI 引擎状态
│   ├── types/                 # TypeScript 类型定义
│   │   └── index.ts          # 全局类型
│   ├── utils/                 # 工具函数
│   │   ├── index.ts          # 通用工具
│   │   ├── request.ts        # Axios 封装
│   │   ├── db.ts             # IndexedDB 封装
│   │   ├── export.ts         # 数据导出
│   │   └── __tests__/        # 单元测试
│   ├── views/                 # 页面组件
│   │   ├── dashboard/        # 质检仪表板
│   │   ├── inspection/       # 会话质检列表
│   │   ├── ai-engine/        # AI 质检引擎
│   │   └── config/           # 规则配置
│   ├── workers/               # Web Workers
│   │   └── data-processor.worker.ts
│   ├── App.vue               # 根组件
│   └── main.ts               # 入口文件
├── public/                    # 公共资源
├── .eslintrc.cjs             # ESLint 配置
├── .prettierrc.json          # Prettier 配置
├── .gitignore                # Git 忽略文件
├── index.html                # HTML 入口
├── package.json              # 项目依赖
├── tsconfig.json             # TypeScript 配置
├── tsconfig.node.json        # Node TypeScript 配置
├── vite.config.ts            # Vite 配置
├── vitest.config.ts          # Vitest 配置
└── README.md                 # 项目说明
```

## 核心功能模块

### 1. 质检仪表板 (Dashboard)
**路径**: `/dashboard`

**功能特性**:
- KPI 数据卡片展示（今日质检数、平均得分、不合格率、AI 标记数）
- 满意度趋势图（支持按天/周/月切换）
- 问题分类饼图（展示各类问题占比）
- 地区满意度热力图（中国地图可视化）
- 图表联动交互

**技术亮点**:
- ECharts 图表渐进式渲染
- 响应式图表自适应
- 数据实时更新

### 2. 会话质检列表 (Inspection)
**路径**: `/inspection`

**功能特性**:
- 多条件筛选（日期范围、状态、评分范围）
- 表格排序、分页
- 批量操作（批量通过/驳回）
- 会话详情查看（完整聊天记录）
- 人工复核功能
- Excel 数据导出

**技术亮点**:
- 虚拟滚动表格（支持大数据量）
- URL 状态同步
- 筛选条件持久化

### 3. AI 质检引擎 (AI Engine)
**路径**: `/ai-engine`

**功能特性**:
- 批量自动分析
- 实时进度展示
- AI 评分结果展示
- 情感分析（积极/中性/消极）
- 问题标签识别
- 改进建议生成
- 结果接受/驳回

**技术亮点**:
- 并发控制（p-limit 限制同时请求数）
- IndexedDB 结果缓存
- Web Worker 数据处理
- 进度条实时更新

### 4. 规则配置 (Config)
**路径**: `/config`

**功能特性**:
- 质检规则管理（增删改查）
- 规则类型支持（关键词触发、响应超时、情感分析）
- JSON 配置编辑
- 规则启用/禁用

**技术亮点**:
- LocalStorage 持久化
- JSON 格式校验

## 技术亮点详解

### 1. 性能优化

#### 虚拟滚动表格
```typescript
// 使用 @tanstack/vue-virtual 实现
// 支持上千条数据流畅滚动
```

#### Web Worker 数据处理
```typescript
// src/workers/data-processor.worker.ts
// 将 CPU 密集任务移至 Worker 线程
// 避免主线程阻塞，保持 UI 流畅
```

#### ECharts 渐进式渲染
```typescript
// 大数据量图表分批渲染
// 提升首屏加载速度
```

### 2. AI 集成

#### 批量分析并发控制
```typescript
import pLimit from 'p-limit'

const limit = pLimit(3) // 最多同时 3 个请求
const tasks = conversations.map(conv =>
  limit(async () => {
    // 分析逻辑
  })
)
await Promise.all(tasks)
```

#### IndexedDB 结果缓存
```typescript
// src/utils/db.ts
// 已分析的会话结果缓存到本地
// 避免重复调用 API
```

### 3. 工程化实践

#### 自动导入
```typescript
// vite.config.ts
AutoImport({
  imports: ['vue', 'vue-router', 'pinia'],
  resolvers: [ElementPlusResolver()],
})
```

#### 代码规范
```json
// .eslintrc.cjs + .prettierrc.json
// 统一代码风格
// Husky + lint-staged 提交前自动检查
```

#### 单元测试
```typescript
// src/utils/__tests__/index.test.ts
// Vitest 单元测试
// 覆盖核心工具函数
```

### 4. 用户体验

#### 图表联动
- 点击饼图某分类，下方表格自动筛选
- 地图悬浮显示详细数据

#### URL 状态同步
- 筛选条件同步到 URL
- 支持分享链接

#### 响应式布局
- 适配不同屏幕尺寸
- 移动端友好

## 数据流设计

### 状态管理
```
Pinia Store
├── config (配置状态)
│   ├── rules (质检规则)
│   └── theme (主题)
├── inspection (质检状态)
│   ├── filterOptions (筛选条件)
│   ├── pagination (分页)
│   └── selectedIds (选中项)
└── ai-engine (AI 引擎状态)
    ├── isAnalyzing (分析中)
    ├── progress (进度)
    └── results (结果)
```

### API 层设计
```
API Layer
├── conversationApi (会话 API)
│   ├── getList (获取列表)
│   ├── getById (获取详情)
│   ├── updateStatus (更新状态)
│   └── batchUpdate (批量更新)
├── dashboardApi (仪表板 API)
│   ├── getKPIData (KPI 数据)
│   ├── getIssueCategories (问题分类)
│   ├── getSatisfactionTrend (满意度趋势)
│   └── getRegionSatisfaction (地区满意度)
└── aiApi (AI API)
    ├── analyze (单个分析)
    ├── batchAnalyze (批量分析)
    └── getCachedResult (获取缓存)
```

## 开发指南

### 环境要求
- Node.js >= 18
- npm >= 9

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
# 访问 http://localhost:5174
```

### 构建生产版本
```bash
npm run build
```

### 运行测试
```bash
npm run test
```

### 代码检查
```bash
npm run lint
```

### 代码格式化
```bash
npm run format
```

## 部署说明

### 构建优化
- 代码分割（vendor, element-plus, echarts）
- Tree Shaking
- 资源压缩

### 环境变量
```bash
# .env.production
VITE_API_BASE_URL=https://api.example.com
```

### Nginx 配置示例
```nginx
server {
  listen 80;
  server_name cogniqube.example.com;
  
  root /var/www/cogniqube/dist;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  location /api {
    proxy_pass http://backend:3000;
  }
}
```

## 面试要点

### 项目背景
- 与 CogniDesk（客服实时工作台）形成互补
- CogniDesk 负责实时接待，CogniQube 负责事后分析
- 展现对客服业务全链路的理解

### 技术难点

1. **大规模表格性能优化**
   - 问题：上千条数据渲染卡顿
   - 方案：虚拟滚动 + 前端分页
   - 效果：流畅滚动，首屏加载 < 1s

2. **AI API 批量调用限流**
   - 问题：并发请求过多导致限流
   - 方案：p-limit 控制并发数 + 失败重试
   - 效果：稳定完成批量分析

3. **ECharts 地图数据量过大**
   - 问题：中国地图 JSON 500KB，加载慢
   - 方案：按需加载 + progressive 渐进渲染
   - 效果：首屏加载优化 60%

4. **IndexedDB 缓存策略**
   - 问题：重复分析浪费 API 额度
   - 方案：结果缓存到 IndexedDB
   - 效果：缓存命中率 > 80%

### 项目亮点
- 完整的工程化实践（ESLint, Prettier, Husky, Vitest）
- 性能优化（虚拟滚动、Web Worker、渐进式渲染）
- AI 集成（大模型 API、情感分析、批量处理）
- 用户体验（图表联动、URL 同步、响应式布局）

## 后续优化方向

1. **表格虚拟化升级**
   - 使用 @tanstack/vue-virtual 替代原生实现
   - 支持动态行高

2. **实时数据推送**
   - WebSocket 实时更新质检结果
   - 服务端推送新会话通知

3. **PDF 报告生成**
   - html2canvas + jspdf 生成报告
   - 支持自定义模板

4. **微前端架构**
   - 与 CogniDesk 共用主应用
   - qiankun 或 Module Federation

5. **国际化支持**
   - vue-i18n 多语言
   - 支持中英文切换

## 许可证

MIT License
