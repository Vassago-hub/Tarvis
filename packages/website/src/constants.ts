// Demo build (auto-init with demo LLM, for quick testing)
export const CDN_DEMO_URL =
	'https://cdn.jsdelivr.net/npm/page-agent@1.10.0/dist/iife/page-agent.demo.js'
export const CDN_DEMO_CN_URL =
	'https://registry.npmmirror.com/page-agent/1.10.0/files/dist/iife/page-agent.demo.js'

// Demo LLM for website testing (homepage quick trial uses flash)
export const DEMO_MODEL = 'qwen3.5-flash'
export const DEMO_BASE_URL = 'https://page-ag-testing-ohftxirgbn.cn-shanghai.fcapp.run'

// ===== TCL Service Assistant Site =====

export const TCL_SERVICE_HOTLINE = '4008-123456'
export const TCL_SERVICE_EMAIL = 'service@tcl.com'
export const TCL_BRAND_NAME_ZH = 'TCL 官网'
export const TCL_BRAND_NAME_EN = 'TCL Official'
export const TCL_SERVICE_HOURS_ZH = '7×24 小时'
export const TCL_ADDRESS = {
	office: '广东省惠州市仲恺高新区TCL科技大厦',
	officeEn: 'TCL Technology Tower, Zhongkai Hi-Tech Zone, Huizhou, Guangdong, China',
	mail: '广东省惠州市仲恺高新区TCL科技大厦 客户服务中心 收',
	mailEn: 'TCL Customer Service Center, TCL Technology Tower, Zhongkai Hi-Tech Zone, Huizhou, Guangdong, China',
}

// Intent classification matrix
export const INTENT_CLASSIFICATION = [
	{ key: 'service_handoff', action: 'HANDOFF', zh: { name: '安全与紧急', desc: '涉及人身安全、冒烟、漏电等危险场景，立即转人工客服并提示断电或拨打 120/119。' }, en: { name: 'Safety & Emergency', desc: 'Safety risks such as smoke or electric leakage — immediate hand-off to human agent, with prompt to disconnect power or call emergency services.' } },
	{ key: 'complaint', action: 'HANDOFF', zh: { name: '投诉与不满', desc: '表达强烈不满、投诉、要求赔偿或升级处理，整理摘要转人工客服跟进。' }, en: { name: 'Complaint & Dissatisfaction', desc: 'Strong dissatisfaction, complaints, requests for compensation or escalation — summary is drafted and routed to human support.' } },
	{ key: 'contact', action: 'ROUTE', zh: { name: '电话与联系方式', desc: '用户查询客服电话、营业时间或地址，提供官方数字与链接。' }, en: { name: 'Phone & Contact', desc: 'User asks for support phone, business hours or address — official numbers and links are provided.' } },
	{ key: 'repair', action: 'ROUTE', zh: { name: '产品报修', desc: '用户提出产品故障并希望维修，引导到官方预约入口。' }, en: { name: 'Repair Request', desc: 'User describes a product issue and wishes to request service — routed to official booking entry.' } },
	{ key: 'troubleshoot', action: 'ASSIST', zh: { name: '故障自助排查', desc: '针对常见故障给出安全的自助排查步骤。' }, en: { name: 'Self-Service Troubleshooting', desc: 'Provides safe DIY steps for common faults.' } },
	{ key: 'site_navigation', action: 'ASSIST', zh: { name: '官网导航', desc: '帮助用户在 TCL 官网找到产品、服务和活动页面。' }, en: { name: 'Site Navigation', desc: 'Guides users to product, service and promotion pages on TCL website.' } },
	{ key: 'business', action: 'ROUTE', zh: { name: '商务与合作', desc: '企业客户、工程、光伏、加盟等商务入口。' }, en: { name: 'Business & Partnership', desc: 'Entry points for enterprise, engineering, solar and partnership inquiries.' } },
	{ key: 'pii_refuse', action: 'REFUSE', zh: { name: '隐私与敏感信息', desc: '禁止收集手机号、地址、银行卡等隐私信息；遇到此类请求拒绝操作并转人工。' }, en: { name: 'Privacy & Sensitive Data', desc: 'Collecting phone numbers, addresses or payment info is refused. User is directed to human support instead.' } },
	{ key: 'unknown', action: 'ASSIST', zh: { name: '模糊或无关请求', desc: '请用户澄清问题，或引导到最相关的入口。' }, en: { name: 'Vague / Out-of-Scope', desc: 'Asks user for clarification, or routes to the nearest entry point.' } },
]

// Top navigation items
export const NAV_ITEMS = [
	{ key: 'home', href: '/', zh: '首页', en: 'Home' },
	{ key: 'products_personal', href: '/products/personal', zh: '个人及家庭产品', en: 'Personal & Home' },
	{ key: 'products_commercial', href: '/products/commercial', zh: '商用产品', en: 'Commercial' },
	{ key: 'service', href: '/service', zh: '服务支持', en: 'Service' },
	{ key: 'partner', href: '/partner', zh: '商务合作', en: 'Partner' },
	{ key: 'ai_capabilities', href: '/ai-capabilities', zh: 'AI 助手', en: 'AI Assistant' },
	{ key: 'docs', href: '/docs/introduction/overview', zh: '开发者', en: 'Developers' },
] as const

// Personal product categories
export const PERSONAL_PRODUCTS = [
	{
		key: 'tv',
		zh: { name: '电视', desc: '4K / QD-Mini LED / 智能电视全系列' },
		en: { name: 'TV', desc: '4K / QD-Mini LED / Smart TV series' },
		icon: 'tv',
	},
	{
		key: 'ac',
		zh: { name: '空调', desc: '家用空调 / 中央空调 / 空调维护' },
		en: { name: 'Air Conditioner', desc: 'Residential / Commercial / Maintenance' },
		icon: 'ac',
	},
	{
		key: 'fridge',
		zh: { name: '冰箱', desc: '多门 / 对开门 / 嵌入式冰箱' },
		en: { name: 'Refrigerator', desc: 'Multi-door / Side-by-side / Built-in' },
		icon: 'fridge',
	},
	{
		key: 'washer',
		zh: { name: '洗衣机', desc: '滚筒 / 波轮 / 洗烘一体机' },
		en: { name: 'Washer', desc: 'Front-load / Top-load / Washer-Dryer' },
		icon: 'washer',
	},
	{
		key: 'lock',
		zh: { name: '智能门锁', desc: '人脸识别 / 指纹 / 密码 / 远程开锁' },
		en: { name: 'Smart Lock', desc: 'Face ID / Fingerprint / Passcode / Remote' },
		icon: 'lock',
	},
	{
		key: 'small',
		zh: { name: '小型家电', desc: '厨电 / 生活电器 / 个人护理' },
		en: { name: 'Small Appliances', desc: 'Kitchen / Home / Personal Care' },
		icon: 'small',
	},
] as const

// Commercial product categories
export const COMMERCIAL_PRODUCTS = [
	{
		key: 'display',
		zh: { name: '商用显示', desc: '拼接屏 / 会议平板 / 数字标牌' },
		en: { name: 'Commercial Display', desc: 'Video Wall / Collaboration Display / Digital Signage' },
	},
	{
		key: 'hvac',
		zh: { name: '中央空调', desc: '多联机 / 风冷模块 / 精密空调' },
		en: { name: 'Commercial HVAC', desc: 'VRV / Air-cooled Module / Precision AC' },
	},
	{
		key: 'engineering',
		zh: { name: '工程产品', desc: '照明 / 安防 / 智慧园区' },
		en: { name: 'Engineering', desc: 'Lighting / Security / Smart Campus' },
	},
	{
		key: 'solar',
		zh: { name: '光伏与能源', desc: '户用光伏 / 工商业光伏 / 储能' },
		en: { name: 'Solar & Energy', desc: 'Residential / Commercial PV / Energy Storage' },
	},
] as const

