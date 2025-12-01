import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaSection() {
	return (
		<section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
					Ready to Build Something Amazing?
				</h2>
				<p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
					Start building your next project with our modern, production-ready starter
					template. Everything you need is already set up.
				</p>
				<Link to="/demo/form">
					<Button
						size="lg"
						variant="secondary"
						className="text-lg px-8 py-6 group bg-white text-purple-600 hover:bg-purple-50"
					>
						Explore Demo Form
						<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</Button>
				</Link>
			</div>
		</section>
	)
}

