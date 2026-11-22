import { Coffee, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const QR = { src: '/donate-qr.jpg', width: 720, height: 975 };

/** "Buy me a coffee": a button that opens the author's bank-transfer QR code. */
export function DonateButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      // The dialog owns the keyboard while it is open: the simulator's shortcuts stay out of it.
      e.stopImmediatePropagation();
      if (e.code === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [open]);

  return (
    <>
      <button
        type='button'
        data-testid='donate-button'
        onClick={() => setOpen(true)}
        className='flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-400/10 px-3 py-1.5 font-semibold text-amber-200 text-xs hover:bg-amber-400/20 sm:text-sm'
      >
        <Coffee className='size-4' />
        Buy me a coffee
      </button>

      {open && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: clicking the backdrop is a shortcut; Escape closes the dialog
        <div
          className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/75 p-3 sm:p-6'
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='ds-donate-title'
            data-testid='donate-dialog'
            className='my-auto w-full max-w-sm rounded-2xl border border-white/15 bg-slate-900 p-4 text-white shadow-2xl'
          >
            <div className='flex items-start gap-3'>
              <div className='min-w-0 flex-1'>
                <h2 id='ds-donate-title' className='m-0 border-0 p-0 font-black text-lg leading-tight'>
                  Mời mình ly cà phê
                </h2>
                <p className='m-0 mt-1 text-sm text-white/70 leading-snug'>
                  Nếu jacobhocoto giúp bạn luyện thi, quét mã bằng ứng dụng ngân hàng để ủng hộ. Cảm ơn bạn!
                </p>
              </div>
              <button
                type='button'
                data-testid='donate-close'
                aria-label='Đóng'
                onClick={() => setOpen(false)}
                className='flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/15 hover:border-white/40'
              >
                <X className='size-5' />
              </button>
            </div>
            <img
              src={QR.src}
              width={QR.width}
              height={QR.height}
              alt='Mã QR chuyển khoản Techcombank: TRAN PHUOC MY TOAN, số tài khoản 9941 2759 46'
              className='mx-auto mt-3 h-auto max-h-[70dvh] w-auto max-w-full rounded-xl bg-white'
            />
          </div>
        </div>
      )}
    </>
  );
}
