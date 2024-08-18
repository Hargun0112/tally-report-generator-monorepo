import { AxiosPromise } from 'axios';
import {
  RegisterUser,
  LoginUser,
  UserSelect
} from '@trg_package/auth-schemas/types';
import axios from '@/services/client';

export const services = {
  signUp: (data: RegisterUser): AxiosPromise<Omit<UserSelect, 'password'>> => {
    return axios.post(`/auth/sign-up`, data);
  },
  signIn: (
    data: LoginUser
  ): AxiosPromise<{
    user: Omit<UserSelect, 'password'>;
    resetPasswordLink?: string;
  }> => {
    return axios.post(`/auth/sign-in`, data);
  },
  forgot_password: (data: {
    email: UserSelect['email'];
  }): AxiosPromise<{ message: string }> => {
    return axios.post('/auth/forgot-password', data);
  },
  check_reset_password: (token: string): AxiosPromise<{ token: string }> => {
    return axios.post(`/auth/check-reset-password/${token}`);
  },
  reset_password: (data: {
    token: string;
    password: string;
    confirmPassword: string;
  }): AxiosPromise<{ message: string }> => {
    const { token, ...rest } = data;
    return axios.post(`/auth/reset-password/${token}`, rest);
  }
};
