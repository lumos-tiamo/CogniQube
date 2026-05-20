# CogniQube 面试准备指南

## 项目介绍话术

### 30秒电梯演讲
"CogniQube 是我开发的一个客服质量智能分析平台，主要用于客服会话的事后质检和数据分析。它与我之前做的 CogniDesk 客服工作台形成互补——CogniDesk 负责实时接待，CogniQube 负责事后分析。

项目采用 Vue3 + TypeScript + Vite 技术栈，核心功能包括质检仪表板、会话质检列表、AI 自动评分引擎和规则配置。技术亮点是虚拟滚动表格处理大数据量、Web Worker 优化性能、以及集成大模型 API 实现智能质检。"

### 详细介绍（2-3分钟）
"这个项目的背景是，客服团队需要对历史会话进行质量评估，但人工质检效率低且标准不统一。所以我设计了这个智能分析平台。

**核心功能分为四个模块：**

1. **质检仪表板**：展示 KPI 数据卡片、满意度趋势图、问题分类饼图和地区热力图。使用 ECharts 实现数据可视化，支持图表联动交互。

2. **会话质检列表**：支持多条件筛选、批量操作、Excel 导出。这里的技术难点是表格可能有上千条数据，我使用虚拟滚动技术优化了性能，保证流畅滚动。

3. **AI 质检引擎**：这是项目的核心亮点。它可以批量调用大模型 API 对会话进行自动评分、情感分析和问题标签识别。为了避免 API 限流，我用 p-limit 控制并发数，同时将分析结果缓存到 IndexedDB，避免重复调用。

4. **规则配置**：支持自定义质检规则，比如关键词触发、响应超时等。

**技术亮点：**
- 性能优化：虚拟滚动、Web Worker 处理 CPU 密集任务、ECharts 渐进式渲染
- AI 集成：大模型 API、批量分析并发控制、IndexedDB 缓存
- 工程化：完整的 ESLint + Prettier + Husky + Vitest 体系

整个项目展现了我对客服业务的理解，以及在性能优化、AI 集成和工程化方面的实践能力。"

## 常见面试问题及回答

### Q1: 为什么选择虚拟滚动？具体怎么实现的？

**回答：**
"因为会话质检列表可能有上千条数据，如果全部渲染会导致 DOM 节点过多，页面卡顿。虚拟滚动的原理是只渲染可视区域的数据，滚动时动态替换内容。

我使用了 @tanstack/vue-virtual 这个库，它提供了 `useVirtualizer` 这个 composable。核心逻辑是：
1. 计算可视区域能显示多少行
2. 根据滚动位置计算当前应该渲染哪些行
3. 使用绝对定位将这些行放到正确位置
4. 用一个占位元素撑开总高度

这样即使有 10000 条数据，实际渲染的 DOM 节点也只有几十个，性能提升非常明显。"

### Q2: AI 批量分析时如何处理并发和失败重试？

**回答：**
"这是项目的一个技术难点。大模型 API 通常有并发限制，比如每秒最多 10 个请求。如果直接 Promise.all 并发所有请求，会触发限流。

我的解决方案是使用 p-limit 库控制并发数：

```typescript
import pLimit from 'p-limit'

const limit = pLimit(3) // 最多同时 3 个请求
const tasks = conversations.map(conv =>
  limit(async () => {
    try {
      const result = await aiApi.analyze(conv)
      return result
    } catch (error) {
      // 失败重试逻辑
      return retry(() => aiApi.analyze(conv), 3)
    }
  })
)
await Promise.all(tasks)
```

同时我还做了几个优化：
1. **缓存机制**：已分析的会话结果存到 IndexedDB，避免重复调用
2. **进度展示**：实时更新进度条，让用户知道当前状态
3. **失败处理**：单个请求失败不影响整体，记录失败项供用户重试

这样既保证了稳定性，又提升了用户体验。"

### Q3: Web Worker 在项目中的应用场景是什么？

**回答：**
"Web Worker 主要用于处理 CPU 密集型任务，避免阻塞主线程导致 UI 卡顿。

