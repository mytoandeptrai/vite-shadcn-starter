import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomLink } from '@/components/ui/custom-link';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constant';

export interface ForgotPasswordFormProps {
  onSubmit?: () => void;
  isLoading?: boolean;
}

export const ForgotPasswordForm = ({ onSubmit, isLoading = false }: ForgotPasswordFormProps) => {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>Enter your email and we will send you a reset link.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='email' className='font-medium text-sm'>
            Email
          </label>
          <Input id='email' type='email' placeholder='you@example.com' autoComplete='email' />
        </div>
        <Button className='w-full' type='button' disabled={isLoading} onClick={onSubmit}>
          Send reset link
        </Button>
      </CardContent>
      <CardFooter className='flex w-full justify-end'>
        <CustomLink to={ROUTES.LOGIN} className='text-muted-foreground text-sm hover:underline'>
          Back to Sign in
        </CustomLink>
      </CardFooter>
    </Card>
  );
};
