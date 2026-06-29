export function getTclPageInstructions(url: string): string | undefined {
	if (url.includes('/user-service')) return SERVICE_PAGE_INSTRUCTIONS
	if (url.includes('/blog')) return BLOG_PAGE_INSTRUCTIONS
	if (url.includes('/products')) return PRODUCT_PAGE_INSTRUCTIONS
	return HOME_PAGE_INSTRUCTIONS
}

const HOME_PAGE_INSTRUCTIONS = `
当前可能是 TCL 官网首页。可优先查找“服务支持”“产品”“会员俱乐部”“商务合作”等导航入口。目标不明确时，先问一个澄清问题。
`

const SERVICE_PAGE_INSTRUCTIONS = `
当前可能是 TCL 服务支持页。客服场景优先寻找“24小时在线客服”；报修场景优先寻找“家电服务”“个人产品服务”。涉及手机号、地址、订单号、提交预约或报修单时必须确认。
`

const PRODUCT_PAGE_INSTRUCTIONS = `
当前可能是产品页。可帮助用户查找电视、空调、冰箱、洗衣机、智能门锁等分类；不要承诺价格、库存或售后结果。
`

const BLOG_PAGE_INSTRUCTIONS = `
当前可能是教程或文章页。故障排查时优先总结安全步骤；涉及高风险关键词时直接建议断电并联系 TCL 官方售后。
`
