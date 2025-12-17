import type React from 'react';
import type { FC, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { HStack, Show, VStack } from '../utilities';
import { Paragraph } from './typography';
import { CheckCircle2 } from 'lucide-react';

export interface IStep {
  value: string;
  label: string;
  subLabel?: string;
}

interface StepperProps {
  steps: IStep[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <HStack spacing={0} justify='between' align='start' noWrap className='relative'>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <VStack key={index} className='flex-1'>
            <div className='relative flex flex-col items-center'>
              {index !== 0 && <div className='-left-1/2 absolute top-3 h-0.5 w-full bg-gray-600 z-[-1]' />}

              <HStack justify='center' className='relative w-full'>
                <Dot isActive={isActive} isCompleted={isCompleted} />
                {index < steps.length - 1 && (
                  <span
                    className={cn(`-translate-y-1/2 absolute top-1/2 left-1/2 z-[-1] h-[2px] w-full dark:bg-gray-700`, {
                      'dark:bg-orange-600': isCompleted,
                    })}
                  />
                )}
              </HStack>
              <Paragraph
                size='sm'
                className={cn('mt-2 max-w-52 text-center dark:text-gray-25', {
                  'dark:text-orange-600': isActive || isCompleted,
                })}
              >
                {step.label}
              </Paragraph>
              {step?.subLabel && (
                <Paragraph
                  size='xs'
                  className={cn('mt-1 max-w-52 text-center md:text-sm dark:text-gray-200', {
                    // 'dark:text-orange-50': isActive || isCompleted,
                  })}
                >
                  {step?.subLabel}
                </Paragraph>
              )}
            </div>
          </VStack>
        );
      })}
    </HStack>
  );
};

export default Stepper;

interface DotProps extends HTMLAttributes<HTMLDivElement> {
  isActive: boolean;
  isCompleted: boolean;
}

const Dot: FC<DotProps> = ({ isActive, isCompleted, className, ...props }) => {
  return (
    <div
      className={cn(
        'relative z-0 aspect-square w-6 rounded-full border dark:border-[#0514191A] dark:bg-white',
        {
          'dark:bg-orange-600': isActive || isCompleted,
        },
        className
      )}
      {...props}
    >
      <Show when={isActive}>
        <div className='-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-[-1] aspect-square w-8 rounded-full bg-[#F5432540]'>
          <div className='relative h-full w-full'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f54425] opacity-50 [animation-duration:2s]' />
          </div>
        </div>
      </Show>

      {isCompleted ? (
        <div className='-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10'>
          <CheckCircle2 className='fill-white' />
        </div>
      ) : (
        <span
          className={cn(
            '-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10 aspect-square w-2 rounded-full dark:bg-orange-200',
            { 'bg-white': isActive }
          )}
        />
      )}
    </div>
  );
};
