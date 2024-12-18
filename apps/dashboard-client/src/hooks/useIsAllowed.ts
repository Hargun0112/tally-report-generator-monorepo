import {
  ActionSelect,
  ModuleSelect
} from '@trg_package/schemas-dashboard/types';
import { useAuth } from '@trg_package/vite/providers';

export const useIsAllowed = ({
  module,
  action
}: {
  module: ModuleSelect['name'];
  action: ActionSelect['name'];
}): boolean => {
  const { permissions } = useAuth();

  const isAllowed = permissions.find(
    (permission) => permission.actions.includes(action)
      && permission.module.name === module
  );

  if (isAllowed) return true;
  return false;
};
