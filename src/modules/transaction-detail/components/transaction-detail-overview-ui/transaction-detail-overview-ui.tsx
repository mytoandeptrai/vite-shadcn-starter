import type { ITransaction } from '@/apis/transactions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/integrations/i18n';
import {
  getStatusText,
  getStatusVariant,
  getTypeDisplay,
} from '@/modules/transactions/containers/transaction-table-container/create-columns';
import { formatNaturalNumber } from '@/utils';

type TransactionDetailOverviewUiProps = {
  transaction?: ITransaction;
};

const TransactionDetailOverviewUi = ({ transaction }: TransactionDetailOverviewUiProps) => {
  const { t } = useTranslation('transaction-detail-page');
  const amount = formatNaturalNumber(Number(transaction?.amount ?? 0), { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('labels.transaction-overview')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
          <div>
            <p className='font-medium text-sm'>{t('labels.type')}</p>
            <div className='mt-2 text-sm'>{getTypeDisplay(transaction?.type!, t)}</div>
          </div>
          <div>
            <p className='font-medium text-sm'>{t('labels.status')}</p>
            <div className='mt-2'>
              <Badge variant={getStatusVariant(transaction?.status?.toLocaleLowerCase() ?? '')}>{getStatusText(transaction?.status?.toLocaleLowerCase() ?? '', t)}</Badge>
            </div>
          </div>
          <div>
            <p className='font-medium text-sm'>{t('labels.chain')}</p>
            <p className='mt-2 text-sm'>{transaction?.chain}</p>
          </div>
          <div>
            <p className='font-medium text-sm'>{t('labels.amount')}</p>
            <p className='mt-2 text-sm'>
              {amount} {transaction?.crypto}
            </p>
          </div>
          <div>
            <p className='font-medium text-sm'>{t('labels.related')}</p>
            <p className='mt-2 text-sm'>
              {transaction?.relatedType} #{transaction?.relatedId}
            </p>
          </div>
          <div>
            <p className='font-medium text-sm'>{t('labels.confirmations')}</p>
            <p className='mt-2 text-sm'>{transaction?.confirmations}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetailOverviewUi;
