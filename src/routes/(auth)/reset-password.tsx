import { CustomLink } from '@/components/ui/custom-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constant';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/reset-password')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Choose a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='password' className='font-medium text-sm'>
            New password
          </label>
          <Input id='password' type='password' placeholder='••••••••' autoComplete='new-password' />
        </div>
        <div className='space-y-2'>
          <label htmlFor='confirmPassword' className='font-medium text-sm'>
            Confirm password
          </label>
          <Input id='confirmPassword' type='password' placeholder='••••••••' autoComplete='new-password' />
        </div>
        <Button className='w-full' type='button'>
          Update password
        </Button>
      </CardContent>
      <CardFooter className='flex w-full justify-center'>
        <CustomLink to={ROUTES.LOGIN} className='text-muted-foreground text-sm hover:underline'>
          Back to sign in
        </CustomLink>
      </CardFooter>
    </Card>
  );
}
