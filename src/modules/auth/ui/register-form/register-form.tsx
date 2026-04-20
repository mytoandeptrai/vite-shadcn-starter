import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomLink } from '@/components/ui/custom-link';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constant';

export interface RegisterFormProps {
  onSubmit?: () => void;
  isLoading?: boolean;
}

export const RegisterForm = ({ onSubmit, isLoading = false }: RegisterFormProps) => {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Enter your details to create a new account.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='email' className='font-medium text-sm'>
            Email
          </label>
          <Input id='email' type='email' placeholder='you@example.com' autoComplete='email' />
        </div>
        <div className='space-y-2'>
          <label htmlFor='password' className='font-medium text-sm'>
            Password
          </label>
          <Input id='password' type='password' placeholder='••••••••' autoComplete='new-password' />
        </div>
        <div className='space-y-2'>
          <label htmlFor='confirm-password' className='font-medium text-sm'>
            Confirm password
          </label>
          <Input id='confirm-password' type='password' placeholder='••••••••' autoComplete='new-password' />
        </div>
        <Button className='w-full' type='button' disabled={isLoading} onClick={onSubmit}>
          Create account
        </Button>
      </CardContent>
      <CardFooter className='flex w-full justify-end'>
        <CustomLink to={ROUTES.LOGIN} className='text-muted-foreground text-sm hover:underline'>
          Already have an account? Sign in
        </CustomLink>
      </CardFooter>
    </Card>
  );
};
