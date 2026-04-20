import { CustomLink } from '@/components/ui/custom-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constant';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>We’ll send you a reset link if the email exists.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='email' className='font-medium text-sm'>
            Email
          </label>
          <Input id='email' type='email' placeholder='you@example.com' autoComplete='email' />
        </div>
        <Button className='w-full' type='button'>
          Send reset link
        </Button>
      </CardContent>
      <CardFooter className='flex w-full justify-between'>
        <CustomLink to={ROUTES.LOGIN} className='text-muted-foreground text-sm hover:underline'>
          Back to sign in
        </CustomLink>
        <CustomLink to={ROUTES.REGISTER} className='text-muted-foreground text-sm hover:underline'>
          Create account
        </CustomLink>
      </CardFooter>
    </Card>
  );
}
