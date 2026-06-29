// English translations (base/reference language)
const enUS = {
	ui: {
		panel: {
			ready: 'Ready',
			thinking: 'Thinking...',
			taskInput: 'Enter new task, describe steps in detail, press Enter to submit',
			userAnswerPrompt: 'Please answer the question above, press Enter to submit',
			taskTerminated: 'Task terminated',
			taskCompleted: 'Task completed',
			userAnswer: 'User answer: {{input}}',
			question: 'Question: {{question}}',
			waitingPlaceholder: 'Waiting for task to start...',
			stop: 'Stop',
			close: 'Close',
			expand: 'Expand history',
			collapse: 'Collapse history',
			step: 'Step {{number}}',
			historyCardTask: '📝 Your request',
			historyCardBot: '🤖 Assistant',
			historyCardQuestion: '❓ Question',
			historyCardAnswer: '✍️ Your answer',
			historyCardError: '⚠️ Error',
		},
		customerService: {
			title: 'TCL Smart Assistant',
			processing: 'Looking into this...',
			inputPlaceholder: 'Describe your issue, e.g. "TV black screen"',
			minimized: 'Smart Assistant',
			expand: 'Expand',
			collapse: 'Collapse',
			quickActions: {
				humanSupport: 'Contact Agent',
				troubleshooting: 'Troubleshooting',
				repair: 'Request Repair',
				findProduct: 'Find Product',
			},
			confirm: {
				continue: 'Continue',
				cancel: 'Cancel',
			},
			handoff: {
				title: 'Contact TCL Customer Service',
				phone: 'Call 4008-123456',
				online: 'Online Support',
				servicePage: 'Open Service Page',
				copySummary: 'Copy summary',
				copied: 'Copied',
			},
			fallback: {
				noEntry: 'Sorry, I couldn\'t find a clear entry point. Please contact customer service.',
				captcha: 'This requires CAPTCHA verification. Please complete it manually.',
				login: 'Login required. Please complete this manually.',
			},
		},
		tools: {
			clicking: 'Clicking element [{{index}}]...',
			inputting: 'Inputting text to element [{{index}}]...',
			selecting: 'Selecting option "{{text}}"...',
			scrolling: 'Scrolling page...',
			waiting: 'Waiting {{seconds}} seconds...',
			askingUser: 'Asking user...',
			done: 'Task done',
			clicked: '🖱️ Clicked element [{{index}}]',
			inputted: '⌨️ Inputted text "{{text}}"',
			selected: '☑️ Selected option "{{text}}"',
			scrolled: '🛞 Page scrolled',
			waited: '⌛️ Wait completed',
			executing: 'Executing {{toolName}}...',
			resultSuccess: 'success',
			resultFailure: 'failed',
			resultError: 'error',
		},
		errors: {
			elementNotFound: 'No interactive element found at index {{index}}',
			taskRequired: 'Task description is required',
			executionFailed: 'Task execution failed',
			notInputElement: 'Element is not an input or textarea',
			notSelectElement: 'Element is not a select element',
			optionNotFound: 'Option "{{text}}" not found',
		},
	},
} as const

// Chinese translations (must match the structure of enUS)
const zhCN = {
	ui: {
		panel: {
			ready: '准备就绪',
			thinking: '正在思考...',
			taskInput: '输入新任务，详细描述步骤，回车提交',
			userAnswerPrompt: '请回答上面问题，回车提交',
			taskTerminated: '任务已终止',
			taskCompleted: '任务结束',
			userAnswer: '用户回答: {{input}}',
			question: '询问: {{question}}',
			waitingPlaceholder: '等待任务开始...',
			stop: '终止',
			close: '关闭',
			expand: '展开历史',
			collapse: '收起历史',
			step: '步骤 {{number}}',
			historyCardTask: '📝 用户需求',
			historyCardBot: '🤖 智能回复',
			historyCardQuestion: '❓ 助手提问',
			historyCardAnswer: '✍️ 你的回答',
			historyCardError: '⚠️ 出错了',
		},
		customerService: {
			title: 'TCL 智能服务助手',
			processing: '正在为您处理...',
			inputPlaceholder: '请输入您的问题，例如"电视黑屏怎么处理"',
			minimized: '智能客服',
			expand: '展开',
			collapse: '收起',
			quickActions: {
				humanSupport: '联系人工客服',
				troubleshooting: '故障排查',
				repair: '我要报修',
				findProduct: '查找产品',
			},
			confirm: {
				continue: '继续',
				cancel: '取消',
			},
			handoff: {
				title: '建议联系 TCL 官方客服',
				phone: '拨打 4008-123456',
				online: '在线客服',
				servicePage: '打开服务支持页',
				copySummary: '复制问题摘要',
				copied: '已复制',
			},
			fallback: {
				noEntry: '抱歉，我没能帮你找到明确的入口，建议联系人工客服',
				captcha: '这里需要输入验证码，请你手动操作',
				login: '需要登录后继续，请你手动操作',
			},
		},
		tools: {
			clicking: '正在点击元素 [{{index}}]...',
			inputting: '正在输入文本到元素 [{{index}}]...',
			selecting: '正在选择选项 "{{text}}"...',
			scrolling: '正在滚动页面...',
			waiting: '等待 {{seconds}} 秒...',
			askingUser: '正在询问用户...',
			done: '结束任务',
			clicked: '🖱️ 已点击元素 [{{index}}]',
			inputted: '⌨️ 已输入文本 "{{text}}"',
			selected: '☑️ 已选择选项 "{{text}}"',
			scrolled: '🛞 页面滚动完成',
			waited: '⌛️ 等待完成',
			executing: '正在执行 {{toolName}}...',
			resultSuccess: '成功',
			resultFailure: '失败',
			resultError: '错误',
		},
		errors: {
			elementNotFound: '未找到索引为 {{index}} 的交互元素',
			taskRequired: '任务描述不能为空',
			executionFailed: '任务执行失败',
			notInputElement: '元素不是输入框或文本域',
			notSelectElement: '元素不是选择框',
			optionNotFound: '未找到选项 "{{text}}"',
		},
	},
} as const

// Type definitions generated from English base structure (but with string values)
type DeepStringify<T> = {
	[K in keyof T]: T[K] extends string ? string : T[K] extends object ? DeepStringify<T[K]> : T[K]
}

export type TranslationSchema = DeepStringify<typeof enUS>

// Utility type: Extract all nested paths from translation object
type NestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
		? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
		: `${Key}`
}[keyof ObjectType & (string | number)]

// Extract all possible key paths from translation structure
export type TranslationKey = NestedKeyOf<TranslationSchema>

// Parameterized translation types
export type TranslationParams = Record<string, string | number>

export const locales = {
	'en-US': enUS,
	'zh-CN': zhCN,
} as const

export type SupportedLanguage = keyof typeof locales
