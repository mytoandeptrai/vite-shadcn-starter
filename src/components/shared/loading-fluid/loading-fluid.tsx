import { Loader2Icon } from "lucide-react";

const LoadingFluid = () => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-background/90 z-50">
			<div className="p-8">
				<Loader2Icon className="mx-auto size-8 animate-spin" />
			</div>
		</div>
	);
};

export default LoadingFluid;