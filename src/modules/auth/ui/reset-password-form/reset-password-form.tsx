import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export interface ResetPasswordFormProps {
  onSubmit?: () => void;
  isLoading?: boolean;
}

export const ResetPasswordForm = ({ onSubmit, isLoading = false }: ResetPasswordFormProps) => {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='new-password' className='font-medium text-sm'>
            New password
          </label>
          <Input id='new-password' type='password' placeholder='••••••••' autoComplete='new-password' />
        </div>
        <div className='space-y-2'>
          <label htmlFor='confirm-new-password' className='font-medium text-sm'>
            Confirm new password
          </label>
          <Input id='confirm-new-password' type='password' placeholder='••••••••' autoComplete='new-password' />
        </div>
        <Button className='w-full' type='button' disabled={isLoading} onClick={onSubmit}>
          Reset password
        </Button>
      </CardContent>
    </Card>
  );
};
