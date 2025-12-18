import { FloatingHeader } from "@/components/ui/floating-header";
import { cn } from '@/lib/utils';

export default function DemoOne() {
 return (
		<div className="relative w-full px-4">
			<FloatingHeader />
			<div className="min-h-screen py-10">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Floating Header Demo</h1>
                    <p className="text-muted-foreground">
                        This is a demo of the new Floating Header component integrated with the Orda project features.
                        It supports responsive design, mobile menu via Sheet, and authentication state.
                    </p>
                </div>
            </div>

			{/* Dots Background Effect */}
			<div
				aria-hidden="true"
				className={cn(
					'fixed inset-0 -z-10 size-full',
					'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]',
				)}
			/>
		</div>
	);
}
