import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomLink } from '@/components/ui/custom-link';
import { ROUTES } from '@/constant';

const GettingStartedContainer = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='font-bold text-2xl'>Welcome to PWC Pay</CardTitle>
          <CardDescription>
            Your all-in-one payment processing dashboard. Sign in to manage your merchant account.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2 text-center text-muted-foreground text-sm'>
            <p>
              Access your transactions, manage wallet addresses, and configure your payment settings — all from one
              place.
            </p>
          </div>
          <Button className='w-full' asChild>
            <CustomLink to={ROUTES.LOGIN}>Sign in to your account</CustomLink>
          </Button>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <p className='text-muted-foreground text-sm'>
            {"Don't have an account? "}
            <CustomLink to={ROUTES.REGISTER} className='text-primary hover:underline'>
              Create one
            </CustomLink>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GettingStartedContainer;
