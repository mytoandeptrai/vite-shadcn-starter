import { messageError } from '@/constant';

export const checkURLAndError = (url: string, errorCode: string, showAlert: () => void) => {
  const conditions = [
    { url: '/info', errorCode: '' },
    { url: '', errorCode: 'REQUESTED' },
    { url: '', errorCode: 'FORGOT_PASSWORD_CODE_EXPIRED' },
    { url: '', errorCode: 'FORGOT_PASSWORD_LINK_ALREADY_USED' },
    { url: '/register', errorCode: messageError.EMAIL_EXISTED },
    {
      url: '/verify',
      errorCode: [messageError.ACTIVE_CODE_EXPIRED, messageError.USER_ACTIVATED],
    },
    {
      url: '/change-password',
      errorCode: messageError.MATCH_CURRENT_PASSWORD,
    },
    {
      url: '/login',
      errorCode: messageError.NEED_TWO_FA,
    },
    {
      url: '/2fa/setup',
      errorCode: messageError.UNAUTHORIZED,
    },
  ];

  for (const condition of conditions) {
    if (
      (condition.url === url || condition.url === '') &&
      (Array.isArray(condition.errorCode)
        ? condition.errorCode.includes(errorCode)
        : condition.errorCode === errorCode || condition.errorCode === '')
    ) {
      return;
    }
  }

  showAlert();
};