// Service categories
export const SERVICE_CATEGORIES = [
	{
		key: 'online',
		zh: { name: '在线客服', desc: '7×24 小时在线人工客服，即时响应你的问题' },
		en: { name: 'Online Support', desc: '24/7 live human support for instant response' },
		icon: 'chat',
	},
	{
		key: 'repair',
		zh: { name: '产品报修', desc: '预约上门维修，提交产品故障信息' },
		en: { name: 'Repair Request', desc: 'Schedule on-site repair for product issues' },
		icon: 'wrench',
	},
	{
		key: 'troubleshooting',
		zh: { name: '故障排查', desc: '常见故障排查与自助解决方案' },
		en: { name: 'Troubleshooting', desc: 'DIY guides for common product issues' },
		icon: 'search',
	},
	{
		key: 'hotline',
		zh: { name: '电话支持', desc: `全国服务热线 ${TCL_SERVICE_HOTLINE}` },
		en: { name: 'Phone Support', desc: `National hotline ${TCL_SERVICE_HOTLINE}` },
		icon: 'phone',
	},
	{
		key: 'policy',
		zh: { name: '服务政策', desc: '保修政策 / 三包凭证 / 服务条款' },
		en: { name: 'Service Policy', desc: 'Warranty / Terms of Service / Consumer rights' },
		icon: 'shield',
	},
	{
		key: 'faq',
		zh: { name: '常见问题', desc: '高频问题与标准回答' },
		en: { name: 'FAQ', desc: 'Frequently asked questions and answers' },
		icon: 'help',
	},
] as const

// Partner categories
export const PARTNER_CATEGORIES = [
	{
		key: 'join',
		zh: { name: '加盟合作', desc: '成为 TCL 合作伙伴或经销商' },
		en: { name: 'Partnership', desc: 'Become a TCL partner or distributor' },
	},
	{
		key: 'commercial_solution',
		zh: { name: '商用解决方案', desc: '面向企业客户的产品与集成方案' },
		en: { name: 'Commercial Solutions', desc: 'Enterprise products and integrated solutions' },
	},
	{
		key: 'solar',
		zh: { name: '光伏服务', desc: '户用 / 工商业光伏的设计与运维' },
		en: { name: 'Solar Service', desc: 'Residential and commercial PV design and O&M' },
	},
	{
		key: 'contact',
		zh: { name: '联系我们', desc: '商务咨询与合作入口' },
		en: { name: 'Contact Us', desc: 'Business inquiry and partnership entry' },
	},
] as const

// AI capabilities / intents
export const AI_CAPABILITIES = [
	{
		key: 'human_support',
		zh: {
			name: '转接人工客服',
			desc: '当你需要人工沟通或问题复杂时，可一键拨打或跳转在线客服。',
			example: ['我要人工客服', '帮我接在线客服', '客服电话是多少'],
		},
		en: {
			name: 'Transfer to Human Support',
			desc: 'When you need to talk to a real person, a single click connects you to our live support.',
			example: ['I need a human agent', 'Connect me to live chat', 'What is your support number?'],
		},
	},
	{
		key: 'repair_service',
		zh: {
			name: '产品报修与预约',
			desc: '识别产品类型，帮你找到报修入口，填写前协助整理信息。提交前会要求你手动确认。',
			example: ['我要报修电视', '空调坏了怎么修', '洗衣机上门维修'],
		},
		en: {
			name: 'Repair & Service Request',
			desc: 'Identifies product type, guides you to the repair entry, and helps collect information. Manual confirmation is required before submission.',
			example: ['My TV needs repair', 'Air conditioner is broken', 'On-site washer service'],
		},
	},
	{
		key: 'troubleshooting',
		zh: {
			name: '故障自助排查',
			desc: '针对电视、空调、冰箱、洗衣机等常见故障提供安全排查建议。涉及漏电、冒烟等安全问题会提醒立即断电并联系官方。',
			example: ['空调显示 E1', '电视黑屏', '冰箱声音很大', '洗衣机不脱水'],
		},
		en: {
			name: 'Self-Service Troubleshooting',
			desc: 'Provides safe troubleshooting advice for common issues with TVs, air conditioners, refrigerators and washers. For safety hazards such as electric leakage or smoke, you will be advised to power off and contact support immediately.',
			example: ['AC shows E1 error', 'TV screen is black', 'Fridge is noisy', 'Washer will not spin'],
		},
	},
	{
		key: 'site_navigation',
		zh: {
			name: '官网智能导航',
			desc: '帮你在 TCL 官网找到产品、服务、活动页面。你说想去哪里，AI 帮你直达。',
			example: ['我想买电视', '会员俱乐部在哪', '找智能门锁产品'],
		},
		en: {
			name: 'Smart Site Navigation',
			desc: 'Helps you find product, service and promotion pages on TCL website. Tell us where you want to go and we take you there.',
			example: ['I want to buy a TV', 'Where is the member club', 'Show me smart locks'],
		},
	},
	{
		key: 'business_service',
		zh: {
			name: '商用与光伏服务',
			desc: '面向企业客户的商用显示、中央空调、工程产品、光伏能源等服务入口。',
			example: ['商用显示屏方案', '企业中央空调', '光伏售后'],
		},
		en: {
			name: 'Commercial & Solar Service',
			desc: 'Commercial displays, central HVAC, engineering products and solar energy services for enterprise customers.',
			example: ['Commercial display solution', 'Central HVAC for business', 'Solar after-sales'],
		},
	},
	{
		key: 'complaint',
		zh: {
			name: '投诉与反馈',
			desc: '当你表达强烈不满或投诉时，优先帮你整理问题摘要并引导至人工客服，以便快速跟进处理。',
			example: ['我要投诉', '维修一直没人联系', '要求赔偿'],
		},
		en: {
			name: 'Complaints & Feedback',
			desc: 'When you express dissatisfaction or file a complaint, we help draft a summary and prioritize routing to human support for quick follow-up.',
			example: ['I want to file a complaint', 'No one contacted me after repair', 'Request a refund or compensation'],
		},
	},
	{
		key: 'unknown',
		zh: {
			name: '模糊或无关问题',
			desc: '当你的问题不够明确，或超出 TCL 服务范围时，AI 会请你澄清或引导到最合适的入口。',
			example: ['你们有什么产品', '怎么联系'],
		},
		en: {
			name: 'Vague or Out-of-Scope Questions',
			desc: 'When your question is unclear or outside TCL services, the AI will ask for clarification or route you to the most appropriate entry.',
			example: ['What products do you have?', 'How can I reach you?'],
		},
	},
] as const

