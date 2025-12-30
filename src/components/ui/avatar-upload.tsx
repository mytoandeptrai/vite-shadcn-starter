'use client';

import { Button } from '@/components/ui/button';
import { formatBytes, useFileUpload, type FileWithPreview } from '@/hooks/use-file-upload';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { User, X } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarUploadProps {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  defaultAvatar?: string;
}

export default function AvatarUpload({
  maxSize = 2 * 1024 * 1024, // 2MB
  className,
  onFileChange,
  defaultAvatar,
}: AvatarUploadProps) {
  const { t } = useTranslation('');
  const [
    { files, isDragging },
    { removeFile, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: 'image/*',
    multiple: false,
    onFilesChange: (files) => {
      onFileChange?.(files[0] || null);
    },
    onError(errors) {
      toast.error(errors.join(', '));
    },
  });

  const currentFile = files[0];
  const previewUrl = currentFile?.preview || defaultAvatar;

  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id);
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Avatar Preview */}
      <div className='relative'>
        <div
          className={cn(
            'group/avatar relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/20',
            previewUrl && 'border-solid'
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              openFileDialog();
            }
          }}
          role='button'
          tabIndex={0}
        >
          <input {...getInputProps()} className='sr-only' />

          {previewUrl ? (
            <img src={previewUrl} alt='Avatar' className='h-full w-full object-cover' />
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <User className='size-6 text-muted-foreground' />
            </div>
          )}
        </div>

        {/* Remove Button - only show when file is uploaded */}
        {currentFile && (
          <Button
            size='icon'
            variant='outline'
            onClick={handleRemove}
            className='absolute end-0 top-0 size-6 rounded-full'
            aria-label='Remove avatar'
          >
            <X className='size-3.5' />
          </Button>
        )}
      </div>

      {/* Upload Instructions */}
      <div className='space-y-0.5 text-center'>
        <p className='font-medium text-sm'>{currentFile ? t('labels.avatar-uploaded') : t('labels.upload-avatar')}</p>
        <p className='text-muted-foreground text-xs'>{t('labels.png-jpg-up-to', { size: formatBytes(maxSize) })}</p>
      </div>
    </div>
  );
}
