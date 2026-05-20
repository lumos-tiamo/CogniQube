# CogniQube - 客服质量智能分析平台

## 项目简介

CogniQube 是一个基于 Vue3 + TypeScript 的客服质量智能分析平台，提供会话质检、数据可视化、AI 自动评分等功能。

## 技术栈

- **框架**: Vue 3.4 + TypeScript
- **构建工具**: Vite 5
- **状态管理**: Pinia + 持久化插件
- **UI 组件**: Element Plus
- **数据可视化**: ECharts 5
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **表格虚拟化**: @tanstack/vue-virtual
- **数据导出**: xlsx, jspdf, html2canvas
- **工程化**: ESLint + Prettier + Husky + Vitest

## 核心功能

### 1. 质检仪表板
- KPI 数据卡片展示
- 满意度趋势图（ECharts）
- 问题分类饼图
- 地区热力图
- 图表联动交互

### 2. 会话质检列表
- 虚拟滚动表格（支持大数据量）
- 多条件筛选、排序
- 会话详情查看
- 人工复核功能

### 3. AI 质检引擎
- 大模型 API 集成
- 批量自动评分
- 情感分析
- 结果缓存（IndexedDB）

### 4. 数据导出
- Excel 导出
- PDF 报告生成

## 项目结构

```
src/
├── api/              # API 接口
├── assets/           # 静态资源
├── components/       # 公共组件
├── composables/      # 组合式函数
├── layouts/          # 布局组件
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
├── views/            # 页面组件
├── workers/          # Web Workers
├── App.vue           # 根组件
└── main.ts           # 入口文件
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
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

## 技术亮点

1. **性能优化**
   - 虚拟滚动表格处理大数据量
   - Web Worker 处理 CPU 密集任务
   - ECharts 渐进式渲染

2. **AI 集成**
   - 大模型 API 情感分析
   - 批量分析并发控制
   - IndexedDB 结果缓存

3. **工程化**
   - TypeScript 类型安全
   - ESLint + Prettier 代码规范
   - Husky + lint-staged Git 钩子
   - Vitest 单元测试

4. **用户体验**
   - 图表联动交互
   - URL 状态同步
   - 响应式布局

## 开发规范

- 使用 Composition API
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case
- 提交前自动执行 lint 和格式化

## License

MIT
