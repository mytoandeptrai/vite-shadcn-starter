import { PageContainer } from '@/components/containers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(private)/settings/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer pageTitle='Profile' pageDescription='Your account profile (skeleton)'>
      <Card className='max-w-2xl'>
        <CardHeader className='border-b'>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='h-12 rounded-md border bg-muted/40' />
            <div className='h-12 rounded-md border bg-muted/40' />
            <div className='h-12 rounded-md border bg-muted/40 md:col-span-2' />
          </div>
          <div className='flex justify-end'>
            <Button type='button'>Edit</Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
