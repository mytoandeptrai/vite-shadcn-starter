import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ForgotPasswordHeaderUiProps = {
  title: string;
  description: string;
};

const ForgotPasswordHeaderUi = ({ title, description }: ForgotPasswordHeaderUiProps) => {
  return (
    <CardHeader className='text-center'>
      <CardTitle className='font-bold text-2xl text-gray-800 text-title-sm sm:text-title-md dark:text-white/90'>
        {title}
      </CardTitle>
      <CardDescription className='text-gray-500 text-sm dark:text-gray-400'>{description}</CardDescription>
    </CardHeader>
  );
};

export default ForgotPasswordHeaderUi;
