import { Dispatch, SetStateAction } from 'react';
import { DetailedPermission } from '@/models';
import { State as RoleState } from '../Roles/interface';

export interface State
  extends Pick<
    DetailedPermission,
    'id' | 'module' | 'role' | 'permissionAction'
  > {}

export const initialState: State = {
  id: '',
  module: {
    name: '',
    id: ''
  },
  permissionAction: [],
  role: {
    name: '',
    id: ''
  }
};

export interface ModulePermissions {
  [module_id: string]: {
    [action_id: string]: boolean;
  };
}

export interface StateAsProps {
  // permissionsData: State;
  // setPermissionsData: Dispatch<SetStateAction<State>>;
  role?: RoleState['name'];
  setRole?: Dispatch<SetStateAction<RoleState['name']>>;
  modulePermissions: ModulePermissions;
  setModulePermissions: Dispatch<SetStateAction<ModulePermissions>>;
}