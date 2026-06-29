import { Link } from 'wouter'

interface NavLinkProps {
	href: string
	children: React.ReactNode
	className?: string
	onClick?: () => void
}

export default function NavLink({ href, children, className = '', onClick }: NavLinkProps) {
	return (
		<Link
			href={href}
			onClick={onClick}
			className={className}
		>
			{children}
		</Link>
	)
}
