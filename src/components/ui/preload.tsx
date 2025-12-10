'use client';

import type { LottieRefCurrentProps } from 'lottie-react';
import Lottie from 'lottie-react';
import { useEffect, useRef, useState } from 'react';
import type { FCC } from '@/types';
import animationData from '../../../public/lottie-loader.json';

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
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    lottieRef.current?.setSpeed(speed);
  }, [speed]);

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
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        className='block h-auto md:w-[10%]'
        rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
      />
    </div>
  );
};

export default Preload;
