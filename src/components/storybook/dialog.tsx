import type React from 'react';

export interface DialogProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({ title, children, footer, className = '' }) => {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      <div className='border-gray-200 border-b px-6 py-4 dark:border-gray-700'>
        <h2 className='font-semibold text-gray-900 text-xl dark:text-gray-100'>{title}</h2>
      </div>
      <div className='px-6 py-6'>{children}</div>
      {footer && (
        <div className='border-gray-200 border-t bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900'>
          {footer}
        </div>
      )}
    </div>
  );
};
