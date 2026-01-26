import httpInstance from '../http-instance';
import { KEYS } from './keys';
import type {
  DisableTwoFaParams,
  ForgotPasswordParams,
  GetUserInfoResponse,
  LoginApiResponse,
  LoginParams,
  RegisterParams,
  ResendVerificationParams,
  ResetPasswordParams,
  SetupTwoFaResponse,
  SignoutParams,
  UpdateUserInfoParams,
  UpdateUserInfoResponse,
  VerifyParams,
  VerifyResponse,
  VerifyTwoFaResponse,
  VerifyTwoFaParams,
  VerifyTwoFaSetupParams,
  VerifyTwoFaSetupResponse,
  VerifyTwoFaSessionParams,
  UpdatePasswordParams,
  UpdateMarketplaceInfoResponse,
  UpdateMarketplaceInfoParams,
} from './types';

export const getUserInfo = (signal?: AbortSignal) => {
  return httpInstance.get<GetUserInfoResponse>(KEYS.INFO, { signal }).then((res) => res);
};

export const updateUserInfo = (params: UpdateUserInfoParams, signal?: AbortSignal) => {
  return httpInstance.put<UpdateUserInfoResponse>(KEYS.INFO, params, { signal }).then((res) => res);
};

export const login = (params: LoginParams, signal?: AbortSignal) => {
  return httpInstance.post<LoginApiResponse>(KEYS.LOGIN, params, { signal }).then((res) => res);
};

export const register = (params: RegisterParams, signal?: AbortSignal) => {
  return httpInstance
    .post<Record<string, string>>(KEYS.REGISTER, params, {
      signal,
    })
    .then((res) => res);
};

export const resendVerification = (params: ResendVerificationParams, signal?: AbortSignal) => {
  return httpInstance.post(KEYS.RESEND_VERIFICATION, params, { signal }).then((res) => res);
};

export const forgotPassword = (params: ForgotPasswordParams, signal?: AbortSignal) => {
  return httpInstance.post(KEYS.FORGOT_PASSWORD, params, { signal }).then((res) => res);
};

export const resetPassword = (params: ResetPasswordParams, signal?: AbortSignal) => {
  return httpInstance.post(KEYS.RESET_PASSWORD, params, { signal }).then((res) => res);
};

export const verify = (params: VerifyParams) => {
  return httpInstance.get<VerifyResponse>(KEYS.VERIFY, { params }).then((res) => res);
};

export const verifyTwoFa = (params: VerifyTwoFaParams, signal?: AbortSignal) => {
  return httpInstance.post<VerifyTwoFaResponse>(KEYS.TWO_FA_VERIFY, params, { signal }).then((res) => res);
};

export const verifyTwoFaSetup = (params: VerifyTwoFaSetupParams, signal?: AbortSignal) => {
  return httpInstance
    .post<VerifyTwoFaSetupResponse>(KEYS.TWO_FA_VERIFY_SETUP, params, {
      signal,
    })
    .then((res) => res);
};

export const verifyTwoFaSession = (params: VerifyTwoFaSessionParams, signal?: AbortSignal) => {
  return httpInstance
    .post<VerifyTwoFaSetupResponse>(KEYS.TWO_FA_VERIFY_SETUP, params, {
      signal,
    })
    .then((res) => res);
};

export const disabledTwoFa = (params: DisableTwoFaParams, signal?: AbortSignal) => {
  return httpInstance.post(KEYS.TWO_FA_DISABLE, params, { signal }).then((res) => res);
};

export const setupTwoFa = (signal?: AbortSignal) => {
  return httpInstance.post<SetupTwoFaResponse>(KEYS.TWO_FA_SETUP, { signal }).then((res) => res);
};

export const signout = (params: SignoutParams, signal?: AbortSignal) => {
  return httpInstance.post(KEYS.SIGN_OUT, params, { signal }).then((res) => res);
};

export const updatePassword = (params: UpdatePasswordParams, signal?: AbortSignal) => {
  return httpInstance.put(KEYS.UPDATE_PASSWORD, params, { signal }).then((res) => res);
};

export const updateMarketplaceInfo = (params: UpdateMarketplaceInfoParams, signal?: AbortSignal) => {
  return httpInstance.put<UpdateMarketplaceInfoResponse>(KEYS.MARKETPLACE_INFO, params, { signal }).then((res) => res);
};