// High-frequency FAQ list (with categories for filtering)
export const FAQ_ITEMS = [
	{
		key: 'tv_black',
		category: 'tv',
		zh: {
			q: '电视开机后黑屏，但有声音，怎么办？',
			a: '建议先检查信号线是否松动，重启机顶盒/播放器；如果是智能电视，可尝试断电 30 秒后重启。若仍出现黑屏，可能需要联系官方售后检测。',
		},
		en: {
			q: 'TV turns on but screen is black, still has audio. What should I do?',
			a: 'Check if the signal cable is loose and try restarting your set-top box / player. For smart TVs, unplug for 30 seconds then retry. If the issue persists, please contact TCL official service for inspection.',
		},
	},
	{
		key: 'ac_e1',
		category: 'ac',
		zh: {
			q: '空调显示 E1 错误代码是什么意思？',
			a: 'E1 通常代表室内外机通信故障或高压保护。请先断电重启，若仍出现相同代码，建议联系 TCL 售后安排专业人员检测，不要自行拆机。',
		},
		en: {
			q: 'What does the E1 error code on my AC mean?',
			a: 'E1 usually indicates an indoor/outdoor communication issue or high-voltage protection. Please turn off power and retry. If the code reappears, contact TCL support for professional inspection — do not attempt to disassemble the unit yourself.',
		},
	},
	{
		key: 'ac_cool',
		category: 'ac',
		zh: {
			q: '空调不制冷，出风常温？',
			a: '先确认是否选择了正确的制冷模式、温度设定低于室温；检查门窗是否关闭，滤网是否积灰；如确认设置正确且出风仍不冷，可能缺少制冷剂或压缩机故障，请联系售后。',
		},
		en: {
			q: 'Air conditioner is not cooling — the air is room temperature?',
			a: 'Confirm you selected cooling mode and the set temperature is lower than room temperature; check that doors/windows are closed and the filter is clean. If everything looks correct, the unit may be low on refrigerant or have a compressor issue — please contact service.',
		},
	},
	{
		key: 'fridge_noisy',
		category: 'fridge',
		zh: {
			q: '冰箱运行时噪音很大？',
			a: '冰箱在压缩机启动、制冷剂流动时会有轻微噪音，属于正常。如出现明显异响，请确认：① 冰箱是否放置平稳，② 是否紧贴墙面或柜体，③ 内部物品是否摆放过度拥挤。仍有问题请联系售后。',
		},
		en: {
			q: 'Why is my fridge so noisy?',
			a: 'Some noise is normal during compressor start-up and refrigerant flow. If you hear loud or unusual noise: ① make sure the fridge is on a level surface, ② ensure it is not pressed tight against a wall or cabinet, ③ avoid over-packing interior shelves. If the issue continues, contact TCL service.',
		},
	},
	{
		key: 'fridge_not_cold',
		category: 'fridge',
		zh: {
			q: '冰箱冷冻室不够冷，食物解冻？',
			a: '请检查：① 温控档位是否正确（夏季通常调至中高档），② 门封条是否密封良好（可用一张纸插入门缝测试），③ 冰箱是否长期未除霜，④ 冰箱周围是否有 10cm 以上的散热空间。如以上均正常，请联系售后检测制冷剂。',
		},
		en: {
			q: 'Freezer is not cold enough and food is defrosting?',
			a: 'Check: ① temperature setting (medium-high is typical in summer), ② door gasket seals well (try inserting a piece of paper into the gap), ③ the unit is not overdue for defrosting, ④ there is at least 10 cm of clearance around the fridge for ventilation. If all looks fine, contact service to inspect refrigerant levels.',
		},
	},
	{
		key: 'washer_spin',
		category: 'washer',
		zh: {
			q: '洗衣机不脱水或脱水时震动大？',
			a: '常见原因：① 衣物放置不均导致偏心，② 底部运输螺栓未拆除（新机），③ 地面不平稳。可尝试重新分布衣物、检查运输螺栓是否已拆除、调整地脚螺丝。如果报错代码持续显示，请联系售后。',
		},
		en: {
			q: 'Washer will not spin, or shakes heavily during spin cycle?',
			a: 'Common causes: ① uneven load distribution, ② shipping bolts not removed (new unit), ③ unstable floor. Try redistributing the laundry, check the shipping bolts, and adjust the levelling feet. If error codes persist, contact service.',
		},
	},
	{
		key: 'washer_leak',
		category: 'washer',
		zh: {
			q: '洗衣机底部漏水？',
			a: '请检查：① 排水管接口是否松动或破裂，② 洗涤剂是否过量导致泡沫溢出，③ 门密封圈是否有异物或破损。如无法定位问题，请联系售后安排检测。',
		},
		en: {
			q: 'Water leaking from under the washer?',
			a: 'Check: ① whether the drain hose connection is loose or cracked, ② if excessive detergent is causing foam overflow, ③ if the door gasket has debris or damage. If you cannot locate the issue, contact service for inspection.',
		},
	},
	{
		key: 'lock_battery',
		category: 'lock',
		zh: {
			q: '智能门锁电池多久换一次？没电了怎么办？',
			a: '通常 6-12 个月更换一次，低电量时门锁会有提示。如完全没电，可使用外接 Type-C 充电宝临时供电开锁，或使用机械钥匙。建议平时保留一把机械钥匙在门外安全位置。',
		},
		en: {
			q: 'How often should I replace the batteries in my smart lock? What if it dies?',
			a: 'Batteries typically last 6-12 months; the lock prompts you when power is low. If fully drained, use an external Type-C power bank to boot it temporarily, or use the mechanical key. We recommend keeping one mechanical key outside for emergency access.',
		},
	},
	{
		key: 'lock_fingerprint',
		category: 'lock',
		zh: {
			q: '智能门锁指纹识别不准或失败率高？',
			a: '请确保手指干净、干燥；按压力度适中，接触面积足够大。天气寒冷干燥时可尝试先温暖手指后再识别。如问题频繁出现，建议重新录入指纹，选择不同角度录入多份。',
		},
		en: {
			q: 'Smart lock fingerprint recognition keeps failing?',
			a: 'Make sure your finger is clean and dry; apply moderate pressure and ensure sufficient surface contact. In cold, dry weather try warming your finger first. If issues persist, re-enroll your fingerprint from multiple angles.',
		},
	},
	{
		key: 'tv_cast',
		category: 'tv',
		zh: {
			q: '电视无法投屏怎么办？',
			a: '请确认：① 手机和电视连接同一个 Wi-Fi 网络，② 电视端投屏功能已开启，③ 路由器没有启用 AP 隔离。如果仍失败，请重启手机、电视和路由器后再尝试。',
		},
		en: {
			q: 'Why cannot I cast to my TV?',
			a: 'Please verify: ① your phone and TV are on the same Wi-Fi network, ② the casting feature is enabled on your TV, ③ AP isolation is not enabled on your router. If still failing, restart your phone, TV and router then retry.',
		},
	},
	{
		key: 'ac_remote',
		category: 'ac',
		zh: {
			q: '空调遥控器没反应？',
			a: '先确认遥控器电池有电且正负极正确；用手机摄像头对准遥控器红外发射头，按下按键时应能看到发红光（手机屏幕中）。如果无红光，说明遥控器故障；如有红光但空调无反应，请检查空调电源或联系售后。',
		},
		en: {
			q: 'AC remote does nothing when pressed?',
			a: 'Make sure batteries are inserted correctly and still have power. Point the remote IR emitter at your phone camera — you should see a red flash on screen when pressing buttons. If no flash, the remote is defective. If you see the flash but the AC does nothing, check AC power or contact support.',
		},
	},
	{
		key: 'tv_wifi',
		category: 'tv',
		zh: {
			q: '智能电视连不上 Wi-Fi 怎么办？',
			a: '请按此顺序排查：① 确认其他设备能连接同一 Wi-Fi（确认路由器正常），② 在电视中"忘记网络"后重新连接，③ 将路由器重启后再试，④ 确认路由器频段（2.4GHz 兼容性更好）。如仍无法连接，可能是电视 Wi-Fi 模块故障。',
		},
		en: {
			q: 'Smart TV cannot connect to Wi-Fi?',
			a: 'Troubleshoot in this order: ① verify other devices can connect to the same Wi-Fi (router works), ② "forget network" on the TV and reconnect, ③ restart your router and retry, ④ try the 2.4 GHz band (better compatibility). If still failing, the Wi-Fi module may need inspection.',
		},
	},
	{
		key: 'small_rice_cooker',
		category: 'small',
		zh: {
			q: '电饭煲煮不熟饭或底部烧焦？',
			a: '请确认：① 内胆与发热盘之间无异物，接触良好，② 水量与米量比例合适，③ 选择了正确的煮饭模式。如底部经常烧焦，可能是内胆底部变形或发热盘温度异常，建议联系售后检测。',
		},
		en: {
			q: 'Rice cooker undercooks or burns the bottom?',
			a: 'Check: ① there is no debris between the inner pot and heating plate, ② water-to-rice ratio is correct, ③ the correct cooking mode is selected. If bottom burning is frequent, the inner pot may be deformed or the heating plate may have temperature issues — contact service.',
		},
	},
	{
		key: 'general_warranty',
		category: 'general',
		zh: {
			q: 'TCL 产品保修多久？',
			a: '不同产品保修期限不同。一般整机 1 年，主要部件 3 年；具体以产品说明书和 TCL 官方保修政策为准。你可以在本页的"服务政策"中查看详细条款。',
		},
		en: {
			q: 'How long is the warranty on TCL products?',
			a: 'Warranty terms vary by product. Typically 1 year for the whole unit and 3 years for major components; refer to your product manual and official TCL warranty policy for exact terms. See "Service Policy" on this site for more details.',
		},
	},
	{
		key: 'general_repair',
		category: 'general',
		zh: {
			q: '如何预约上门维修？',
			a: '你可以拨打全国服务热线 4008-123456 预约，也可以在本页点击"产品报修"进入官方预约入口。填写前请准备好：产品型号、购买时间、故障现象、所在城市与地址。',
		},
		en: {
			q: 'How do I schedule an on-site repair?',
			a: 'Call the national service hotline 4008-123456, or click "Repair Request" on this site to access the official booking entry. Before submitting, please have ready: product model, purchase date, symptom description, and your city and address.',
		},
	},
	{
		key: 'safety_smoke',
		category: 'safety',
		zh: {
			q: '电器冒烟或有烧焦味？',
			a: '请立即断电并停止使用，不要自行拆机检查。这是安全隐患，建议直接拨打 TCL 全国服务热线 4008-123456 或联系当地官方售后处理。',
		},
		en: {
			q: 'My appliance is smoking or smells like burning plastic?',
			a: 'Please unplug immediately and stop using the appliance. Do not attempt to open or inspect it yourself. This is a safety hazard — call the TCL national hotline 4008-123456 or contact your local official service team right away.',
		},
	},
	{
		key: 'complaint_contact',
		category: 'general',
		zh: {
			q: '我对维修处理不满意，想投诉或反馈？',
			a: '抱歉给你带来不好的体验。你可以拨打服务热线 4008-123456 选择"投诉与建议"，或联系在线客服说明你的情况。我们会有专人跟进处理。',
		},
		en: {
			q: 'I am not satisfied with the repair — how can I file a complaint or give feedback?',
			a: 'Sorry for the bad experience. Please call the service hotline 4008-123456 and select "complaints & feedback", or reach out to online customer support and describe your situation. A dedicated team will follow up with you.',
		},
	},
] as const

