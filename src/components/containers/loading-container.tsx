import type React from "react";
import ErrorFluid from "@/components/shared/error-fluid";
import LoadingFluid from "@/components/shared/loading-fluid";
import type { FCC } from "@/types/base";

interface LoadingContainerProps {
	loading: boolean;
	loadingComponent?: React.ReactNode;
	error?: { info?: { error: string }; error?: string };
	errorComponent?: React.ReactNode;
	children: React.ReactNode;
}

export const LoadingContainer: FCC<LoadingContainerProps> = (props) => {
	if (props.error) {
		return props.errorComponent ? (
			props.errorComponent
		) : (
			<div className="mt-4">
				<ErrorFluid error={props.error} />
			</div>
		);
	}

	if (props.loading) return <>{props.loadingComponent || <LoadingFluid />}</>;

	return <>{props.children}</>;
};