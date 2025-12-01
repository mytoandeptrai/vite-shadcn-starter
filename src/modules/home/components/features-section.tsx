import { Code, Zap, Globe, Shield, Palette, GitBranch } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
	{
		icon: Zap,
		title: 'Lightning Fast',
		description: 'Built with Vite for instant hot module replacement and optimized builds.',
	},
	{
		icon: Code,
		title: 'Type Safe',
		description: 'Full TypeScript support with strict type checking and excellent DX.',
	},
	{
		icon: Globe,
		title: 'i18n Ready',
		description: 'Multi-language support out of the box with react-i18next integration.',
	},
	{
		icon: Shield,
		title: 'Production Ready',
		description: 'Includes error handling, loading states, and best practices.',
	},
	{
		icon: Palette,
		title: 'Beautiful UI',
		description: 'shadcn/ui components with Tailwind CSS for stunning interfaces.',
	},
	{
		icon: GitBranch,
		title: 'Modern Stack',
		description: 'TanStack Router, React Query, and the latest React features.',
	},
]

export function FeaturesSection() {
	return (
		<section className="py-24 bg-white dark:bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
						Everything You Need
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						All the tools and components to build modern, scalable applications
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature) => {
						const Icon = feature.icon
						return (
							<Card
								key={feature.title}
								className="border-2 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-lg"
							>
								<CardHeader>
									<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
										<Icon className="w-6 h-6 text-white" />
									</div>
									<CardTitle className="text-xl">{feature.title}</CardTitle>
									<CardDescription className="text-base">
										{feature.description}
									</CardDescription>
								</CardHeader>
							</Card>
						)
					})}
				</div>
			</div>
		</section>
	)
}