// FAQ categories for UI filtering
export const FAQ_CATEGORIES = [
	{ key: 'all', zh: '全部问题', en: 'All' },
	{ key: 'tv', zh: '电视', en: 'TV' },
	{ key: 'ac', zh: '空调', en: 'Air Conditioner' },
	{ key: 'fridge', zh: '冰箱', en: 'Refrigerator' },
	{ key: 'washer', zh: '洗衣机', en: 'Washer' },
	{ key: 'lock', zh: '智能门锁', en: 'Smart Lock' },
	{ key: 'small', zh: '小家电', en: 'Small Appliances' },
	{ key: 'general', zh: '通用/政策', en: 'General / Policy' },
	{ key: 'safety', zh: '安全问题', en: 'Safety' },
] as const

// ===== Extended data for secondary pages =====

// Product models / series for product detail pages
export const PRODUCT_MODELS = [
	// --- TVs ---
	{
		key: 'tv_qled_pro',
		category: 'tv',
		zh: {
			name: 'QD-Mini LED 智屏 Pro 系列',
			desc: '旗舰画质，搭载千级分区 Mini LED 背光与量子点广色域技术，适合追求极致画质的家庭。',
			highlights: ['千级分区 Mini LED', '量子点广色域', '144Hz 高刷', 'AI 画质优化'],
			specs: '65/75/85/98 英寸 · 4K · 144Hz · Mini LED',
		},
		en: {
			name: 'QD-Mini LED Pro Series',
			desc: 'Flagship picture quality with thousands of Mini LED zones and quantum dot wide color gamut.',
			highlights: ['Thousands of Mini LED zones', 'Quantum Dot wide color', '144Hz refresh', 'AI picture enhancement'],
			specs: '65/75/85/98 inch · 4K · 144Hz · Mini LED',
		},
		warranty_months: 36,
	},
	{
		key: 'tv_4k_smart',
		category: 'tv',
		zh: {
			name: '4K 智能电视系列',
			desc: '主流尺寸覆盖，性价比之选，支持 HDR10+、MEMC 运动补偿与智能语音。',
			highlights: ['4K HDR10+', 'MEMC 运动补偿', '远场语音', '多屏互动'],
			specs: '43/50/55/65/75 英寸 · 4K · 60Hz · 智能',
		},
		en: {
			name: '4K Smart TV Series',
			desc: 'Wide size coverage with great value. HDR10+, MEMC motion compensation and smart voice.',
			highlights: ['4K HDR10+', 'MEMC motion compensation', 'Far-field voice', 'Multi-screen'],
			specs: '43/50/55/65/75 inch · 4K · 60Hz · Smart',
		},
		warranty_months: 24,
	},
	// --- AC ---
	{
		key: 'ac_inverter',
		category: 'ac',
		zh: {
			name: '一级能效变频空调',
			desc: '一级能效变频压缩机，快速制冷制热，APP 远程控制，自清洁功能。',
			highlights: ['一级能效 APF 5.3', '变频压缩机', 'WiFi 远程控制', '56°C 高温自清洁'],
			specs: '1/1.5/2/3 匹 · 变频 · R32 冷媒',
		},
		en: {
			name: 'Inverter AC (1st class efficiency)',
			desc: 'Top-tier efficiency inverter compressor with fast cooling/heating, app remote control and self-cleaning.',
			highlights: ['1st class APF 5.3', 'Inverter compressor', 'WiFi remote', '56°C self-clean'],
			specs: '1/1.5/2/3 HP · Inverter · R32',
		},
		warranty_months: 36,
	},
	{
		key: 'ac_central',
		category: 'ac',
		zh: {
			name: '家用中央空调',
			desc: '多联机系统，一台外机驱动多台内机，灵活控制每个房间的温度。',
			highlights: ['多联机', '静音内机', '分区控温', '节能模式'],
			specs: '3HP-6HP 外机 · 多内机联动',
		},
		en: {
			name: 'Residential Central AC',
			desc: 'Multi-split system: one outdoor unit drives multiple indoor units with per-room temperature control.',
			highlights: ['Multi-split', 'Quiet indoor units', 'Zone control', 'Eco mode'],
			specs: '3HP-6HP outdoor · multi indoor',
		},
		warranty_months: 36,
	},
	// --- Fridges ---
	{
		key: 'fridge_sbs',
		category: 'fridge',
		zh: {
			name: '对开门冰箱',
			desc: '超大容量对开门设计，风冷无霜双循环，金属风道与智能温控。',
			highlights: ['500-650L 超大容量', '风冷无霜', '双循环系统', '一级能效'],
			specs: '500/550/600/650L · 对开门 · 风冷无霜',
		},
		en: {
			name: 'Side-by-Side Refrigerator',
			desc: 'Large capacity side-by-side design with frost-free dual-circulation cooling and smart temperature control.',
			highlights: ['500-650L capacity', 'Frost-free', 'Dual circulation', '1st class efficiency'],
			specs: '500/550/600/650L · Side-by-side · Frost-free',
		},
		warranty_months: 12,
	},
	{
		key: 'fridge_multi_door',
		category: 'fridge',
		zh: {
			name: '法式多门冰箱',
			desc: '多温区精细分类存储，变温室可在冷藏与冷冻之间灵活切换。',
			highlights: ['3-5 门设计', '宽幅变温室', '-32°C 深冷冻', '净味杀菌'],
			specs: '400-500L · 多门 · 变频压缩机',
		},
		en: {
			name: 'French Multi-Door Refrigerator',
			desc: 'Multiple temperature zones for precise storage, with a convertible zone that switches between fridge and freezer.',
			highlights: ['3-5 door designs', 'Convertible zone', '-32°C deep freeze', 'Odor & bacteria control'],
			specs: '400-500L · Multi-door · Inverter compressor',
		},
		warranty_months: 12,
	},
	// --- Washers ---
	{
		key: 'washer_frontload',
		category: 'washer',
		zh: {
			name: '滚筒洗衣机/洗烘一体机',
			desc: '大容量滚筒洗衣机，部分型号集成热泵烘干功能，满足一站式洗烘需求。',
			highlights: ['10/12kg 大容量', '高温蒸汽除菌', '热泵烘干', '静音 BLDC 电机'],
			specs: '8/10/12kg 洗涤 · 6/8kg 烘干',
		},
		en: {
			name: 'Front-Load Washer & Washer-Dryer',
			desc: 'Large capacity front-load washers, some with integrated heat pump drying — a one-stop wash and dry solution.',
			highlights: ['10/12kg capacity', 'Steam sanitize', 'Heat pump drying', 'Quiet BLDC motor'],
			specs: '8/10/12kg wash · 6/8kg dry',
		},
		warranty_months: 12,
	},
	{
		key: 'washer_topload',
		category: 'washer',
		zh: {
			name: '波轮洗衣机',
			desc: '经典波轮设计，使用方便，性价比高，适合对容量和预算有要求的家庭。',
			highlights: ['8/10kg 容量', '免清洗内桶', '多种洗涤程序', '一键脱水'],
			specs: '8/10kg 波轮 · 顶开式',
		},
		en: {
			name: 'Top-Load Washer',
			desc: 'Classic top-load design with simple operation and great value for budget-conscious families.',
			highlights: ['8/10kg capacity', 'Self-clean tub', 'Multiple wash programs', 'One-key spin'],
			specs: '8/10kg top-load',
		},
		warranty_months: 12,
	},
	// --- Smart locks ---
	{
		key: 'lock_face',
		category: 'lock',
		zh: {
			name: '人脸识别智能门锁',
			desc: '3D 结构光人脸识别，开门无需动手；同时支持指纹、密码、卡片、手机开锁。',
			highlights: ['3D 人脸识别', '指纹/密码/卡/NFC', '远程临时密码', '低电量提醒'],
			specs: '锂电池 · Type-C 应急供电 · 机械钥匙备份',
		},
		en: {
			name: '3D Face Recognition Smart Lock',
			desc: '3D structured-light face recognition for hands-free unlocking; also supports fingerprint, password, card and phone.',
			highlights: ['3D face recognition', 'Fingerprint/password/card/NFC', 'Remote temp codes', 'Low-battery alert'],
			specs: 'Li-ion battery · Type-C backup · Mechanical key',
		},
		warranty_months: 36,
	},
	{
		key: 'lock_fingerprint',
		category: 'lock',
		zh: {
			name: '指纹密码智能门锁',
			desc: '高性价比经典型号，半导体指纹+密码+卡片多种方式开锁。',
			highlights: ['半导体指纹识别', '虚位密码防偷窥', 'C 级锁芯', '防撬报警'],
			specs: '指纹/密码/卡片/钥匙 · 电池',
		},
		en: {
			name: 'Fingerprint & Password Smart Lock',
			desc: 'Affordable classic model with semiconductor fingerprint, password and card access methods.',
			highlights: ['Semiconductor fingerprint', 'Peeping-protected password', 'C-class core', 'Tamper alarm'],
			specs: 'FP / Password / Card / Key · Battery',
		},
		warranty_months: 36,
	},
	// --- Commercial ---
	{
		key: 'commercial_display',
		category: 'commercial_display',
		zh: {
			name: '商用拼接屏 / 会议平板',
			desc: '超窄边框 LCD 拼接屏与 4K 交互式会议平板，适用于监控中心、会议室与数字标牌。',
			highlights: ['0.88/1.8/3.5mm 拼缝', '4K 会议平板', '触控书写', '视频会议集成'],
			specs: '46/49/55/65 寸 · 7×24 小时运行',
		},
		en: {
			name: 'Commercial Video Wall / Interactive Display',
			desc: 'Ultra-narrow bezel LCD video walls and 4K interactive displays for control rooms, meeting rooms and digital signage.',
			highlights: ['0.88/1.8/3.5mm bezel', '4K interactive panels', 'Touch writing', 'Video-conference ready'],
			specs: '46/49/55/65 inch · 24/7 rated',
		},
		warranty_months: 36,
	},
	{
		key: 'commercial_hvac',
		category: 'commercial_hvac',
		zh: {
			name: '商用中央空调',
			desc: '多联机、风冷模块、精密空调多种方案，适配写字楼、酒店、工厂与数据中心。',
			highlights: ['VRV 多联机', '风冷模块机组', '精密空调', '集中控制与计费'],
			specs: '按需定制 · 工程报价',
		},
		en: {
			name: 'Commercial HVAC',
			desc: 'VRV multi-split, air-cooled modular and precision AC solutions for offices, hotels, factories and data centers.',
			highlights: ['VRV multi-split', 'Air-cooled modules', 'Precision AC', 'Central control & billing'],
			specs: 'Custom designed · Project quotation',
		},
		warranty_months: 24,
	},
	{
		key: 'commercial_engineering',
		category: 'commercial_engineering',
		zh: {
			name: '工程照明与安防',
			desc: 'LED 工业照明、安防监控与智慧园区集成解决方案。',
			highlights: ['LED 工矿灯', '高清 IP 摄像机', '智慧园区平台', '节能改造'],
			specs: '工程方案定制',
		},
		en: {
			name: 'Engineering Lighting & Security',
			desc: 'LED industrial lighting, security cameras and smart-campus integration solutions.',
			highlights: ['LED industrial fixtures', 'HD IP cameras', 'Smart campus platform', 'Energy retrofit'],
			specs: 'Custom engineered solutions',
		},
		warranty_months: 24,
	},
	{
		key: 'commercial_solar',
		category: 'commercial_solar',
		zh: {
			name: '光伏与储能系统',
			desc: '户用分布式、工商业屋顶光伏与配套储能电池系统，提供设计-安装-运维全流程服务。',
			highlights: ['单晶 PERC / TOPCon 组件', '并网/离网逆变器', '磷酸铁锂储能', '全流程 EPC'],
			specs: '5kW-500kW+ 系统设计',
		},
		en: {
			name: 'Solar & Energy Storage',
			desc: 'Residential distributed, commercial rooftop solar and integrated battery storage — turn-key design, install and O&M.',
			highlights: ['Mono PERC / TOPCon modules', 'Grid-tie / off-grid inverters', 'LiFePO4 storage', 'Full EPC service'],
			specs: '5kW-500kW+ system design',
		},
		warranty_months: 120,
	},
]

