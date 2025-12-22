interface LogoProps {
  variant?: 'default' | 'mobile' | 'glass';
}

function GlassLogo() {
  return <img src='/images/logo.png' alt='Logo' width={192} height={19} />;
}

function DefaultLogo() {
  return (
    <div className='h-9 w-auto'>
      <img src='/images/logo.png' alt='Logo' className='h-full w-full object-center' />
    </div>
  );
}

function MobileLogo() {
  return (
    <div className='h-8 w-auto'>
      <img src='/images/logo.png' alt='Logo' className='h-full w-full object-center' />
    </div>
  );
}

export function Logo({ variant = 'default' }: LogoProps) {
  /** Navigate with tanstack router */
  return <>{variant === 'default' ? <DefaultLogo /> : variant === 'mobile' ? <MobileLogo /> : <GlassLogo />}</>;
}
