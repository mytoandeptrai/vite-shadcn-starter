import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
	return (
		<section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Background decoration */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<div className="flex items-center justify-center gap-2 mb-6">
					<Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
					<span className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
						Modern React Starter
					</span>
				</div>

				<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
					Build Amazing Apps
					<br />
					<span className="text-gray-900 dark:text-white">Faster Than Ever</span>
				</h1>

				<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
					A modern, production-ready starter template with TanStack Router, React Query,
					i18n, and all the tools you need to build exceptional applications.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<Link to="/demo/form">
						<Button size="lg" className="group text-lg px-8 py-6">
							Get Started
							<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Button>
					</Link>
					<Link to="/demo/table">
						<Button size="lg" variant="outline" className="text-lg px-8 py-6">
							View Demos
						</Button>
					</Link>
				</div>
			</div>
		</section>
	)
}

