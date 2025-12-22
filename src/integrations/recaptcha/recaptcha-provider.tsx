import { env } from '@/constant';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

type RecaptchaProviderProps = { children: React.ReactNode };

const RecaptchaProvider = ({ children }: RecaptchaProviderProps) => {
  return <GoogleReCaptchaProvider reCaptchaKey={env.RECAPTCHA_SITE_KEY}>{children}</GoogleReCaptchaProvider>;
};

export default RecaptchaProvider;
