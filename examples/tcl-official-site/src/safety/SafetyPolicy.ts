import type { SafetyDecision, ToolExecutionContext } from 'page-agent'

const HIGH_RISK_KEYWORDS = /(漏电|烧焦味|冒烟|进水|自行拆机|压缩机异常|电路板|燃气|高温)/
const LOGIN_OR_PAYMENT_KEYWORDS =
	/(登录|注册|支付|付款|银行卡|验证码|密码|login|sign in|pay|payment|password|captcha|otp)/i

export class TclSafetyPolicy {
	evaluate(ctx: ToolExecutionContext): SafetyDecision {
		if (ctx.toolName === 'execute_javascript') {
			return {
				type: 'block',
				riskLevel: 'blocked',
				reason: 'JavaScript execution is disabled for the TCL service assistant.',
			}
		}

		const elementLabel = [
			ctx.element?.text,
			ctx.element?.ariaLabel,
			ctx.element?.name,
			ctx.element?.placeholder,
		]
			.filter(Boolean)
			.join(' ')

		if (LOGIN_OR_PAYMENT_KEYWORDS.test(elementLabel)) {
			return {
				type: 'block',
				riskLevel: 'blocked',
				reason:
					'Login, payment, password, or verification-code fields must be handled by the user.',
				userMessage: '这里涉及登录、支付、密码或验证码，请你手动操作。',
			}
		}

		if (ctx.toolName === 'input_text' && ctx.element?.isSensitiveField) {
			return {
				type: 'confirm',
				riskLevel: 'high',
				reason:
					'The target field may contain phone, address, order, password, or verification data.',
				userMessage:
					'这个输入框可能涉及手机号、地址、订单号或验证码。请确认是否继续，或你可以手动填写。',
			}
		}

		if (ctx.element?.isSubmitLike) {
			return {
				type: 'confirm',
				riskLevel: 'high',
				reason:
					'Submitting service, repair, business, or contact information requires confirmation.',
				userMessage: '即将点击提交、确认或类似按钮。请确认你已经检查过页面信息，是否继续？',
			}
		}

		if (ctx.element?.isExternalLink) {
			return {
				type: 'confirm',
				riskLevel: 'medium',
				reason: 'The action may open an external customer-service or partner system.',
				userMessage: '这个入口可能跳转到外部客服或合作系统。请确认是否继续打开。',
			}
		}

		if (HIGH_RISK_KEYWORDS.test(JSON.stringify(ctx.toolInput))) {
			return {
				type: 'confirm',
				riskLevel: 'high',
				reason: 'The request mentions a safety-risk keyword from the M1 specification.',
				userMessage:
					'这个情况可能涉及安全风险，请先断电并联系 TCL 官方售后。是否仍需要我继续查找服务入口？',
			}
		}

		return { type: 'allow', riskLevel: 'low', reason: 'No M1 safety rule matched.' }
	}
}
