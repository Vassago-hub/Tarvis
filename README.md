# Tarvis

Tarvis 是一个面向 TCL 官网场景的智能服务助手原型。项目基于 Page Agent 构建，不是单纯的 FAQ 问答机器人，而是一个可以读取当前网页结构、理解用户意图、调用受控网页工具并推进多步任务的官网智能体。

它的目标是把官网从“被动展示信息”升级为“主动帮助用户完成任务”的智能服务入口：帮助用户找到售后、人工客服、故障排查、产品页面、商务合作等关键路径，同时对登录、支付、验证码、隐私信息和高风险操作保持可控边界。

## 项目特色

- **网页级智能体能力**：通过 Page Agent 观察真实 DOM，将页面简化为可供 LLM 理解的结构，再按元素索引执行点击、输入、滚动等操作。
- **TCL 服务场景定制**：内置报修、人工客服、投诉、故障排查、官网导航、商用与合作等意图识别规则。
- **安全优先的动作拦截**：在工具执行前通过 `TclSafetyPolicy` 拦截或确认登录、支付、验证码、敏感输入、提交按钮、外部跳转和安全风险关键词。
- **客服化 UI**：提供面向官网访客的客服助手面板，而不是开发者调试面板。
- **可扩展架构**：TCL 业务规则放在 `examples/tcl-official-site/`，核心 Page Agent 能力仍保持通用，可迁移到其他官网或业务系统。
- **完整测试页面组**：网站内置 `/page-agent/test-pages`，覆盖表单、商品、仪表盘、文章、跨页面任务和浮层菜单等交互场景。

## 功能范围

当前 MVP 聚焦第一阶段能力：

- 售后入口分流
- 人工客服入口分流
- 高频故障排查辅助
- 官网产品与服务导航
- 商用、光伏、工程、合作类请求分流
- 危险、投诉、隐私、订单、支付等场景转人工或要求用户确认

明确不做：

- 自动提交维修、投诉、预约表单
- 自动登录、支付、验证码处理
- 承诺价格、库存、维修费用或维修时效
- 深度对接内部客服、订单、工单或支付系统

## 技术架构

这是一个 npm workspaces monorepo：

```text
packages/
├── page-agent/          # 带 UI 的 PageAgent 入口
├── core/                # 无 UI 的 PageAgentCore 执行循环
├── llms/                # OpenAI-compatible LLM 客户端
├── page-controller/     # DOM 抽取、页面信息、点击输入滚动等网页动作
├── ui/                  # 面板、客服 UI、动效与国际化
└── website/             # React 官网、文档和测试页面

examples/
└── tcl-official-site/   # TCL 官网智能服务助手示例实现

docs/
└── tcl-service-agent/   # TCL 服务助手产品、技术、测试和上线文档
```

核心链路：

```text
用户任务
  -> TclServiceAgent 意图识别与 FAQ 命中
  -> PageAgent / PageAgentCore 观察、思考、行动
  -> PageController 抽取 DOM 并执行受控网页操作
  -> TclSafetyPolicy 在动作前确认或阻断高风险操作
  -> 客服 UI 展示过程、结果和转人工提示
```

## 快速开始

### 环境要求

- Node.js `^22.22.1` 或 `>=24`
- npm `^11.6.3`

### 安装依赖

```bash
npm install
```

### 启动网站

```bash
npm start
```

默认启动 React/Vite 网站。开发环境下访问：

- 首页：`http://127.0.0.1:5173/page-agent/`
- 测试页面组：`http://127.0.0.1:5173/page-agent/test-pages`
- 开发者文档：`http://127.0.0.1:5173/page-agent/docs/introduction/overview`

### 配置本地模型服务

网站开发模式会从仓库根目录 `.env` 读取以下变量：

```bash
LLM_BASE_URL=https://your-openai-compatible-endpoint
LLM_MODEL_NAME=your-model-name
LLM_API_KEY=your-api-key
```

如果不配置，测试页面会使用项目中的演示模型配置。生产或真实业务环境应使用自己的模型网关和鉴权策略。

## 常用命令

```bash
npm start          # 启动网站开发服务器
npm run build      # 构建所有包
npm run build:libs # 构建库包
npm run typecheck  # TypeScript 类型检查
npm run test       # 运行各 workspace 的单元测试
npm run lint       # ESLint 检查
npm run ci         # CI 入口脚本
```

## TCL 示例入口

TCL 场景相关实现集中在 `examples/tcl-official-site/`：

- `src/TclServiceAgent.ts`：TCL 客服 Agent 封装，负责挂载 UI、注入系统指令、意图观察和遥测。
- `src/intent/IntentRouter.ts`：基于关键词的意图路由。
- `src/safety/SafetyPolicy.ts`：工具执行前的安全确认与阻断策略。
- `src/knowledge/faq.ts`：常见故障和服务问题知识库。
- `src/knowledge/serviceMap.ts`：TCL 服务入口、热线和业务路径。
- `src/instructions/`：系统提示词、页面提示词和兜底话术。

## 文档索引

TCL 智能服务助手的产品与工程规划位于 `docs/tcl-service-agent/`：

- `M1-functional-spec.md`：功能规格
- `M2-technical-architecture.md`：技术架构
- `M3-development-backlog.md`：开发清单
- `M4-product-experience.md`：产品体验
- `M5-prompts-and-rules.md`：Prompt 与业务规则
- `M6-testing-and-acceptance.md`：测试与验收
- `M7-launch-and-operations.md`：上线与运营
- `M8-decisions.md`：决策清单
- `M9-implementation-sketch.md`：实施草图

## 安全边界

Tarvis 的设计原则是“可追踪、可预测、风险可见”。因此：

- 登录、注册、支付、验证码、密码字段默认阻断。
- 敏感字段输入需要用户确认。
- 提交、确认、外部客服跳转等动作需要用户确认。
- 涉及漏电、冒烟、烧焦味、进水、自行拆机等安全风险时优先提示断电并联系官方售后。
- 投诉、赔偿、隐私、订单、账号等问题优先转人工。

## 许可

本项目沿用仓库内 `LICENSE` 文件声明的 MIT License。
