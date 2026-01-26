import type { BaseResponseType } from '@/types';
import type { EUserType } from '@/constant';

export interface IUserInfo {
  id: string;
  email: string;
  name: string;
  balance: number;
  twoFAEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  firstname: string;
  lastname: string;
  wallets: any[];
  role?: string;
  permissions?: string[];
  type: EUserType;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface UpdateUserInfoParams {
  email: string;
  firstname: string;
  lastname: string;
  twoFACode: string;
}

export interface UpdateMarketplaceInfoParams {
  email: string;
  firstname: string;
  lastname: string;
  twoFACode: string;
}

export interface RegisterParams {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmPassword: string;
  type: EUserType;
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

export interface UpdatePasswordParams {
  confirmPassword: string;
  twoFACode: string;
}

export interface VerifyParams {
  token: string;
}

export interface VerifyTwoFaSetupParams {
  code: string;
}

export interface VerifyTwoFaSessionParams {
  code: string;
}

export interface VerifyTwoFaParams {
  email: string;
  password: string;
  code: string;
}

export interface DisableTwoFaParams {
  password: string;
  twoFACode: string;
}

export interface SignoutParams {
  refreshToken: string;
}

export type LoginApiResponse = BaseResponseType<{
  accessToken: string;
  refreshToken: string;
  requiresTwoFASetup: boolean;
  requiresTwoFA?: boolean;
}>;

export type SetupTwoFaResponse = BaseResponseType<{
  base32: string;
  otpauth_url: string;
  verified: boolean;
}>;

export type VerifyResponse = BaseResponseType<{
  message: string;
}>;

export type VerifyTwoFaResponse = BaseResponseType<{
  accessToken: string;
  refreshToken: string;
}>;

export type GetUserInfoResponse = BaseResponseType<IUserInfo>;

export type VerifyTwoFaSetupResponse = BaseResponseType<boolean>;

export type UpdateUserInfoResponse = BaseResponseType<IUserInfo>;

export type UpdateMarketplaceInfoResponse = BaseResponseType<IUserInfo>;