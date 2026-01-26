import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { KEYS } from './keys';
import {
  disabledTwoFa,
  forgotPassword,
  getUserInfo,
  login,
  register,
  resendVerification,
  resetPassword,
  setupTwoFa,
  signout,
  updateMarketplaceInfo,
  updatePassword,
  updateUserInfo,
  verify,
  verifyTwoFa,
  verifyTwoFaSession,
  verifyTwoFaSetup,
} from './requests';
import type {
  DisableTwoFaParams,
  ForgotPasswordParams,
  GetUserInfoResponse,
  LoginParams,
  RegisterParams,
  ResendVerificationParams,
  ResetPasswordParams,
  SetupTwoFaResponse,
  SignoutParams,
  UpdateMarketplaceInfoParams,
  UpdatePasswordParams,
  UpdateUserInfoParams,
  VerifyParams,
  VerifyTwoFaParams,
  VerifyTwoFaSessionParams,
  VerifyTwoFaSetupParams,
} from './types';

export const useGetUserInfo = (options?: Omit<UseQueryOptions<GetUserInfoResponse, Error>, 'queryKey'>) => {
  return useQuery<GetUserInfoResponse, Error>({
    queryKey: [KEYS.INFO],
    queryFn: ({ signal }) => getUserInfo(signal),
    ...options,
  });
};

export const useSetupTwoFa = (options?: Omit<UseQueryOptions<SetupTwoFaResponse, Error>, 'queryKey'>) => {
  return useQuery<SetupTwoFaResponse, Error>({
    queryKey: [KEYS.TWO_FA_SETUP],
    queryFn: ({ signal }) => setupTwoFa(signal),
    ...options,
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: [KEYS.LOGIN],
    mutationFn: (data: LoginParams) => login(data),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: [KEYS.REGISTER],
    mutationFn: (data: RegisterParams) => register(data),
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationKey: [KEYS.RESEND_VERIFICATION],
    mutationFn: (data: ResendVerificationParams) => resendVerification(data),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationKey: [KEYS.FORGOT_PASSWORD],
    mutationFn: (data: ForgotPasswordParams) => forgotPassword(data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: [KEYS.RESET_PASSWORD],
    mutationFn: (data: ResetPasswordParams) => resetPassword(data),
  });
};

export const useVerify = () => {
  return useMutation({
    mutationKey: [KEYS.VERIFY],
    mutationFn: (data: VerifyParams) => verify(data),
  });
};

export const useVerifyTwoFa = () => {
  return useMutation({
    mutationKey: [KEYS.TWO_FA_VERIFY],
    mutationFn: (data: VerifyTwoFaParams) => verifyTwoFa(data),
  });
};

export const useSignout = () => {
  return useMutation({
    mutationKey: [KEYS.SIGN_OUT],
    mutationFn: (data: SignoutParams) => signout(data),
  });
};

export const useVerifySetup = () => {
  return useMutation({
    mutationKey: [KEYS.TWO_FA_VERIFY_SETUP],
    mutationFn: (data: VerifyTwoFaSetupParams) => verifyTwoFaSetup(data),
  });
};

export const useDisableTwoFa = () => {
  return useMutation({
    mutationKey: [KEYS.TWO_FA_DISABLE],
    mutationFn: (data: DisableTwoFaParams) => disabledTwoFa(data),
  });
};

export const useUpdateUserInfo = () => {
  return useMutation({
    mutationKey: [KEYS.INFO],
    mutationFn: (data: UpdateUserInfoParams) => updateUserInfo(data),
  });
};

export const useUpdateMarketplaceInfo = () => {
  return useMutation({
    mutationKey: [KEYS.MARKETPLACE_INFO],
    mutationFn: (data: UpdateMarketplaceInfoParams) => updateMarketplaceInfo(data),
  });
};

export const useVerifyTwoFaSession = () => {
  return useMutation({
    mutationKey: [KEYS.TWO_FA_VERIFY_SESSION],
    mutationFn: (data: VerifyTwoFaSessionParams) => verifyTwoFaSession(data),
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationKey: [KEYS.UPDATE_PASSWORD],
    mutationFn: (data: UpdatePasswordParams) => updatePassword(data),
  });
};
