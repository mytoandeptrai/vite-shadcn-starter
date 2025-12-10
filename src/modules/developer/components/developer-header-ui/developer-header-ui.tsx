import { Paragraph, SectionHeading } from '@/components/ui/typography';
import { Show } from '@/components/utilities';

type DeveloperHeaderUiProps = {
  title: string;
  description: string;
  descriptionNode?: React.ReactNode;
};

const DeveloperHeaderUi = ({ title, description, descriptionNode }: DeveloperHeaderUiProps) => {
  return (
    <div className='mb-4 flex items-start justify-between'>
      <div>
        <Show when={!!title}>
          <SectionHeading>{title ?? ''}</SectionHeading>
        </Show>
        {descriptionNode ?? (
          <Show when={!!description}>
            <Paragraph className='mt-2 text-muted-foreground' size='sm'>
              {description ?? ''}
            </Paragraph>
          </Show>
        )}
      </div>
    </div>
  );
};

export default DeveloperHeaderUi;
