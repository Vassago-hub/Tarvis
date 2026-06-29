/**
 * Copyright (C) 2025 Alibaba Group Holding Limited
 * Copyright (C) 2026 SimonLuvRamen
 * All rights reserved.
 */

export interface TclFaq {
	id: string
	category: 'tv' | 'air' | 'fridge' | 'washer' | 'doorlock' | 'general'
	title: string
	steps: string[]
	riskNote?: string
	recommendation?: string
	keywords: string[]
}

export const TCL_FAQ: TclFaq[] = [
	{
		id: 'tv_black_screen',
		category: 'tv',
		title: '电视开机后黑屏无画面',
		steps: [
			'检查电源线是否插好，并确认电源插座正常供电',
			'使用电视机身按键或遥控器按下待机键,观察是否有指示灯变化',
			'尝试切换不同的信号源（HDMI/AV/TV），查看是否有画面',
			'若仍无画面，断开所有外接设备后重启电视',
		],
		riskNote: '若出现黑屏伴随冒烟、烧焦味或指示灯异常闪烁，请先断电，并联系 TCL 官方售后 4008-123456',
		keywords: ['电视', '黑屏', '无画面', '开机没反应'],
	},
	{
		id: 'tv_no_signal',
		category: 'tv',
		title: '电视显示无信号',
		steps: [
			'确认机顶盒、电视盒子或其他外接设备是否已开机',
			'检查 HDMI / AV 信号线是否松动，可尝试更换接口或更换信号线',
			'按遥控器上的“信号源/Input”键，选择对应的输入源',
			'重启设备：先关闭电视和外接设备，等待 30 秒后再依次开启',
		],
		keywords: ['电视', '无信号', 'HDMI', '信号源'],
	},
	{
		id: 'tv_remote_not_working',
		category: 'tv',
		title: '电视遥控器失灵',
		steps: [
			'更换新电池，注意正负极方向是否正确',
			'用手机摄像头对准遥控器红外发射口，按下按键观察是否有红光闪烁',
			'清理遥控器与电视之间是否有障碍物，尝试靠近电视再操作',
			'尝试使用机身按键控制电视，排除电视本身是否故障',
		],
		recommendation: '若确认遥控器损坏，可在 TCL 官网购买原装遥控器',
		keywords: ['电视', '遥控器', '失灵', '按键没反应'],
	},
	{
		id: 'tv_screen_mirror_fail',
		category: 'tv',
		title: '电视无法投屏或投屏失败',
		steps: [
			'确认手机和电视连接同一 Wi-Fi 网络',
			'在电视端打开“多屏互动”或“投屏”应用',
			'手机端选择对应电视名称，允许投屏请求',
			'重启路由器和电视后再试，检查 Wi-Fi 信号是否稳定',
		],
		recommendation: '建议使用 5GHz Wi-Fi 以获得更稳定的投屏体验',
		keywords: ['电视', '投屏', '多屏互动', '屏幕镜像'],
	},
	{
		id: 'tv_lag',
		category: 'tv',
		title: '电视卡顿反应慢',
		steps: [
			'清理后台应用，关闭不使用的 App',
			'在“设置-存储”中清理缓存',
			'检查网络连接是否稳定，测速确认带宽是否正常',
			'在“设置-系统”中恢复出厂设置（注意备份数据',
		],
		keywords: ['电视', '卡顿', '反应慢', '卡顿'],
	},
	{
		id: 'air_e1_error',
		category: 'air',
		title: '空调显示 E1 报错',
		steps: [
			'断电 10 分钟后重新通电，观察是否恢复正常',
			'检查室内外机通讯线是否松动或鼠咬损坏',
			'确认温度传感器是否有明显损坏',
			'检查电源电压是否稳定，避免高温或过低',
		],
		riskNote: 'E1 报错可能涉及电路板或传感器故障，请先断电，并联系 TCL 官方售后 4008-123456',
		keywords: ['空调', 'E1', '报错', '故障代码'],
	},
	{
		id: 'air_not_cooling',
		category: 'air',
		title: '空调不制冷',
		steps: [
			'确认遥控器模式设置为“制冷”模式，温度设置低于室温',
			'检查门窗是否关闭，避免阳光直射或热源',
			'清理空调出风口和过滤网是否正常运转',
			'检查电压是否稳定',
		],
		keywords: ['空调', '不制冷', '制冷差', '没冷风'],
	},
	{
		id: 'air_leaking',
		category: 'air',
		title: '空调室内机漏水',
		steps: [
			'检查室内机安装是否水平，避免倾斜导致冷凝水溢出',
			'清理排水管，检查排水管是否堵塞或弯折',
			'观察是否有冷凝水从机壳缝隙流出',
			'断电后清理过滤网和蒸发器表面积水',
		],
		riskNote: '涉及拆机清理存在进水风险，请先断电，并联系 TCL 官方售后 4008-123456',
		keywords: ['空调', '漏水', '滴水', '冷凝水'],
	},
	{
		id: 'air_strange_noise',
		category: 'air',
		title: '空调运行有异响',
		steps: [
			'确认空调室内外机是否安装牢固，螺丝是否晃动',
			'检查是否有异物进入风轮或风扇',
			'观察风轮是否运转正常',
			'调低风速是否松动',
		],
		riskNote: '异响持续或有烧焦味请先断电，并联系 TCL 官方售后 4008-123456',
		keywords: ['空调', '异响', '噪音', '异响'],
	},
	{
		id: 'air_filter_clean',
		category: 'air',
		title: '空调提示滤网清洗',
		steps: [
			'断电后打开前面板，取出过滤网',
			'用清水冲洗滤网，软毛刷轻轻刷洗',
			'晾干后装回原位',
			'长按遥控器“滤网复位”按键，重新启动空调',
		],
		recommendation: '建议每 2-4 周清洗一次滤网',
		keywords: ['空调', '滤网', '清洗', '滤网'],
	},
	{
		id: 'fridge_noisy',
		category: 'fridge',
		title: '冰箱噪音大',
		steps: [
			'确认冰箱放置是否水平，调整脚垫是否稳固',
			'检查冰箱与墙面或其他物品是否有碰撞',
			'确认冰箱内物品是否摆放整齐，避免振动',
			'观察压缩机启动和停机是否正常',
		],
		keywords: ['冰箱', '噪音', '声音大'],
	},
	{
		id: 'fridge_not_cooling',
		category: 'fridge',
		title: '冰箱不制冷',
		steps: [
			'检查电源是否正常，插头是否松动',
			'确认温度设置是否合适',
			'检查冰箱门是否关严，密封条是否完好',
			'清理冷凝器散热片灰尘',
		],
		riskNote: '若伴随烧焦味或异常高温请先断电，并联系 TCL 官方售后 4008-123456',
		keywords: ['冰箱', '不制冷', '制冷差', '冷'],
	},
	{
		id: 'fridge_frost_heavy',
		category: 'fridge',
		title: '冰箱结霜严重',
		steps: [
			'确认冰箱门是否关严，避免频繁开门',
			'检查密封条是否有损坏或老化',
			'手动除霜：断电取出食物，让霜自然融化',
			'清理排水孔，保持通畅',
		],
		keywords: ['冰箱', '结霜', '霜厚', '冰霜'],
	},
	{
		id: 'washer_not_spinning',
		category: 'washer',
		title: '洗衣机不脱水',
		steps: [
			'确认机盖是否关好，安全开关是否正常',
			'检查衣物是否分布不均，重新整理衣物',
			'清理排水泵过滤器，检查是否堵塞',
			'确认是否选择了正确的程序',
		],
		keywords: ['洗衣机', '不脱水', '脱水', '没转'],
	},
	{
		id: 'washer_not_filling',
		category: 'washer',
		title: '洗衣机不进水',
		steps: [
			'确认水龙头已打开，进水管无弯折',
			'清理进水阀过滤网',
			'检查水压是否正常',
			'确认洗衣机门是否关好',
		],
		keywords: ['洗衣机', '不进水', '进水', '没水'],
	},
	{
		id: 'washer_leaking',
		category: 'washer',
		title: '洗衣机漏水',
		steps: [
			'检查进水管和排水管连接处是否拧紧',
			'观察排水管是否放置过高或过低',
			'检查门密封圈是否有异物或损坏',
			'清理洗涤剂盒，避免过量使用导致泡沫溢出',
		],
		riskNote: '洗衣机涉及进水与电路附近请先断电，并联系 TCL 官方售后 4008-123456',
		keywords: ['洗衣机', '漏水', '漏水'],
	},
	{
		id: 'doorlock_fingerprint_fail',
		category: 'doorlock',
		title: '智能门锁无法识别指纹',
		steps: [
			'擦净手指和指纹识别区',
			'更换手指保持干燥，避免水渍或油污',
			'重新录入指纹，多角度录入',
			'确认电池电量是否充足',
		],
		keywords: ['门锁', '指纹', '识别失败', '智能门锁'],
	},
	{
		id: 'doorlock_battery_replace',
		category: 'doorlock',
		title: '智能门锁更换电池',
		steps: [
			'找到电池仓盖板并打开，确认电池型号（通常为 4 节 5 号电池',
			'取出旧电池，注意正负极方向',
			'装入新电池，确认正负极正确',
			'关闭电池仓，测试门锁是否正常',
		],
		recommendation: '建议使用碱性电池，避免漏液',
		keywords: ['门锁', '换电池', '电池', '更换电池'],
	},
	{
		id: 'general_repair_process',
		category: 'general',
		title: 'TCL 产品报修流程指引',
		steps: [
			'拨打 TCL 官方售后电话 4008-123456',
			'提供产品型号、购买时间、故障现象和联系信息',
			'客服记录后安排工程师上门或寄送维修',
			'确认维修费用和时间安排',
		],
		keywords: ['报修', '维修', '售后', '预约上门'],
	},
	{
		id: 'general_contact_human',
		category: 'general',
		title: '联系 TCL 人工客服',
		steps: [
			'拨打 TCL 官方客服热线 4008-123456',
			'或在 TCL 官网“服务支持-24 小时在线客服”入口',
			'提供产品信息、问题描述和联系方式',
			'根据客服指引继续操作',
		],
		recommendation: '建议提前准备好产品型号和购买凭证',
		keywords: ['人工客服', '在线客服', '客服电话', '联系客服'],
	},
	{
		id: 'general_warranty_query',
		category: 'general',
		title: 'TCL 保修政策查询',
		steps: [
			'确认产品型号和购买日期',
			'查看产品说明书或保修卡',
			'访问 TCL 官网“服务支持”查看保修政策',
			'或拨打 4008-123456 查询',
		],
		recommendation: '不同产品保修期限不同，请以官网信息为准',
		keywords: ['保修', '保修政策', '保修期', '质保'],
	},
	{
		id: 'general_product_registration',
		category: 'general',
		title: 'TCL 产品注册',
		steps: [
			'访问 TCL 官网或打开 TCL+ APP',
			'注册或登录 TCL 账号',
			'输入产品型号、序列号和购买信息',
			'完成注册后可享受后续服务',
		],
		recommendation: '注册后可享受延保及专属服务',
		keywords: ['产品注册', '注册', '延保', 'TCL+'],
	},
]

export function findFaqByKeywords(query: string): TclFaq[] {
	const text = query.trim().toLowerCase()
	if (!text) return []
	return TCL_FAQ.filter((faq) =>
		faq.keywords.some((keyword) => text.includes(keyword.toLowerCase()))
	)
}
