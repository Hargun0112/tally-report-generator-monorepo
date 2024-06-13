import { AxiosPromise } from 'axios';
import { LoginUser, RegisterUser, User } from '@fullstack_package/interfaces';
import axios from './client';

const services = {
  auth: {
    signIn: (data: LoginUser): AxiosPromise<User> => {
      return axios.post(`/auth/sign-in`, data);
    },
    signUp: (data: RegisterUser): AxiosPromise<User> => {
      return axios.post(`/auth/sign-up`, data);
    },
    status: (): AxiosPromise<{
      user: User | null;
      isAuthenticated: boolean;
    }> => {
      return axios.get(`/auth/status`);
    },
    signOut: (): AxiosPromise<{ message: string }> => {
      return axios.post(`/auth/sign-out`);
    }
  },
  role: {
    getAll: async (): AxiosPromise<{
      roles: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
      }[];
    }> => {
      return axios.get('/role/all');
    },
    createOne: async (data: {
      roleName: string;
      rolePermissions: {
        module_id: string;
        action_id: string;
      }[];
    }): AxiosPromise => {
      const { role } = (
        await axios.post(`/role/create`, { name: data.roleName })
      ).data;

      return axios.post('/role/assignPermission', {
        permissions: data.rolePermissions,
        roleId: role.id
      });
    }
  },
  user: {
    getAll: async (): AxiosPromise<{
      users: (User & { role: { id: string; name: string } })[];
    }> => {
      return axios.get('/user/all');
    },
    assignRole: async (
      userIds: string[],
      roleId: string
    ): AxiosPromise<string[]> => {
      return axios.post('/user/assignRole', { userIds, roleId });
    }
  },
  module: {
    getAll: async (): AxiosPromise<{
      modules: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
      }[];
    }> => {
      return axios.get('/module/all');
    }
  },
  action: {
    getAll: async (): AxiosPromise<{
      actions: {
        id: string;
        name: string;
        createdAt: Date;
        updateAt: Date;
      }[];
    }> => {
      return axios.get('/action/all');
    }
  }
};

export default services;
