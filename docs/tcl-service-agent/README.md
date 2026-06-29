# TCL 智能服务助手开发规划文档

本文档集用于指导将 Page Agent 改造为 TCL 中国官网智能服务助手。第一阶段目标是“售后降本 + 全站导航”，不是直接替代所有人工客服能力。

## 文档索引

- [M1 功能规格](./M1-functional-spec.md)
- [M2 技术架构设计](./M2-technical-architecture.md)
- [M3 详细开发清单](./M3-development-backlog.md)
- [M4 产品体验稿](./M4-product-experience.md)
- [M5 Prompt 与业务规则设计](./M5-prompts-and-rules.md)
- [M6 测试与验收方案](./M6-testing-and-acceptance.md)
- [M7 上线与运营方案](./M7-launch-and-operations.md)
- [M8 决策清单与拍板项](./M8-decisions.md)
- [M9 实施前技术方案草图](./M9-implementation-sketch.md)

## 第一阶段范围

MVP 聚焦以下能力：

- 售后入口分流。
- 人工客服入口分流。
- 高频故障排查。
- 官网产品与服务导航。
- 商用、光伏、合作类请求分流。

明确不做：

- 自动提交维修、投诉、预约表单。
- 自动登录、支付、验证码处理。
- 价格、库存、维修费用、维修时效承诺。
- 复杂导购和内部客服系统深度对接。

## 总体原则

- 保留 Page Agent 的通用框架价值，不把 TCL 规则写死进 core。
- 所有高风险动作必须通过代码层拦截，不能只依赖 prompt。
- 用户界面应像 TCL 官方服务助手，而不是开发者调试面板。
- 遇到隐私、投诉、赔付、维修费用、账号、订单等问题时优先转人工。
- 失败时要给出明确下一步，而不是反复尝试。
