import {
  UserSelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/vite/client';

const usersAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/users/me',
    withCredentials: true
  }
);

export const services : { updateOne : any, deleteOne : any } = {
  updateOne: async (data: Partial<UserSelect>) => usersAxios.patch('/update', data),
  deleteOne: async () => usersAxios.delete('/delete')
};
