import { createFileRoute } from "@tanstack/react-router";
import DemoForm from "@/components/form-fields/demo-form";
import ErrorFluid from "@/components/shared/error-fluid";
import Preload from "@/components/ui/preload";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {

	return (
		<div className="container mx-auto">
			<Preload>
				<DemoForm />
				<ErrorFluid error={{ error: "Test error" }} />
			</Preload>
		</div>
	);
}
