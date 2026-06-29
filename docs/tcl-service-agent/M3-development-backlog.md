# M3 详细开发清单

## P0 必做

| 任务 | 目标 | 涉及位置 | 验收 |
| --- | --- | --- | --- |
| TCL 业务封装入口 | 新建 `TclServiceAgent`，组合 PageAgent 能力 | `examples/tcl-official-site` 或 `packages/tcl-agent` | 可在 TCL 页面初始化 agent |
| TCL 系统规则 | 定义品牌语气、服务边界、人工转接规则 | TCL 业务层 `instructions/` | 常见问题回答不跑偏 |
| 官网路径规则 | 首页、服务页、产品页、客服入口路径 | TCL 业务层 `instructions/routes.ts` | 找客服、报修、找产品可执行 |
| 高风险动作确认 | 提交、外链、隐私输入前确认 | `packages/core` + `page-controller` | 100% 拦截高风险动作 |
| 禁用 JS 执行 | 生产环境不允许模型执行任意脚本 | agent config | `execute_javascript` 不出现在工具列表 |
| 客服式 UI 原型 | 替代开发者面板 | `packages/ui` 新增 customer-service 组件 | 用户只看到对话、确认卡、转人工卡 |
| 转人工卡片 | 电话、在线客服、服务页链接 | TCL UI/业务层 | 一键打开官方客服入口 |
| 基础 telemetry | 记录意图、结果、失败原因 | core hooks + TCL adapter | 能看到解决率、转人工率 |

## P1 强烈建议

| 任务 | 目标 | 涉及位置 | 验收 |
| --- | --- | --- | --- |
| IntentRouter | 识别客服、报修、故障、导航、商用合作 | TCL 业务层 `intent/` | 20 条测试问题分类正确率 90%+ |
| FAQ 知识包 | 20 到 30 个高频售后问题 | TCL 业务层 `knowledge/faq.ts` | 故障排查回答稳定 |
| 页面动作预览 | 点击前显示“我将帮你打开...” | `ui` + `core` hook | 高风险动作前用户能看懂 |
| 敏感字段识别 | 手机号、地址、订单号、身份证 | `page-controller` metadata | 敏感输入不会静默代填 |
| 外链识别 | 商城、京东、在线客服外链确认 | `page-controller` | 外链前确认 |
| 失败兜底话术 | 页面找不到、弹窗失败、验证码、登录 | TCL 业务层 | 失败时给可执行下一步 |
| 内部测试脚本 | 覆盖 5 大 MVP 意图 | tests 或文档清单 | 每次发布前可人工或自动回归 |

## P2 后续增强

| 任务 | 目标 |
| --- | --- |
| 官网文章 RAG | 自动检索 TCL 官方文章 |
| 多轮用户画像 | 根据房间、预算、产品偏好做推荐 |
| 客服后台 | 查看失败会话、更新知识库 |
| A/B 测试 | 对比原客服入口和 AI 服务管家 |
| 多渠道复用 | 官网、App、微信小程序共用服务能力 |
| 导购能力 | 产品推荐、参数对比、购买路径引导 |

## 推荐文件结构

验证期建议先用 example：

```text
examples/tcl-official-site/
  ├── src/
  │   ├── TclServiceAgent.ts
  │   ├── intent/
  │   │   ├── IntentRouter.ts
  │   │   └── intents.ts
  │   ├── instructions/
  │   │   ├── system.ts
  │   │   ├── routes.ts
  │   │   └── pages.ts
  │   ├── safety/
  │   │   ├── SafetyPolicy.ts
  │   │   └── rules.ts
  │   ├── knowledge/
  │   │   ├── faq.ts
  │   │   └── serviceMap.ts
  │   ├── telemetry/
  │   │   └── TelemetryAdapter.ts
  │   └── ui/
  │       └── theme.ts
  └── README.md
```

验证稳定后再升级为：

```text
packages/tcl-agent/
```

## 核心代码改造点

第一批建议只碰这些：

1. `packages/core/src/PageAgentCore.ts`：加工具执行前 hook，例如 `onBeforeToolExecute`。
2. `packages/core/src/tools/index.ts`：让工具结果更结构化，至少让安全层知道动作类型。
3. `packages/page-controller/src/PageController.ts`：增加元素 metadata 查询，例如是否外链、是否提交按钮、是否敏感输入。
4. `packages/ui/src/panel/Panel.ts`：当前可保留开发者视图，新增客服 UI 或逐步演化右下角面板。
5. `packages/page-agent/src/PageAgent.ts`：支持选择 UI 模式或接入自定义 UI。

## Sprint 建议

### Sprint 1：安全底座 + TCL 规则

- 新增 TCL instructions。
- 新增高风险动作定义。
- 禁用 JS 执行。
- 加外链、提交、敏感字段识别。
- 做 20 条手工测试用例。

### Sprint 2：客服 UI + 转人工

- 做客服式浮窗。
- 做确认卡片。
- 做转人工卡片。
- 接服务页、电话、在线客服入口。

### Sprint 3：故障排查 + 导航闭环

- 加 FAQ 知识包。
- 加 IntentRouter。
- 覆盖报修、故障、导航、商用合作。
- 做灰度前验收。

## 灰度验收清单

- “我要联系客服”能到官方入口或给电话。
- “我要报修空调”能进入服务路径。
- “电视黑屏怎么办”能给安全排查和售后建议。
- “帮我找智能门锁”能打开对应分类或给明确入口。
- “我要投诉”不会擅自提交，优先转人工。
- 点击外链前有确认。
- 填手机号、地址、订单号前有确认。
- 遇到登录或验证码会停止并说明。
- 页面找不到入口时不会乱点，会给兜底。
- 所有回答使用中文，语气像 TCL 官方服务助手。
