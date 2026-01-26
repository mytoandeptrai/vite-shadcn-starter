/**
 * Tests for Badge component
 * Testing: rendering, variants, asChild prop, className customization
 */
import { render, screen } from '@/test/utils/render-helpers';
import { Badge } from './badge';

describe('Badge', () => {
	describe('Basic Rendering', () => {
		it('should render badge with text content', () => {
			// Arrange & Act
			render(<Badge>Test Badge</Badge>);

			// Assert
			expect(screen.getByText('Test Badge')).toBeInTheDocument();
		});

		it('should render as span element by default', () => {
			render(<Badge>Badge</Badge>);
			const badge = screen.getByText('Badge');

			expect(badge.tagName).toBe('SPAN');
		});

		it('should have data-slot attribute', () => {
			render(<Badge>Badge</Badge>);
			const badge = screen.getByText('Badge');

			expect(badge).toHaveAttribute('data-slot', 'badge');
		});
	});

	describe('Variants', () => {
		it('should render default variant', () => {
			render(<Badge>Default</Badge>);
			const badge = screen.getByText('Default');

			expect(badge).toHaveClass('bg-primary');
			expect(badge).toHaveClass('text-primary-foreground');
		});

		it('should render secondary variant', () => {
			render(<Badge variant="secondary">Secondary</Badge>);
			const badge = screen.getByText('Secondary');

			expect(badge).toHaveClass('bg-secondary');
			expect(badge).toHaveClass('text-secondary-foreground');
		});

		it('should render destructive variant', () => {
			render(<Badge variant="destructive">Destructive</Badge>);
			const badge = screen.getByText('Destructive');

			expect(badge).toHaveClass('bg-destructive');
			expect(badge).toHaveClass('text-white');
		});

		it('should render outline variant', () => {
			render(<Badge variant="outline">Outline</Badge>);
			const badge = screen.getByText('Outline');

			expect(badge).toHaveClass('text-foreground');
		});
	});

	describe('asChild Prop', () => {
		it('should render as child component when asChild is true', () => {
			render(
				<Badge asChild>
					<a href="/test">Link Badge</a>
				</Badge>,
			);

			const link = screen.getByRole('link', { name: 'Link Badge' });

			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute('href', '/test');
		});

		it('should apply badge classes to child component', () => {
			render(
				<Badge asChild variant="secondary">
					<button type="button">Button Badge</button>
				</Badge>,
			);

			const button = screen.getByRole('button', { name: 'Button Badge' });

			expect(button).toHaveClass('bg-secondary');
		});
	});

	describe('Custom Styling', () => {
		it('should apply custom className', () => {
			render(<Badge className="custom-class">Badge</Badge>);
			const badge = screen.getByText('Badge');

			expect(badge).toHaveClass('custom-class');
		});

		it('should merge custom className with default classes', () => {
			render(<Badge className="custom-class">Badge</Badge>);
			const badge = screen.getByText('Badge');

			// Should have both default and custom classes
			expect(badge).toHaveClass('custom-class');
			expect(badge).toHaveClass('bg-primary');
		});
	});

	describe('Accessibility', () => {
		it('should be focusable when rendered as link', () => {
			render(
				<Badge asChild>
					<a href="/test">Link Badge</a>
				</Badge>,
			);

			const link = screen.getByRole('link');
			link.focus();

			expect(link).toHaveFocus();
		});
	});
});