// Step-by-step troubleshooting guides per product category
export const TROUBLESHOOTING_GUIDES = [
	{
		key: 'tv',
		zh: { name: '电视', desc: '常见电视问题排查与解决步骤' },
		en: { name: 'TV', desc: 'Step-by-step troubleshooting for common TV issues' },
		issues: [
			{
				zh: {
					title: '开机后黑屏（有声音）',
					steps: [
						'确认电源指示灯状态；橙色或红色待机状态请按遥控器开机键。',
						'检查 HDMI/AV 信号线是否松动，拔出后重新插入。',
						'切换信号源（例如从 HDMI1 切到 HDMI2 或电视直播），确认是否某个输入源的问题。',
						'将电视断电 30 秒后重新通电，尝试恢复出厂设置（会清除用户数据，需谨慎）。',
					],
					danger: '注意：请不要自行打开电视后盖，尤其是大屏幕高压部件，可能造成触电风险。',
				},
				en: {
					title: 'Black screen but sound is on',
					steps: [
						'Check the power indicator; if it is orange or red, press the power button on the remote.',
						'Re-seat HDMI / AV cables — unplug and re-plug firmly.',
						'Switch input sources (e.g. from HDMI1 to HDMI2 or TV broadcast) to rule out a specific source.',
						'Unplug the TV for 30 seconds, then retry; consider factory reset (this erases user data, be careful).',
					],
					danger: 'WARNING: Never open the TV rear cover, especially large-panel models — high-voltage components present an electric shock risk.',
				},
			},
			{
				zh: {
					title: '无法连接 Wi-Fi',
					steps: [
						'用手机确认同一路由器的 Wi-Fi 是否正常，排除网络侧问题。',
						'在电视设置中"忘记此网络"，重新搜索并输入密码连接。',
						'重启路由器（断电 10 秒后重新通电）。',
						'尝试连接路由器的 2.4GHz 频段（智能电视对该频段兼容性更好）。',
						'如果仍失败，电视 Wi-Fi 模块可能异常，请联系售后。',
					],
				},
				en: {
					title: 'Cannot connect to Wi-Fi',
					steps: [
						'Verify Wi-Fi works on your phone to rule out network issues.',
						'"Forget network" in the TV settings, then re-scan and re-enter password.',
						'Restart the router (unplug 10 seconds then retry).',
						'Try the 2.4 GHz band — smart TVs typically have better compatibility with it.',
						'If still failing, the Wi-Fi module may need service — contact support.',
					],
				},
			},
			{
				zh: {
					title: '投屏失败',
					steps: [
						'手机与电视必须连接到同一个 Wi-Fi 网络（不能一个连 Wi-Fi 一个连 4G/5G）。',
						'确认电视已开启投屏/多屏互动功能（设置中搜索"投屏"或"多屏"）。',
						'路由器请勿启用"AP 隔离"或"访客网络隔离"。',
						'重启手机、电视和路由器后再试。',
					],
				},
				en: {
					title: 'Screen casting fails',
					steps: [
						'Both phone and TV must be on the same Wi-Fi network (not one on Wi-Fi and one on 4G/5G).',
						'Ensure the TV has casting / screen-sharing enabled (search for "cast" or "miracast" in settings).',
						'Ensure "AP isolation" or "guest network isolation" is disabled on the router.',
						'Restart phone, TV and router, then retry.',
					],
				},
			},
		],
	},
	{
		key: 'ac',
		zh: { name: '空调', desc: '常见空调问题排查与解决步骤' },
		en: { name: 'Air Conditioner', desc: 'Step-by-step troubleshooting for common AC issues' },
		issues: [
			{
				zh: {
					title: '空调不制冷',
					steps: [
						'确认已选择"制冷"模式，设定温度低于室温（一般设置 24-26°C）。',
						'关闭门窗，避免阳光直晒室内机。',
						'清洗/更换空气滤网（建议每 2-4 周检查一次）。',
						'确认室外机是否正常运行（是否断电、被遮挡或被风吹出的热气循环回进风口）。',
						'如以上正常但仍不制冷，可能是制冷剂不足或压缩机故障，请联系售后。',
					],
				},
				en: {
					title: 'AC not cooling',
					steps: [
						'Ensure "Cooling" mode is selected and the set temperature is lower than room temperature (typically 24-26°C).',
						'Close doors/windows; avoid direct sunlight hitting the indoor unit.',
						'Clean / replace the air filter (check every 2-4 weeks).',
						'Verify the outdoor unit is running, powered, and not covered or recirculating its own hot exhaust.',
						'If the above is fine but cooling is still weak — refrigerant may be low or the compressor faulty — contact service.',
					],
				},
			},
			{
				zh: {
					title: '显示 E1 / 故障代码',
					steps: [
						'E1 通常表示室内外机通信异常或高压保护。',
						'整机断电 30 秒后重新通电，观察是否恢复正常。',
						'如重启后立即跳回 E1，请勿强行开机，联系 TCL 售后安排上门检测。',
					],
					danger: '警告：切勿自行拆开机壳检修，涉及高压与冷媒系统操作，须由认证工程师处理。',
				},
				en: {
					title: 'E1 or fault code on display',
					steps: [
						'E1 typically indicates indoor/outdoor communication failure or high-pressure protection.',
						'Power off the whole unit for 30 seconds then retry.',
						'If E1 reappears immediately, do not force it on — contact TCL support for professional on-site inspection.',
					],
					danger: 'WARNING: Never attempt to open the unit yourself — high voltage and refrigerant systems must be handled by certified technicians.',
				},
			},
			{
				zh: {
					title: '遥控器无反应',
					steps: [
						'更换新电池，注意正负极方向。',
						'用手机摄像头对准遥控器红外发射头，按下按键应能在手机屏幕上看到红光闪烁。',
						'无红光 = 遥控器故障，请购买同型号遥控器；有红光但空调无反应，请联系售后检测空调接收板。',
					],
				},
				en: {
					title: 'Remote control does nothing',
					steps: [
						'Replace batteries and double-check polarity (+/-).',
						'Point the remote IR emitter at your phone camera and press a button — you should see a red flash on screen.',
						'No flash = remote defective (buy a compatible replacement); flash visible but AC ignores = IR receiver on AC may need service.',
					],
				},
			},
		],
	},
	{
		key: 'fridge',
		zh: { name: '冰箱', desc: '常见冰箱问题排查与解决步骤' },
		en: { name: 'Refrigerator', desc: 'Step-by-step troubleshooting for common refrigerator issues' },
		issues: [
			{
				zh: {
					title: '噪音大',
					steps: [
						'冰箱放置是否平稳（四角均需落地），可调整地脚螺丝使冰箱稳定。',
						'确保冰箱与墙面/柜体之间有 10cm 以上的间距，避免震动传导与共鸣。',
						'压缩机启动时会有轻微噪音，属于正常现象；但听到撞击声或金属摩擦声时请停止使用并联系售后。',
					],
				},
				en: {
					title: 'Excessive noise',
					steps: [
						'Ensure the fridge stands on a level surface; adjust levelling feet if needed.',
						'Leave at least 10 cm of clearance from walls and cabinets to avoid vibration transfer and resonance.',
						'Some noise during compressor start-up is normal; but if you hear banging or metal-rubbing, stop using and contact support.',
					],
				},
			},
			{
				zh: {
					title: '冷冻室不够冷 / 食物解冻',
					steps: [
						'检查温控档位（夏季通常调至中档或偏高）。',
						'将一张薄纸插入门缝测试密封：如能轻易抽出，门封条需要清理或更换。',
						'直冷冰箱：如蒸发器结霜厚度超过 5mm，请执行手动除霜。',
						'确认冰箱周围至少保留 10cm 的散热间距。',
						'如上述检查均正常，请联系售后检测制冷剂或压缩机。',
					],
				},
				en: {
					title: 'Freezer not cold enough / food is defrosting',
					steps: [
						'Check temperature dial setting (medium-high is typical in summer).',
						'Try pulling a thin piece of paper out of the closed door — if it slips out easily, the gasket needs cleaning or replacement.',
						'Direct-cooling fridges: if frost on evaporator exceeds 5 mm, manually defrost.',
						'Ensure at least 10 cm of clearance around the fridge for proper heat dissipation.',
						'If all the above is fine, contact service to inspect refrigerant / compressor.',
					],
				},
			},
		],
	},
	{
		key: 'washer',
		zh: { name: '洗衣机', desc: '常见洗衣机问题排查与解决步骤' },
		en: { name: 'Washer', desc: 'Step-by-step troubleshooting for common washer issues' },
		issues: [
			{
				zh: {
					title: '不脱水 / 脱水时剧烈震动',
					steps: [
						'衣物放置不均，建议取出后均匀抖散重新放入；大件与小件混合可平衡重量。',
						'如果是新机，请确认背面的 4 颗运输螺栓是否已拆除。',
						'调整机器位置与地脚螺丝，确保四脚均稳固落地。',
						'如屏幕显示错误代码且持续出现，请联系售后。',
					],
				},
				en: {
					title: 'Won\'t spin / shakes violently during spin',
					steps: [
						'Redistribute laundry; mixing large and small items helps balance the load.',
						'For a new unit, confirm that the 4 shipping bolts on the back have been removed.',
						'Adjust the levelling feet so the machine stands stable on all four corners.',
						'If an error code appears repeatedly, contact service.',
					],
				},
			},
			{
				zh: {
					title: '漏水',
					steps: [
						'检查排水管是否松动、破裂或位置过高（应低于洗衣机排水口）。',
						'洗涤剂过量会造成泡沫溢出，下次请减量。',
						'打开机门，检查门密封圈是否夹有异物或有明显破损。',
						'如不能准确定位漏点，请联系售后。',
					],
				},
				en: {
					title: 'Water leaking',
					steps: [
						'Check the drain hose for loose fitting, cracks, or being placed too high (must sit lower than drain port).',
						'Excess detergent causes foam overflow — reduce detergent next time.',
						'Open the door and inspect the door gasket for trapped debris or visible damage.',
						'If the leak point cannot be identified, contact service.',
					],
				},
			},
		],
	},
	{
		key: 'lock',
		zh: { name: '智能门锁', desc: '常见智能门锁问题排查与解决步骤' },
		en: { name: 'Smart Lock', desc: 'Step-by-step troubleshooting for common smart lock issues' },
		issues: [
			{
				zh: {
					title: '指纹识别失败',
					steps: [
						'手指保持清洁、干燥，按压力度适中并覆盖足够大的识别区。',
						'寒冷干燥季节可先温暖手指再试。',
						'删除原有指纹，从多个不同角度重新录入同一手指。',
						'如仍频繁失败，识别窗口可能有污渍/划痕，请联系售后。',
					],
				},
				en: {
					title: 'Fingerprint recognition keeps failing',
					steps: [
						'Keep your finger clean and dry; apply moderate pressure and sufficient contact area.',
						'In cold/dry weather, warm your finger first then retry.',
						'Delete the existing enrollment and re-register the same finger from multiple angles.',
						'If failure persists, the sensor window may be scratched or dirty — contact service.',
					],
				},
			},
			{
				zh: {
					title: '电池没电 / 开不了门',
					steps: [
						'使用 Type-C 外接充电宝接入门锁底部应急供电口，即可通电开门。',
						'使用机械钥匙开锁（请务必保留至少一把机械钥匙在门外安全处）。',
						'开门后立即更换新电池。',
					],
				},
				en: {
					title: 'Battery dead / cannot unlock',
					steps: [
						'Plug an external Type-C power bank into the emergency power port at the bottom of the lock — it will boot and allow unlocking.',
						'Use the mechanical key (keep at least one outside in a safe place).',
						'Replace batteries immediately after opening the door.',
					],
				},
			},
		],
	},
]

