import { useEffect } from 'react';

type Props = {
  email?: string;
  code?: number;
  to?: string;
};

export const useActiveContainer = (props: Props) => {
  const { email, code, to } = props;

  useEffect(() => {
    const activeUserRequest = async () => {
      /** Todo: request base on email and code */
      console.log('🚀 ~ activeUserRequest ~ email:', email);
      console.log('🚀 ~ activeUserRequest ~ code:', code);
    };

    const forgotPasswordRequest = async () => {
      /** Todo: request base on email and code */
      console.log('🚀 ~ forgotPasswordRequest ~ email:', email);
      console.log('🚀 ~ forgotPasswordRequest ~ code:', code);
    };

    if (to === 'activate') {
      activeUserRequest();
    }

    if (to === 'forgot-password') {
      forgotPasswordRequest();
    }
  }, [email, code, to]);

  return {};
};