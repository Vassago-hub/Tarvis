import type { IntentEntities, IntentResult, TclIntent } from './intents'

const PRODUCT_KEYWORDS: Record<string, string[]> = {
	电视: ['电视', '黑屏', '遥控器'],
	空调: ['空调', 'E1', '不制冷', '中央空调'],
	冰箱: ['冰箱', '声音大'],
	洗衣机: ['洗衣机', '不脱水'],
	门锁: ['门锁', '智能门锁'],
}

const RULES: { intent: TclIntent; confidence: number; keywords: string[] }[] = [
	{
		intent: 'complaint',
		confidence: 0.95,
		keywords: ['投诉', '维权', '赔偿', '没人处理', '不满意'],
	},
	{ intent: 'human_support', confidence: 0.9, keywords: ['人工', '客服', '电话', '在线客服'] },
	{
		intent: 'repair_service',
		confidence: 0.86,
		keywords: ['报修', '维修', '售后', '预约', '上门'],
	},
	{
		intent: 'troubleshooting',
		confidence: 0.82,
		keywords: ['E1', '黑屏', '不制冷', '漏水', '不脱水', '异响', '没反应'],
	},
	{
		intent: 'business_or_special_service',
		confidence: 0.84,
		keywords: ['光伏', '商用显示', '中央空调', '工程产品', '加盟', '商务合作'],
	},
	{
		intent: 'site_navigation',
		confidence: 0.72,
		keywords: ['找', '在哪', '页面', '会员俱乐部', 'TCL+ APP', '产品'],
	},
]

export class IntentRouter {
	route(input: string): IntentResult {
		const text = input.trim()
		const matched = RULES.find((rule) => rule.keywords.some((keyword) => text.includes(keyword)))
		const entities = extractEntities(text)

		if (!matched) {
			return { intent: 'unknown', confidence: 0.2, entities, reason: 'No M1 rule matched.' }
		}

		return {
			intent: matched.intent,
			confidence: matched.confidence,
			entities,
			reason: `Matched keywords for ${matched.intent}.`,
		}
	}
}

function extractEntities(text: string): IntentEntities {
	const productType = Object.entries(PRODUCT_KEYWORDS).find(([, keywords]) =>
		keywords.some((keyword) => text.includes(keyword))
	)?.[0]
	const issueType = ['E1', '黑屏', '不制冷', '漏水', '不脱水', '异响', '没反应'].find((keyword) =>
		text.includes(keyword)
	)
	const targetPage = ['会员俱乐部', '商务合作', 'TCL+ APP', '电视', '空调', '智能门锁'].find(
		(keyword) => text.includes(keyword)
	)

	return { productType, issueType, targetPage }
}
