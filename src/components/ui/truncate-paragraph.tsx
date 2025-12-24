import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

type Props = {
  truncatedContent: string;
  fullContent: string;
  className?: string;
};

const TruncateParagraph = ({ truncatedContent, fullContent, className }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn('w-32 truncate font-medium text-sm md:w-56', className)}>{truncatedContent}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p className='text-sm'>{fullContent}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TruncateParagraph;