import { AxiosPromise } from 'axios';
import axios from './client';
import { DetailedUser } from '../../../../packages/schemas-dashboard/dist/types';

const services = {
  Authentication: {
    status: (): AxiosPromise<{
      user: DetailedUser | null;
      isAuthenticated: boolean;
    }> => {
      return axios.get(`/auth/status`);
    },
    signOut: (): AxiosPromise<{ message: string }> => {
      return axios.post(`/auth/sign-out`);
    }
  }
};

export default services;
