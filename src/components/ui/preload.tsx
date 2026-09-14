'use client';

import { Lottie } from 'lottie-react';
import { useEffect, useState } from 'react';
import type { FCC } from '@/types';
import animationData from '@/assets/lottie/lottie-loader.json';

const sources: string[] = ['sample-1.jpeg', 'sample-2.jpeg', 'sample-3.jpeg', 'sample-4.jpeg'];

function loadAll() {
  const promises = sources.map((source) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = `/images/${source}`;
      img.onload = () => resolve(true);
    });
  });

  return Promise.allSettled(promises);
}

type PreloadProps = {
  speed?: number;
  loop?: boolean;
  autoplay?: boolean;
};

const Preload: FCC<PreloadProps> = ({ children, speed = 1.5, loop = true, autoplay = true }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await loadAll();
      setTimeout(() => {
        setLoaded(true);
      }, 3000);
    })();
  }, []);

  if (loaded) return <>{children}</>;

  return (
    <div className='fixed inset-0 z-999 flex min-h-screen items-center justify-center bg-background'>
      <Lottie
        src={animationData}
        loop={loop}
        speed={speed}
        autoplay={autoplay}
        className='block h-auto md:w-[10%]'
        rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
      />
    </div>
  );
};

export default Preload;
