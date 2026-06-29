# M2 技术架构设计

## 总体原则

项目应拆成两层：

- 通用能力层：继续保持 Page Agent 作为可复用网页智能体框架。
- TCL 官网业务层：承载官网客服方案的定制配置、知识、规则和 UI 皮肤。

不要把 TCL 规则直接写死进 `packages/core`，否则后续维护困难，也会损害项目复用价值。

## 推荐架构

```text
TCL 官网页面
  |
  | 内嵌 TCLServiceAgent
  v
packages/page-agent
  |
  | 组合 UI + Core + PageController
  v
packages/core
  |
  | Agent Loop / Tools / Hooks / Instructions
  v
packages/page-controller
  |
  | DOM 观察 / 点击 / 输入 / 滚动 / 高亮
  v
TCL 官网 DOM
```

新增业务封装层：

```text
packages/tcl-agent 或 examples/tcl-official-site
  ├── TclServiceAgent.ts
  ├── intent/
  ├── instructions/
  ├── safety/
  ├── knowledge/
  ├── telemetry/
  └── ui/
```

如果只服务 TCL 官网，可以使用 `packages/tcl-agent`。如果仍处于验证期，优先放在 `examples/tcl-official-site`。

## 模块放置建议

| 模块 | 放置位置 | 是否通用 | 说明 |
| --- | --- | --- | --- |
| `IntentRouter` | TCL 业务层起步，成熟后抽象到 core | 半通用 | 先做规则加 LLM 轻分类，避免过早抽象 |
| `TclInstructions` | TCL 业务层 | TCL 定制 | 官网栏目、服务规则、品牌语气 |
| `SafetyPolicy` | core 提供接口，TCL 层提供策略 | 通用加定制 | 提交前确认是通用能力，具体规则由 TCL 配置 |
| `ConfirmBeforeAction` | core/tools 附近 | 通用 | 企业官网都需要动作确认 |
| `SupportHandoff` | TCL 业务层 | TCL 定制 | 人工客服入口、电话、跳转方式 |
| `Telemetry` | core hooks + TCL adapter | 通用加定制 | core 暴露事件，TCL 决定上报位置 |
| `KnowledgeAdapter` | TCL 业务层 | 半通用 | 先接 TCL 官网知识，后续可抽象检索接口 |
| 客服式 UI | `packages/ui` 新增通用组件，TCL 层传主题 | 通用加定制 | 不直接改死当前 Panel |

## 对现有包的改造边界

### `packages/core`

应该新增：

- 动作执行前拦截 hook，例如 `onBeforeToolExecute`。
- 高风险动作确认机制。
- 更清晰的 tool result 结构，区分 `success`、`failed`、`needs_confirmation`。
- 可插拔 intent/context 注入。

不应该新增：

- TCL 电话。
- TCL 服务页 URL。
- TCL 产品分类。
- TCL 售后话术。

### `packages/page-controller`

应该新增或增强：

- 判断点击目标是否外链。
- 判断点击目标是否提交按钮。
- 判断输入字段是否敏感字段。
- 更可靠的元素描述，例如按钮文本、`aria-label`、form 上下文。
- 操作前预览能力，告诉用户将点击什么。

不应该新增：

- 业务意图判断。
- TCL 页面导航知识。

### `packages/ui`

应该新增一个客服模式 UI，而不是直接替换开发者 Panel：

```text
packages/ui/src/customer-service/
  ├── CustomerServicePanel.ts
  ├── MessageList.ts
  ├── Composer.ts
  ├── ActionPreview.ts
  ├── ConfirmCard.ts
  └── HandoffCard.ts
```

当前 `Panel` 保留给开发者调试。

### `packages/page-agent`

作为组合层，后续支持：

```ts
new PageAgent({
  uiMode: 'developer' | 'customer-service',
  instructions,
  safetyPolicy,
  telemetry,
})
```

TCL 层再包装：

```ts
new TclServiceAgent({
  brand: 'TCL',
  serviceUrl: 'https://www.tcl.com/cn/zh/user-service',
  hotline: '4008-123456',
})
```

## 核心执行链路

```text
用户问题
  -> IntentRouter 识别意图
  -> 注入 TCL 业务 instructions
  -> PageAgentCore 执行
  -> SafetyPolicy 检查工具动作
  -> 低风险动作直接执行
  -> 高风险动作先弹确认
  -> 成功后客服 UI 返回结果
  -> Telemetry 记录过程
```

## 高风险动作拦截点

不能只靠 prompt 约束。必须在工具执行前拦截。

```text
tool call: click_element_by_index
  -> resolve element metadata
  -> SafetyPolicy.evaluate(action, element, page)
  -> allow: 执行
  -> confirm: 问用户
  -> block: 拒绝并解释
```

典型规则：

| 动作 | 条件 | 处理 |
| --- | --- | --- |
| click | 按钮疑似提交、预约、确认、支付、登录 | confirm |
| click | 外链到客服、商城、京东 | confirm |
| input | 字段疑似手机号、地址、订单号 | confirm 或 user-only |
| input | 普通搜索框 | allow |
| scroll | 页面滚动 | allow |
| wait | 等待加载 | allow |
| execute_javascript | 官网生产环境 | block |

第一阶段生产环境建议禁用 `execute_javascript`。

## TCL 知识层

第一阶段不必直接做复杂 RAG，可先分三档：

1. 静态官网路径知识：服务页、电话、在线客服、产品分类、常见栏目。
2. 精选 FAQ 知识：20 到 30 个高频故障排查问题。
3. 官网文章检索：后续再做自动抓取、索引、召回。

知识回答必须带来源感：

- 官网服务页显示。
- TCL 官方文章建议。
- 建议联系官方售后确认。

## 上线形态

第一阶段推荐：

```text
官网内嵌 SDK
  + TCLServiceAgent
  + 客服式浮窗
  + 不启用多标签扩展
  + 不启用 JS 执行工具
  + 只允许当前域名页面操作
```

浏览器扩展保留作内部测试工具，用于产品、客服团队验证复杂路径。
