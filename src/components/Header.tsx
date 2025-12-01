import { Link } from '@tanstack/react-router'
import { BookOpen, Home, Menu, Network, Table, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from '@/integrations/i18n'
import LanguageSwitcher from './shared/language-switcher'
import { Button } from './ui/button'

export default function Header() {
	const [isOpen, setIsOpen] = useState(false)
	const { t } = useTranslation('navigation')

	return (
		<>
			<header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-16 items-center justify-between px-4">
					<div className="flex items-center gap-4">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => setIsOpen(true)}
							className="md:hidden"
							aria-label="Open menu"
						>
							<Menu className="h-5 w-5" />
						</Button>
						<Link
							to="/"
							className="flex items-center gap-2 font-semibold text-xl transition-colors hover:text-primary"
						>
							<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
								V
							</div>
							<span className="hidden sm:inline-block">Vite Starter</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-1">
						<Link
							to="/"
							className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
							activeProps={{
								className:
									'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground',
							}}
						>
							<Home className="h-4 w-4" />
							{t('home')}
						</Link>
						<Link
							to="/demo/table"
							className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
							activeProps={{
								className:
									'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground',
							}}
						>
							<Table className="h-4 w-4" />
							Table
						</Link>
						<Link
							to="/demo/storybook"
							className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
							activeProps={{
								className:
									'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground',
							}}
						>
							<BookOpen className="h-4 w-4" />
							Storybook
						</Link>
						<Link
							to="/demo/form"
							className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
							activeProps={{
								className:
									'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground',
							}}
						>
							Form
						</Link>
					</nav>

					<div className="flex items-center gap-2">
						<LanguageSwitcher className="hidden sm:flex" />
					</div>
				</div>
			</header>

			{/* Mobile Sidebar */}
			{isOpen && (
				<>
					{/* Overlay */}
					<div
						className="fixed inset-0 bg-black/50 z-50 md:hidden"
						onClick={() => setIsOpen(false)}
						aria-hidden="true"
					/>

					{/* Sidebar */}
					<aside
						className={`fixed top-0 left-0 h-full w-80 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl ${
							isOpen ? 'translate-x-0' : '-translate-x-full'
						}`}
					>
						<div className="flex items-center justify-between p-4 border-b">
							<h2 className="text-xl font-bold">Navigation</h2>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => setIsOpen(false)}
								aria-label="Close menu"
							>
								<X className="h-5 w-5" />
							</Button>
						</div>

						<nav className="flex-1 p-4 overflow-y-auto space-y-1">
							<Link
								to="/"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
								activeProps={{
									className:
										'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground',
								}}
							>
								<Home className="h-5 w-5" />
								<span className="font-medium">{t('home')}</span>
							</Link>

							<Link
								to="/demo/table"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
								activeProps={{
									className:
										'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground',
								}}
							>
								<Table className="h-5 w-5" />
								<span className="font-medium">TanStack Table</span>
							</Link>

							<Link
								to="/demo/storybook"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
								activeProps={{
									className:
										'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground',
								}}
							>
								<BookOpen className="h-5 w-5" />
								<span className="font-medium">Storybook</span>
							</Link>

							<Link
								to="/demo/tanstack-query"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
								activeProps={{
									className:
										'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground',
								}}
							>
								<Network className="h-5 w-5" />
								<span className="font-medium">TanStack Query</span>
							</Link>

							<Link
								to="/demo/form"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
								activeProps={{
									className:
										'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground',
								}}
							>
								<span className="font-medium">Form Demo</span>
							</Link>
						</nav>

						{/* Language Switcher in Sidebar */}
						<div className="p-4 border-t">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-muted-foreground">
									{t('settings')}
								</span>
							</div>
							<LanguageSwitcher />
						</div>
					</aside>
				</>
			)}
		</>
	)
}
