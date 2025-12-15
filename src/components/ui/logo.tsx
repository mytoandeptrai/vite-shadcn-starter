interface LogoProps {
  variant?: "default" | "mobile" | "glass";
}

function GlassLogo() {
  return <img src="/logo192.png" alt="Logo" width={192} height={19} />;
}

function DefaultLogo() {
  return (
    <div className="w-auto h-9">
      <img
        src="/images/logo.png"
        alt="Logo"
        className="w-full h-full object-center"
      />
    </div>
  );
}

function MobileLogo() {
  return (
    <div className="w-auto h-8">
      <img
        src="/images/logo.png"
        alt="Logo"
        className="w-full h-full object-center"
      />
    </div>
  );
}

export function Logo({ variant = "default" }: LogoProps) {
  /** Navigate with tanstack router */
  return (
    <>
      {variant === "default" ? (
        <DefaultLogo />
      ) : variant === "mobile" ? (
        <MobileLogo />
      ) : (
        <GlassLogo />
      )}
    </>
  );
}