// Warranty policy structured data
export const WARRANTY_POLICY = {
	zh: {
		title: '保修政策与服务承诺',
		intro: 'TCL 承诺为所售产品提供符合国家规定与品牌承诺的保修服务。以下为家用产品通用保修政策，具体条款以产品说明书与购机凭证为准。',
		coverage: [
			{ product: '电视', whole: '整机 1 年', major: '主要部件 3 年' },
			{ product: '空调', whole: '整机 1 年', major: '压缩机 3 年，主要部件 3 年' },
			{ product: '冰箱 / 冷柜', whole: '整机 1 年', major: '压缩机 3 年' },
			{ product: '洗衣机 / 干衣机', whole: '整机 1 年', major: '电机 3 年' },
			{ product: '智能门锁', whole: '整机 1 年', major: '主要电子部件 3 年' },
			{ product: '小家电', whole: '整机 1 年', major: '主要部件 1 年' },
			{ product: '商用显示 / 商用空调', whole: '整机 1 年', major: '主要部件 2-3 年' },
			{ product: '光伏系统', whole: '整机 2 年', major: '组件 10-12 年产品质保 / 25 年性能质保' },
		],
		excluded: [
			'人为损坏、误用、改装、自行拆装造成的故障',
			'不可抗力（水浸、火灾、雷击、地震等）造成的故障',
			'未按说明书要求进行日常维护（如滤网/冷凝器积灰）造成的问题',
			'已过保修期的产品',
			'耗材（如遥控器、灯泡、滤网、门封条、电池等）的正常损耗',
		],
		required_docs: ['购机发票（主要凭证）', '产品保修卡', '购买时的订单截图或商家证明（如有）'],
		service_flow: [
			'拨打 4008-123456 或在本站提交报修 → 客服核实信息 → 安排工程师上门或送修 → 现场/车间检测 → 报价并确认是否维修 → 维修完成并提供保修单',
		],
		note: '部分产品或地区的保修条款可能有所不同，请以购买时随附的正式保修条款为准。如维修过程中涉及非 TCL 原厂部件或超出保修范围，将按保外收费处理。',
	},
	en: {
		title: 'Warranty Policy & Service Commitment',
		intro: 'TCL commits to providing warranty service for sold products compliant with local regulations and brand promises. Below are general terms for home-use products — exact terms are governed by the product manual and purchase proof.',
		coverage: [
			{ product: 'TV', whole: 'Whole unit 1 year', major: 'Major components 3 years' },
			{ product: 'Air conditioner', whole: 'Whole unit 1 year', major: 'Compressor 3 years, major parts 3 years' },
			{ product: 'Refrigerator / Freezer', whole: 'Whole unit 1 year', major: 'Compressor 3 years' },
			{ product: 'Washer / Dryer', whole: 'Whole unit 1 year', major: 'Motor 3 years' },
			{ product: 'Smart lock', whole: 'Whole unit 1 year', major: 'Key electronic parts 3 years' },
			{ product: 'Small appliances', whole: 'Whole unit 1 year', major: 'Major components 1 year' },
			{ product: 'Commercial display / HVAC', whole: 'Whole unit 1 year', major: 'Major parts 2-3 years' },
			{ product: 'Solar systems', whole: 'System 2 years', major: 'Modules 10-12 years product / 25 years performance' },
		],
		excluded: [
			'Damage caused by misuse, modification, unauthorized disassembly or user-caused physical damage',
			'Damage from force majeure (flood, fire, lightning strike, earthquake)',
			'Failures caused by failure to perform routine maintenance as described in the manual (e.g., dirty filters / condensers)',
			'Product past its warranty period',
			'Normal wear-and-tear of consumables (remotes, bulbs, filters, gaskets, batteries)',
		],
		required_docs: ['Purchase invoice (primary proof)', 'Product warranty card', 'Order screenshot or merchant proof if applicable'],
		service_flow: [
			'Call 4008-123456 or submit a repair request on this site → support verifies → engineer dispatch or drop-off → on-site / workshop inspection → quote & approval → repair completed with service slip provided',
		],
		note: 'Terms may vary by product and region; the formal warranty card that ships with the product governs. Repairs using non-TCL parts or performed out of warranty are billed on an out-of-warranty basis.',
	},
}

