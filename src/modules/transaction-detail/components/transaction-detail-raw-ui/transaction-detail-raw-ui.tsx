import type { ITransaction } from '@/apis/transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

type TransactionDetailRawUiProps = {
  transaction?: ITransaction;
};

const TransactionDetailRawUi = ({ transaction }: TransactionDetailRawUiProps) => {
  const [expandedRawData, setExpandedRawData] = useState(false);

  return (
    <Card>
      <CardHeader>
        <button
          type='button'
          onClick={() => setExpandedRawData(!expandedRawData)}
          className='flex w-full items-center justify-between'
        >
          <CardTitle>Raw Data</CardTitle>
          {expandedRawData ? <ChevronUp className='h-5 w-5' /> : <ChevronDown className='h-5 w-5' />}
        </button>
      </CardHeader>
      {expandedRawData && (
        <CardContent>
          <div className='overflow-x-auto rounded-lg bg-muted p-4'>
            <pre className='font-mono text-xs'>{JSON.stringify(transaction?.rawData, null, 2)}</pre>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TransactionDetailRawUi;
