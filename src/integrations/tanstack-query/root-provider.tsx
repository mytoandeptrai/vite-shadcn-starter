import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
      mutations: {
        onError: (error) => {
          console.error(error);
        },
      },
    },
  });
  return {
    queryClient,
  };
}

export function Provider({ children, queryClient }: { children: React.ReactNode; queryClient: QueryClient }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
