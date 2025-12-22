import { useEffect, useRef } from 'react';
import { DemoForm } from '../components/demo-form';

export function DemoFormContainer() {
  const workerRef = useRef<Worker | undefined>(undefined);

  useEffect(() => {
    if (window.Worker) {
      const worker = new Worker(new URL('@/workers/my.worker.ts?worker', import.meta.url), {
        type: 'module',
      });
      workerRef.current = worker;

      workerRef.current.postMessage('Hello from the main thread!');

      workerRef.current.onmessage = (event: MessageEvent<string>) => {
        console.log(`Main thread received: ${event.data}`);
      };

      workerRef.current.onerror = (error: ErrorEvent) => {
        console.error(`Worker error: ${error.message}`);
      };
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = undefined;
      }
    };
  }, []);

  return (
    <div className='min-h-screen from-gray-50 to-gray-100 py-12 dark:from-gray-900 dark:to-gray-800'>
      <DemoForm />
    </div>
  );
}