在 CogniQube 中，我用 Worker 处理两个场景：

1. **大数据量统计计算**：比如计算 1000 条会话的平均得分、不合格率等，这些计算在主线程会卡顿
2. **导出数据预处理**：导出 Excel 前需要格式化数据，数据量大时也会卡

实现上，我封装了一个 `useDataWorker` composable：

```typescript
export function useDataWorker() {
  const worker = new Worker(
    new URL('@/workers/data-processor.worker.ts', import.meta.url),
    { type: 'module' }
  )
  
  const calculateStatistics = (data) => {
    return new Promise((resolve) => {
      worker.postMessage({ type: 'CALCULATE', data })
      worker.onmessage = (e) => resolve(e.data)
    })
  }
  
  return { calculateStatistics }
}
```

Worker 内部处理完后通过 postMessage 返回结果，整个过程主线程不会阻塞。"

### Q4: 如何保证 ECharts 图表在大数据量下的性能？

**回答：**
"ECharts 在数据量大时确实会有性能问题，我做了几个优化：

1. **渐进式渲染**：使用 `progressive` 配置，数据分批渲染
```typescript
series: [{
  type: 'scatter',
  progressive: 1000, // 每次渲染 1000 个点
  progressiveThreshold: 3000 // 超过 3000 个点启用
}]
```

2. **按需加载地图数据**：中国地图 JSON 有 500KB，我改成按需加载，只在用户访问地图页面时才加载

3. **图表懒加载**：使用 Intersection Observer，图表进入可视区域才初始化

4. **防抖优化**：窗口 resize 时用防抖避免频繁重绘

这些优化让地图页面的首屏加载时间从 3 秒降到了 1 秒以内。"

### Q5: 项目的状态管理是如何设计的？

**回答：**
"我使用 Pinia 做状态管理，按功能模块划分了三个 store：

1. **configStore**：管理全局配置，比如质检规则、主题设置
2. **inspectionStore**：管理质检列表的筛选条件、分页、选中项
3. **aiEngineStore**：管理 AI 分析的状态、进度、结果

关键设计点：

**持久化**：使用 pinia-plugin-persistedstate 插件，筛选条件和配置自动保存到 localStorage，刷新页面不丢失

```typescript
export const useInspectionStore = defineStore('inspection', {
  state: () => ({ filterOptions, pagination }),
  persist: {
    key: 'cogniqube-inspection',
    storage: localStorage,
    paths: ['filterOptions', 'pagination']
  }
})
```

**URL 同步**：筛选条件同步到 URL query，支持分享链接

这样既保证了状态管理的清晰性，又提升了用户体验。"

### Q6: 如何处理 AI API 返回格式不稳定的问题？

**回答：**
"这是实际项目中遇到的一个坑。大模型 API 有时返回的 JSON 格式不规范，比如缺少某些字段，或者字段类型不对。

我的解决方案是：

1. **Schema 校验**：使用 Zod 或自定义校验函数验证返回数据
```typescript
function validateAIResult(data: any): AIInspectionResult {
  return {
    conversationId: data.conversationId || '',
    score: typeof data.score === 'number' ? data.score : 0,
    issues: Array.isArray(data.issues) ? data.issues : [],
    suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
    sentiment: ['positive', 'neutral', 'negative'].includes(data.sentiment) 
      ? data.sentiment 
      : 'neutral'
  }
}
```

2. **降级策略**：如果 API 返回异常，使用正则提取关键信息，或者返回默认值

3. **错误上报**：记录异常数据，方便后续优化 prompt

这样即使 API 返回不稳定，也能保证前端不崩溃。"

### Q7: 项目的工程化实践有哪些？

**回答：**
"我在这个项目中实践了完整的前端工程化体系：

**代码规范**：
- ESLint + Prettier 统一代码风格
- Husky + lint-staged 提交前自动检查和格式化
- 配置了 TypeScript 严格模式

**自动化**：
- unplugin-auto-import 自动导入 Vue API 和组件
- unplugin-vue-components 按需导入 Element Plus 组件

