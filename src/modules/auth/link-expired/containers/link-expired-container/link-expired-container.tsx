import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Paragraph } from "@/components/ui/typography";
import { Show } from "@/components/utilities";
import { useLinkExpiredContainer } from "../../hooks";

type LinkExpiredContainerProps = {
  email?: string;
};


const LinkExpiredContainer = ({email}: LinkExpiredContainerProps) => {
  const { t, minutes, seconds, isCounting, _isCounting, isLoading, handleClickResend } = useLinkExpiredContainer(email);
  return (
    <Card className='w-full max-w-md gap-10'>
      <CardHeader className='text-center'>
        <CardTitle className='font-bold text-2xl text-gray-800 text-title-sm sm:text-title-md dark:text-white/90'>
          {t('title')}
        </CardTitle>
        <CardDescription className='text-gray-500 text-sm dark:text-gray-400'>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button disabled={isLoading || _isCounting} size='lg' className='w-full' onClick={handleClickResend}>
          <Show when={isLoading}>
            <Spinner />
          </Show>
          {t('buttons.resend-verification')}
        </Button>
        <Show when={isCounting}>
          <Paragraph className='mt-5 text-center'>{`${minutes}:${seconds}`}</Paragraph>
        </Show>
      </CardContent>
    </Card>
  );
};

export default LinkExpiredContainer;
