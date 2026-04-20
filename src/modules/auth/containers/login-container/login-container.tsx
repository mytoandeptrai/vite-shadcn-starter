import { LoginForm } from '@/modules/auth/ui/login-form/login-form';
import { useLoginContainer } from '../../hooks/use-login-container';

const LoginContainer = () => {
  const { isLoading, handleSubmit } = useLoginContainer();

  return <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />;
};

export default LoginContainer;
