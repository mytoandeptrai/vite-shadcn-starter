import type { ITransaction } from '@/apis/transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/integrations/i18n';
import { formatDate } from '@/utils';

type TransactionDetailTimelineUiProps = {
  transaction?: ITransaction;
};

const TransactionDetailTimelineUi = ({ transaction }: TransactionDetailTimelineUiProps) => {
  const { t } = useTranslation('transaction-detail-page');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('labels.timeline')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid grid-cols-1 items-start gap-4 md:grid-cols-3'>
            <div className='flex gap-4'>
              <div className='mt-1 flex flex-col items-center'>
                <div className='h-4 w-4 rounded-full bg-primary' />
              </div>
              <div className='pb-4'>
                <p className='font-medium'>{t('labels.first-seen')}</p>
                <p className='text-muted-foreground text-sm'>
                  {transaction?.firstSeenAt ? formatDate(transaction?.firstSeenAt!) : '-'}
                </p>
              </div>
            </div>

            <div className='flex gap-4'>
              <div className='mt-1 flex flex-col items-center'>
                <div className='h-4 w-4 rounded-full bg-green-500' />
              </div>
              <div className='pb-4'>
                <p className='font-medium'>{t('labels.confirmed')}</p>
                <p className='text-muted-foreground text-sm'>
                  {transaction?.confirmedAt ? formatDate(transaction?.confirmedAt!) : '-'}
                </p>
              </div>
            </div>

            <div className='flex gap-4'>
              <div className='mt-1 flex flex-col items-center'>
                <div className='h-4 w-4 rounded-full bg-red-500' />
              </div>
              <div className='pb-4'>
                <p className='font-medium'>{t('labels.failed')}</p>
                <p className='text-muted-foreground text-sm'>
                  {transaction?.blockTimestamp ? formatDate(transaction?.blockTimestamp!) : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetailTimelineUi;
