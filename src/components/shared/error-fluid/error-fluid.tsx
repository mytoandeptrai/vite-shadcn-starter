'use client';

import { AlertCircle } from 'lucide-react';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { env } from '@/constant/base.const';

export default function ErrorFluid(props: { error: { info?: { error: string | object }; error?: string | object } }) {
  const errorMessage = safeErrorToString(props.error?.info?.error) || safeErrorToString(props.error?.error);

  if (errorMessage) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon' className='bg-destructive/10'>
            <AlertCircle className='text-destructive' />
          </EmptyMedia>
          <EmptyTitle>There was an error</EmptyTitle>
          <EmptyDescription>{errorMessage}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (props.error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon' className='bg-destructive/10'>
            <AlertCircle className='text-destructive' />
          </EmptyMedia>
          <EmptyTitle>There was an error</EmptyTitle>
          <EmptyDescription>
            Please refresh or contact support at <a href={`mailto:${env.APP_SUPPORT_EMAIL}`}>{env.APP_SUPPORT_EMAIL}</a>{' '}
            if the error persists.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return null;
}

const safeErrorToString = (error: string | object | undefined): string | null => {
  if (!error) return null;
  if (typeof error === 'string') return error;
  if (typeof error === 'object') {
    // Handle Zod validation errors with issues array
    if ('issues' in error && Array.isArray(error.issues)) {
      return error.issues.map((issue) => issue.message || 'Validation error').join(', ');
    }
    // For other objects, try to stringify safely
    try {
      return JSON.stringify(error);
    } catch {
      return 'Invalid data format';
    }
  }
  return String(error);
};
