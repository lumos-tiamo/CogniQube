# CogniQube 快速启动指南

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```
访问 http://localhost:5174

### 3. 构建生产版本
```bash
npm run build
```

### 4. 运行测试
```bash
npm run test
```

## 📁 项目结构概览

```
CogniQube/
├── src/
│   ├── api/              # API 接口层
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── composables/      # 组合式函数
│   ├── layouts/          # 布局组件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── types/            # TypeScript 类型
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   └── workers/          # Web Workers
├── DOCS.md               # 详细技术文档
├── INTERVIEW.md          # 面试准备指南
└── PROJECT_SUMMARY.md    # 项目总结
```

## 🎯 核心功能

### 1. 质检仪表板 (`/dashboard`)
- KPI 数据展示
- 满意度趋势图
- 问题分类饼图
- 地区热力图

### 2. 会话质检列表 (`/inspection`)
- 多条件筛选
- 批量操作
- 会话详情查看
- Excel 导出

### 3. AI 质检引擎 (`/ai-engine`)
- 批量自动分析
- 实时进度展示
- 结果管理
- IndexedDB 缓存

### 4. 规则配置 (`/config`)
- 质检规则管理
- JSON 配置编辑

## 🛠️ 技术栈

- **框架**: Vue 3.4 + TypeScript 5.4
- **构建**: Vite 5
- **状态**: Pinia 2.1
- **UI**: Element Plus 2.6
- **图表**: ECharts 5
- **工程化**: ESLint + Prettier + Husky + Vitest

## 📝 重要文档

- **DOCS.md** - 完整的技术文档，包含架构设计、技术实现细节
- **INTERVIEW.md** - 面试准备指南，包含常见问题和回答话术
- **PROJECT_SUMMARY.md** - 项目总结，包含完成情况和亮点

## 🎨 技术亮点

1. **性能优化**
   - 虚拟滚动表格
   - Web Worker 数据处理
   - ECharts 渐进式渲染

2. **AI 集成**
   - 大模型 API 批量调用
   - 并发控制（p-limit）
   - IndexedDB 结果缓存

3. **工程化**
   - TypeScript 严格模式
   - 自动导入配置
   - 单元测试覆盖

4. **用户体验**
   - 图表联动交互
   - URL 状态同步
   - 筛选条件持久化

## 🔧 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行测试
npm run test

# 测试 UI
npm run test:ui

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 📦 下一步建议

### 立即可做
1. 安装依赖并启动项目
2. 查看各个页面的实现
3. 阅读 DOCS.md 了解技术细节
4. 阅读 INTERVIEW.md 准备面试

### 可选优化
1. 添加 Mock Server（json-server）
2. 完善 loading 和 error 状态
3. 部署到 Vercel/Netlify
4. 录制演示视频

## 💡 面试准备

### 30秒介绍
"CogniQube 是我开发的客服质量智能分析平台，用于客服会话的事后质检和数据分析。采用 Vue3 + TypeScript 技术栈，核心功能包括质检仪表板、会话质检列表、AI 自动评分引擎。技术亮点是虚拟滚动、Web Worker 优化和大模型 API 集成。"

### 技术难点
- 虚拟滚动表格处理大数据量
- AI API 批量调用并发控制
- IndexedDB 缓存一致性
- ECharts 大数据量性能优化

详细的面试问题和回答请查看 **INTERVIEW.md**

## 📞 联系方式

如有问题，请查看项目文档或提交 Issue。

---

**祝你面试顺利！** 🎉
