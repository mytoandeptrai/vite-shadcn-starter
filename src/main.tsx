import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import * as I18nProvider from "./integrations/i18n/root-provider";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import { Toaster } from "./components/ui/sonner.tsx";
import { ThemeProvider } from "./integrations/theme/theme-provider.tsx";
import reportWebVitals from "./reportWebVitals.ts";

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
	routeTree,
	context: {
		...TanStackQueryProviderContext,
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<I18nProvider.Provider>
				<TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
					<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
						<RouterProvider router={router} />
						<Toaster />
					</ThemeProvider>
				</TanStackQueryProvider.Provider>
			</I18nProvider.Provider>
		</StrictMode>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
