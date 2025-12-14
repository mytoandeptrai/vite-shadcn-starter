import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ISDK } from '../../types/sdk.types';
import { Github } from 'lucide-react';

type SDKGridItemUiProps = {
  sdk: ISDK;
  onClick: () => void;
};

const SDKGridItemUi = ({ sdk, onClick }: SDKGridItemUiProps) => {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:border-primary/50',
        'group'
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
              {sdk.name}
            </h3>
            {sdk.version && (
              <p className="text-sm text-muted-foreground mb-2">v{sdk.version}</p>
            )}
            <p className="text-sm text-muted-foreground line-clamp-2">{sdk.description}</p>
          </div>
          {sdk.githubUrl && (
            <Github className="size-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SDKGridItemUi;
