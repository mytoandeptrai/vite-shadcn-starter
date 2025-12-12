import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { KEYS } from "./keys";
import {
  forgotPassword,
  getUserInfo,
  login,
  register,
  resendVerification,
  resetPassword,
  setupTwoFa,
  signout,
  verify,
  verifyTwoFa,
} from "./requests";
import type {
  ForgotPasswordParams,
  GetUserInfoResponse,
  LoginParams,
  RegisterParams,
  ResendVerificationParams,
  ResetPasswordParams,
  SignoutParams,
  VerifyParams,
  VerifyTwoFaParams,
} from "./types";

export const useGetUserInfo = (
  options?: Omit<UseQueryOptions<GetUserInfoResponse, Error>, "queryKey">
) => {
  return useQuery<GetUserInfoResponse, Error>({
    queryKey: [KEYS.INFO],
    queryFn: ({ signal }) => getUserInfo(signal),
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

export const useSetupTwoFa = () => {
  return useMutation({
    mutationKey: [KEYS.TWO_FA_SETUP],
    mutationFn: () => setupTwoFa(),
  });
};

export const useSignout = () => {
  return useMutation({
    mutationKey: [KEYS.SIGN_OUT],
    mutationFn: (data: SignoutParams) => signout(data),
  });
};