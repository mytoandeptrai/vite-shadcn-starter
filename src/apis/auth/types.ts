import type { BaseResponseType } from "@/types";

export interface IUserInfo {
  id: string;
  email: string;
  name: string;
  balance: number;
  twoFAEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface ResendVerificationParams {
  email: string;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface ResetPasswordParams {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyParams {
  token: string;
}

export interface VerifyTwoFaSetupParams {
  code: string;
}

export interface VerifyTwoFaParams {
  email: string;
  password: string;
  code: string;
}

export interface DisableTwoFaParams {
  password: string;
}

export interface SignoutParams {
  refreshToken: string;
}

export type LoginApiResponse = BaseResponseType<{
  accessToken: string;
  refreshToken: string;
  requiresTwoFASetup: boolean;
}>;

export type SetupTwoFaResponse = BaseResponseType<{
  base32: string;
  otpauth_url: string;
  verified: boolean;
}>;

export type VerifyResponse = BaseResponseType<{
  message: string;
}>;

export type GetUserInfoResponse = BaseResponseType<IUserInfo>;