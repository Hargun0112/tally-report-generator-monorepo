import createAxiosClient from '@trg_package/vite/client';
import { PermissionActionInsert, PermissionActionSelect } from '@trg_package/schemas-dashboard/types';
import { CrudServices } from '.';

const permissionActionsAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/permission_action',
    withCredentials: true
  }
);

export const services: CrudServices<
'permissionAction',
PermissionActionSelect,
PermissionActionInsert,
PermissionActionSelect,
{ permissionId: string, actionId: string }
> = {
  read: async (query) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return permissionActionsAxios.get(`/read?${queryString}`);
  },
  createOne: async (permissionActionDetails) => permissionActionsAxios.post('/create', permissionActionDetails),
  updateOne: async ({ permissionId, actionId }, data) => permissionActionsAxios.patch(`/update/${permissionId}/${actionId}`, data),
  deleteOne: async ({ permissionId, actionId }) => permissionActionsAxios.delete(`/delete/${permissionId}/${actionId}`)
};
