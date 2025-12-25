import type { ITransaction } from '@/apis/transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CopyButton from '@/components/ui/copy-button';
import { useTranslation } from '@/integrations/i18n';

type TransactionDetailBlockchainUiProps = {
  transaction?: ITransaction;
};

const TransactionDetailBlockchainUi = ({ transaction }: TransactionDetailBlockchainUiProps) => {
  const { t } = useTranslation('transaction-detail-page');
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('labels.blockchain-information')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-4'>
          <div>
            <p className='mb-2 font-medium'>{t('labels.txHash')}</p>
            <div className='flex items-center gap-2 rounded-lg bg-muted p-3'>
              <code className='flex-1 break-all text-sm'>{transaction?.txHash}</code>
              <CopyButton value={transaction?.txHash!} />
            </div>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <p className='mb-2 font-medium'>{t('labels.fromAddress')}</p>
              <div className='flex items-center gap-2 rounded-lg bg-muted p-3'>
                <code className='flex-1 break-all text-sm'>{transaction?.fromAddress}</code>
                <CopyButton value={transaction?.fromAddress!} />
              </div>
            </div>

            <div>
              <p className='mb-2 font-medium'>{t('labels.toAddress')}</p>
              <div className='flex items-center gap-2 rounded-lg bg-muted p-3'>
                <code className='flex-1 break-all text-sm'>{transaction?.toAddress}</code>
                <CopyButton value={transaction?.toAddress!} />
              </div>
            </div>
          </div>

          <div>
            <p className='mb-2 font-medium'>{t('labels.smartContract')}</p>
            <div className='flex items-center gap-2 rounded-lg bg-muted p-3'>
              <code className='flex-1 break-all text-sm'>{transaction?.smartContract}</code>
              <CopyButton value={transaction?.smartContract!} />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <p className='font-medium'>{t('labels.blockNumber')}</p>
              <p className='mt-2 text-sm'>{transaction?.blockNumber || '-'}</p>
            </div>
            <div>
              <p className='font-medium'>{t('labels.chain')}</p>
              <p className='mt-2 text-sm'>{transaction?.chain}</p>
            </div>
            <div>
              <p className='font-medium'>{t('labels.network')}</p>
              <p className='mt-2 text-sm'>{transaction?.network}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetailBlockchainUi;
