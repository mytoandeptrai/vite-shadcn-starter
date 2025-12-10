import { RefreshCw } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
    // You could send the error to a monitoring service here
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className='flex min-h-screen items-center justify-center bg-gray-900'>
          <div className='p-8 text-center'>
            <h1 className='mb-4 font-bold text-3xl text-white' role='alert'>
              Oops! Something went wrong
            </h1>
            <p className='mb-8 text-gray-400'>An unexpected error occurred. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
              aria-label='Refresh the page'
              type='button'
            >
              <RefreshCw className='h-4 w-4' />
              <span>Refresh the page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