**测试**：
- Vitest 单元测试，覆盖核心工具函数
- 测试覆盖率 > 80%

**构建优化**：
- 代码分割：vendor、element-plus、echarts 单独打包
- Tree Shaking 去除未使用代码
- Gzip 压缩

**开发体验**：
- Vite HMR 热更新
- TypeScript 类型提示
- ESLint 实时错误提示

这些实践让项目的可维护性和开发效率都得到了保障。"

## 技术深度问题

### Q8: 如果要支持百万级数据，你会怎么优化？

**回答：**
"百万级数据前端肯定不能一次性加载，需要前后端配合：

**前端优化**：
1. **虚拟滚动 + 分页**：虚拟滚动只解决渲染问题，数据还是要分页加载
2. **服务端分页**：每次只请求一页数据（如 20 条）
3. **无限滚动**：滚动到底部自动加载下一页
4. **搜索防抖**：用户输入搜索关键词时，防抖 500ms 再请求

**后端优化**：
1. **数据库索引**：在常用筛选字段上建索引
2. **缓存**：热点数据缓存到 Redis
3. **分库分表**：数据量特别大时考虑分库

**架构优化**：
1. **CDN 加速**：静态资源走 CDN
2. **SSR**：首屏服务端渲染，提升加载速度

这样即使百万级数据，用户体验也能保证。"

### Q9: 如何保证 IndexedDB 缓存的一致性？

**回答：**
"IndexedDB 缓存确实有一致性问题，比如服务端数据更新了，但缓存还是旧的。

我的策略是：

1. **时间戳校验**：缓存数据时记录时间戳，读取时检查是否过期
```typescript
interface CachedResult {
  data: AIInspectionResult
  timestamp: number
  ttl: number // 过期时间（秒）
}

async function getCachedResult(id: string) {
  const cached = await db.get('aiResults', id)
  if (!cached) return null
  
  const now = Date.now()
  if (now - cached.timestamp > cached.ttl * 1000) {
    await db.delete('aiResults', id) // 过期删除
    return null
  }
  
  return cached.data
}
```

2. **版本号机制**：数据结构变化时更新版本号，旧版本缓存自动失效

3. **手动刷新**：提供"清除缓存"按钮，让用户主动刷新

4. **后台同步**：使用 Service Worker 后台同步最新数据

这样既利用了缓存提升性能，又保证了数据一致性。"

## 项目亮点总结

### 技术亮点
1. **性能优化**：虚拟滚动、Web Worker、ECharts 渐进式渲染
2. **AI 集成**：大模型 API、批量分析并发控制、IndexedDB 缓存
3. **工程化**：完整的 ESLint + Prettier + Husky + Vitest 体系
4. **用户体验**：图表联动、URL 同步、响应式布局

### 业务理解
1. 与 CogniDesk 形成互补，展现对客服业务全链路的理解
2. 解决了人工质检效率低、标准不统一的痛点
3. AI 自动评分 + 人工复核的混合模式，平衡了效率和准确性

### 可扩展性
1. 模块化设计，易于添加新功能
2. 类型安全，TypeScript 保证代码质量
3. 组件化，复用性强

## 注意事项

1. **不要夸大**：如果某个功能没实现，不要说实现了
2. **准备 Demo**：最好能现场演示或提供在线地址
3. **准备代码**：面试官可能要求看代码，确保代码质量
4. **准备数据**：准备一些 mock 数据，让 Demo 更真实
5. **准备问题**：面试结束时可以问面试官关于团队技术栈、业务场景的问题

## 可能的追问

- "如果要做实时数据推送，你会怎么设计？" → WebSocket + 心跳机制
- "如果要支持多租户，你会怎么改造？" → 租户隔离、权限控制
- "如果要做微前端，你会怎么拆分？" → qiankun 或 Module Federation
- "如果要做国际化，你会怎么实现？" → vue-i18n + 动态语言包加载

准备好这些问题的答案，面试时会更从容。
