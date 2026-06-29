export type TclIntent =
	| 'human_support'
	| 'repair_service'
	| 'troubleshooting'
	| 'site_navigation'
	| 'business_or_special_service'
	| 'complaint'
	| 'unknown'

export interface IntentEntities {
	productType?: string
	issueType?: string
	targetPage?: string
}

export interface IntentResult {
	intent: TclIntent
	confidence: number
	entities: IntentEntities
	reason: string
}
