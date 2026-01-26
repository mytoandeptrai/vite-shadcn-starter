import { AuthProvider } from './auth/auth-provider';
import { DialogProvider } from './dialog/dialog-provider';
import { ThemeProvider } from './theme/theme-provider';

const compose = (providers: React.FC<{ children: React.ReactNode }>[]) => {
  return providers.reduce((Prev, Curr) => ({ children }: { children: React.ReactNode }) => {
    if (!Prev) return <Curr>{children}</Curr>;

    return (
      <Prev>
        <Curr>{children}</Curr>
      </Prev>
    );
  });
};

export const InfraProviders = compose([ThemeProvider, DialogProvider, AuthProvider]);