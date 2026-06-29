# M9 实施前技术方案草图

## 1. 新增业务示例目录

建议先建：

```text
examples/tcl-official-site/
  src/
    TclServiceAgent.ts
    config.ts
    intent/
      intents.ts
      IntentRouter.ts
    instructions/
      system.ts
      routes.ts
      pages.ts
    safety/
      SafetyPolicy.ts
      rules.ts
    knowledge/
      faq.ts
      serviceMap.ts
    telemetry/
      TelemetryAdapter.ts
    ui/
      theme.ts
```

## 2. TclServiceAgent

职责：组合通用 PageAgent + TCL 规则。

接口草图：

```ts
export interface TclServiceAgentConfig {
  baseURL: string
  model: string
  apiKey?: string
  telemetry?: TelemetryAdapter
  environment?: 'development' | 'production'
}

export class TclServiceAgent {
  private agent: PageAgent

  constructor(config: TclServiceAgentConfig) {
    this.agent = new PageAgent({
      baseURL: config.baseURL,
      model: config.model,
      apiKey: config.apiKey,
      language: 'zh-CN',
      experimentalScriptExecutionTool: false,
      instructions: {
        system: TCL_SYSTEM_INSTRUCTIONS,
        getPageInstructions: getTclPageInstructions,
      },
      transformPageContent: maskSensitiveContent,
      // Future hooks:
      // onBeforeToolExecute: safetyPolicy.evaluate
      // onTelemetryEvent: telemetry.track
    })
  }

  execute(input: string) {
    return this.agent.execute(input)
  }

  stop() {
    return this.agent.stop()
  }

  dispose() {
    return this.agent.dispose()
  }
}
```

## 3. IntentRouter

第一阶段规则优先。

```ts
export type TclIntent =
  | 'human_support'
  | 'repair_service'
  | 'troubleshooting'
  | 'site_navigation'
  | 'business_service'
  | 'complaint'
  | 'unknown'

export interface IntentResult {
  intent: TclIntent
  confidence: number
  entities: {
    productType?: string
    issueType?: string
    targetPage?: string
  }
  reason: string
}
```

规则示例：

```text
complaint:
  投诉、维权、赔偿、没人处理、不满意

human_support:
  人工、客服、电话、在线客服

repair_service:
  报修、维修、售后、预约、上门

troubleshooting:
  E1、黑屏、不制冷、漏水、不脱水、异响
```

## 4. TCL Instructions

系统指令：

```ts
export const TCL_SYSTEM_INSTRUCTIONS = `
你是 TCL 官网智能服务助手...
...
`
```

页面指令：

```ts
export function getTclPageInstructions(url: string): string | undefined {
  if (url.includes('/user-service')) return SERVICE_PAGE_INSTRUCTIONS
  if (url.includes('/blog')) return BLOG_PAGE_INSTRUCTIONS
  if (url.includes('/products')) return PRODUCT_PAGE_INSTRUCTIONS
  return HOME_PAGE_INSTRUCTIONS
}
```

服务路径知识：

```ts
export const TCL_SERVICE_MAP = {
  hotline: '4008-123456',
  servicePage: 'https://www.tcl.com/cn/zh/user-service',
  homePage: 'https://www.tcl.com/cn/zh',
  intents: {
    human_support: ['服务支持', '24小时在线客服'],
    repair_service: ['服务支持', '家电服务', '个人产品服务'],
    business_service: ['商用显示服务', '中央空调服务', '商用工程产品服务'],
  },
}
```

## 5. SafetyPolicy

目标：工具执行前拦截。

建议通用 core hook 形态：

```ts
export interface ToolExecutionContext {
  toolName: string
  toolInput: unknown
  pageUrl: string
  element?: ElementMetadata
}

export interface SafetyDecision {
  type: 'allow' | 'confirm' | 'block'
  riskLevel: 'low' | 'medium' | 'high' | 'blocked'
  reason: string
  userMessage?: string
}
```

TCL 策略：

```ts
export class TclSafetyPolicy {
  evaluate(ctx: ToolExecutionContext): SafetyDecision {
    if (ctx.toolName === 'execute_javascript') {
      return {
        type: 'block',
        riskLevel: 'blocked',
        reason: 'JavaScript execution is disabled in production.',
      }
    }

    if (isSensitiveInput(ctx)) return confirmOrUserOnly(...)
    if (isSubmitAction(ctx)) return confirm(...)
    if (isExternalLink(ctx)) return confirm(...)
    if (isLoginOrPayment(ctx)) return block(...)

    return allow(...)
  }
}
```

## 6. PageController 元数据

需要新增能力：

```ts
export interface ElementMetadata {
  index: number
  tagName: string
  text: string
  ariaLabel?: string
  role?: string
  href?: string
  target?: string
  inputType?: string
  name?: string
  placeholder?: string
  isExternalLink: boolean
  isSubmitLike: boolean
  isSensitiveField: boolean
}
```

新增方法草图：

```ts
getElementMetadata(index: number): Promise<ElementMetadata>
```

用于安全层判断：

- 是否外链。
- 是否 submit。
- 是否手机号、地址、订单字段。
- 是否登录、支付、验证码相关。

## 7. ConfirmBeforeAction

需要把 `ask_user` 从“模型主动问问题”扩展为“系统强制确认”。

流程：

```text
LLM 请求 click_element_by_index
  -> core 调 onBeforeToolExecute
  -> SafetyPolicy 返回 confirm
  -> core 调 onAskUser(confirm message)
  -> 用户确认
  -> 执行工具
```

确认结果：

```ts
export interface ConfirmationResult {
  confirmed: boolean
  userInput?: string
}
```

第一阶段可以用现有 `onAskUser` 支撑，后续客服 UI 做确认卡。

## 8. CustomerServicePanel

不要改旧 Panel，新增或演化客服模式：

```text
packages/ui/src/customer-service/
  CustomerServicePanel.ts
  CustomerServicePanel.module.css
  types.ts
```

核心接口：

```ts
export interface CustomerServicePanelConfig {
  language?: 'zh-CN'
  title?: string
  quickActions?: QuickAction[]
  handoff?: {
    hotline: string
    serviceUrl: string
  }
}

export interface QuickAction {
  label: string
  prompt: string
}
```

默认快捷按钮：

```ts
[
  { label: '我要报修', prompt: '我要报修' },
  { label: '联系人工', prompt: '我要联系人工客服' },
  { label: '故障排查', prompt: '我想排查产品故障' },
  { label: '找产品', prompt: '帮我找产品页面' },
]
```

## 9. TelemetryAdapter

接口草图：

```ts
export interface TelemetryEvent {
  sessionId: string
  taskId: string
  pageUrl: string
  intent?: TclIntent
  actionType?: string
  riskLevel?: string
  confirmationShown?: boolean
  resultStatus?: 'success' | 'failed' | 'handoff' | 'blocked'
  failureReason?: string
  latencyMs?: number
}

export interface TelemetryAdapter {
  track(event: TelemetryEvent): void | Promise<void>
}
```

第一阶段可以先 `console` 或 no-op，保留接口。

## 10. 最小实施顺序

真正开工时建议这样切：

1. 新建 TCL 示例层：instructions、FAQ、service map。
2. 在 core 加 `onBeforeToolExecute` hook。
3. 在 page-controller 加 `getElementMetadata(index)`。
4. 实现 `TclSafetyPolicy`。
5. 新增或演化客服 UI。
6. 接 telemetry。
7. 写测试用例。
