import { Loader2Icon } from 'lucide-react';

const LoadingFluid = () => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/90'>
      <div className='p-8'>
        <Loader2Icon className='mx-auto size-8 animate-spin text-primary' />
      </div>
    </div>
  );
};

export default LoadingFluid;
