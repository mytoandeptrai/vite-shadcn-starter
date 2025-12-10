import type { ForwardedRef, ImgHTMLAttributes } from 'react';
import { forwardRef, useState } from 'react';

interface IImageWithPlaceholderProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
}

const ImageWithPlaceholder = forwardRef<HTMLImageElement, IImageWithPlaceholderProps>(
  ({ src, alt, placeholder = '/svg/no-record.svg', ...props }, ref: ForwardedRef<HTMLImageElement>) => {
    const [error, setError] = useState(false);
    return (
      <img
        ref={ref}
        src={error ? placeholder : src}
        alt={alt}
        onError={() => {
          setError(true);
        }}
        {...props}
      />
    );
  }
);

ImageWithPlaceholder.displayName = 'ImageWithPlaceholder';

export default ImageWithPlaceholder;
