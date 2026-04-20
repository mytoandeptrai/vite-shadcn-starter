import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomLink } from '@/components/ui/custom-link';
import { ROUTES } from '@/constant';

export interface SuccessNotificationProps {
  title?: string;
  description?: string;
}

export const SuccessNotification = ({
  title = 'Success',
  description = 'Your request has been completed successfully.',
}: SuccessNotificationProps) => {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent />
      <CardFooter className='flex w-full justify-center'>
        <Button className='w-full' type='button' asChild>
          <CustomLink to={ROUTES.LOGIN}>Back to Sign in</CustomLink>
        </Button>
      </CardFooter>
    </Card>
  );
};
