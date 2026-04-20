import { CustomLink } from '@/components/ui/custom-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constant';

export interface LoginFormProps {
  onSubmit?: () => void;
  isLoading?: boolean;
}

export const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Welcome back. Enter your credentials to continue.</CardDescription>
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
          <Input id='password' type='password' placeholder='••••••••' autoComplete='current-password' />
        </div>
        <Button className='w-full' type='button' disabled={isLoading} onClick={onSubmit}>
          Sign in
        </Button>
      </CardContent>
      <CardFooter className='flex w-full justify-between'>
        <CustomLink to={ROUTES.FORGOT_PASSWORD} className='text-muted-foreground text-sm hover:underline'>
          Forgot password?
        </CustomLink>
        <CustomLink to={ROUTES.REGISTER} className='text-muted-foreground text-sm hover:underline'>
          Create account
        </CustomLink>
      </CardFooter>
    </Card>
  );
};