// Partnership programs detail
export const PARTNER_PROGRAMS = [
	{
		key: 'retail',
		zh: {
			name: '零售加盟 / 专卖店合作',
			intro: '成为 TCL 授权零售伙伴，开设 TCL 品牌专卖店或在已有门店引入 TCL 家电产品系列。',
			models: ['品牌专卖店（线下门店）', '专柜与店中店', '线上电商代运营合作', 'O2O 新零售联盟'],
			process: ['意向咨询与提交资料', '区域商务沟通与实地考察', '合作评估与合同签署', '门店装修 / 选品与样品配置', '运营培训与开业支持', '持续运营与市场活动支持'],
			benefits: ['产品授权与品牌支持', '装修与样品补贴', '销售返点与季度激励', '市场活动与广告物料支持', '门店运营培训', '区域保护政策'],
		},
		en: {
			name: 'Retail Franchise & Store Partnership',
			intro: 'Become an authorized TCL retail partner and open a TCL branded store, or introduce TCL appliances into your existing store.',
			models: ['Brand-exclusive retail store', 'Shop-in-shop and counters', 'E-commerce agency operation', 'O2O new-retail alliance'],
			process: ['Intro call and submission', 'Regional business discussion & on-site visit', 'Evaluation and contract signing', 'Store build-out / sample selection', 'Operations training and launch support', 'Continuous operations and marketing support'],
			benefits: ['Product authorization & brand support', 'Store build & sample subsidies', 'Sales rebates & quarterly incentives', 'Marketing & advertising materials', 'Retail operations training', 'Territorial protection'],
		},
	},
	{
		key: 'engineering',
		zh: {
			name: '工程 / 渠道批发',
			intro: '面向工程集成商、地产公司、批发商等企业客户，提供商用显示、商用空调、照明等系列产品及定制方案。',
			models: ['工程项目合作', '分销商 / 代理商合作', '地产配套集采', '系统集成商合作'],
			process: ['项目需求沟通与选型', '方案设计与报价', '样品/测试与 POC', '合同与供货', '项目实施与验收', '售后与运维'],
			benefits: ['工程特价与项目保护', '方案设计与技术支持', '样品与测试资源', '大项目专属商务经理', '售后与运维保障'],
		},
		en: {
			name: 'Engineering & Channel Wholesale',
			intro: 'For system integrators, real estate developers, and distributors — commercial displays, HVAC, lighting and custom solutions.',
			models: ['Project-based partnership', 'Distributor / Agent cooperation', 'Real estate bulk procurement', 'System integrator cooperation'],
			process: ['Requirement discussion & product selection', 'Solution design & quotation', 'Sample / POC & testing', 'Contract and delivery', 'Implementation and acceptance', 'After-sales and O&M'],
			benefits: ['Project pricing & protection', 'Solution design & technical support', 'Sample and test resources', 'Dedicated business manager for large projects', 'After-sales & O&M support'],
		},
	},
	{
		key: 'solar',
		zh: {
			name: '光伏与能源合作',
			intro: '面向户用、工商业光伏及储能项目，提供组件、逆变器、储能电池、EPC 与运维全链条合作。',
			models: ['户用光伏加盟', '工商业 EPC 合作', '分销与代理合作', '运维与服务合作'],
			process: ['项目/区域意向沟通', '资质审核与产品准入', '合作框架签订', '设计/供货/培训支持', '项目实施与并网', '持续运维服务'],
			benefits: ['原厂组件/逆变器/储能供应', '设计与方案支持', '并网与合规支持', '产品与项目双质保', '运维平台与备件供应'],
		},
		en: {
			name: 'Solar & Energy Partnership',
			intro: 'Full-chain partnership for residential, commercial & industrial solar and storage projects — modules, inverters, batteries, EPC and O&M.',
			models: ['Residential solar franchise', 'C&I EPC partnership', 'Distribution / agency', 'O&M and service partnership'],
			process: ['Project / region introduction call', 'Qualification review & product onboarding', 'Framework agreement signing', 'Design / supply / training', 'Implementation and grid-connection', 'Continuous O&M'],
			benefits: ['OEM modules / inverters / storage', 'Design & solution support', 'Grid-connection & compliance support', 'Product + project warranty', 'O&M platform & spare parts'],
		},
	},
	{
		key: 'gov',
		zh: {
			name: '政府采购 / 国企合作',
			intro: '面向政府、事业单位及国有企业采购项目，提供完整的资质、方案、供货与售后服务支持。',
			models: ['入围供应商合作', '项目集采合作', '智慧园区 / 智慧办公解决方案', '节能改造项目'],
			process: ['项目需求对接', '资质与方案准备', '投标与供货响应', '项目实施与验收', '质保与运维服务'],
			benefits: ['政府采购资质支持', '项目专属方案', '稳定交付与售后', '节能/环保认证支持'],
		},
		en: {
			name: 'Government / State-Owned Enterprise Procurement',
			intro: 'Project-level procurement support for government, public institutions and state-owned enterprises — qualification, solutions, delivery and after-sales.',
			models: ['Qualified-supplier framework', 'Centralized procurement projects', 'Smart campus / smart workplace solutions', 'Energy-efficiency retrofits'],
			process: ['Project requirement mapping', 'Qualification preparation & solution design', 'Tender & delivery response', 'Implementation and acceptance', 'Warranty & O&M service'],
			benefits: ['Government procurement qualification support', 'Project-specific solutions', 'Stable delivery & after-sales', 'Energy efficiency / green certification support'],
		},
	},
]

// Aliases for page references (canonical names are above)
export const PRODUCTS_PERSONAL = PERSONAL_PRODUCTS
export const PRODUCTS_COMMERCIAL = COMMERCIAL_PRODUCTS
export const FAQ_LIST = FAQ_ITEMS
