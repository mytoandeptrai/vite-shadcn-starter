import { CustomLink } from '@/components/ui/custom-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constant';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/success-notification')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Success</CardTitle>
        <CardDescription>Your request was completed successfully.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className='w-full' asChild>
          <CustomLink to={ROUTES.LOGIN}>Back to sign in</CustomLink>
        </Button>
      </CardContent>
      <CardFooter className='flex w-full justify-center'>
        <CustomLink to={ROUTES.GETTING_STARTED} className='text-muted-foreground text-sm hover:underline'>
          Return to getting started
        </CustomLink>
      </CardFooter>
    </Card>
  );
}
