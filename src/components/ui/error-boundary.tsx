import { RefreshCw } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './button';

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
        <div className='flex min-h-screen items-center justify-center bg-primary'>
          <div className='p-8 text-center'>
            <h1 className='mb-4 font-bold text-3xl text-white' role='alert'>
              Oops! Something went wrong
            </h1>
            <p className='mb-8 text-gray-400'>An unexpected error occurred. Please refresh the page.</p>
            <Button
              onClick={() => window.location.reload()}
              aria-label='Refresh the page'
              variant='outline'
              type='button'
            >
              <RefreshCw className='h-4 w-4' />
              <span>Refresh the page</span>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
