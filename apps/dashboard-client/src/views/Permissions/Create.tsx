import { useQueryClient, useMutation } from '@tanstack/react-query';
import React from 'react';
import { Button, Form } from '@trg_package/vite/components';
import { ModulePermissions } from '@trg_package/schemas-dashboard/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services } from '@/services/Permissions';
import { services as actionService } from '@/services/Actions';
import { services as permission_actionService } from '@/services/Permission_Action';
import { createPermissionsUsingModulePermissions } from '@/utils/convertPermissionsUsingModulePermissions';
import Fields from './Fields';
import { FormState, InsertFormSchema, InsertState } from './interface';

const Create: React.FC = () => {
  const form = useForm<FormState>({
    resolver: zodResolver(InsertFormSchema)
  });
  const [modulePermissions, setModulePermission] = React.useState<ModulePermissions>({});

  const queryClient = useQueryClient();
  const { mutateAsync: createPermission, isPending: createPermissionLoading } = useMutation({
    mutationFn: async (values: InsertState) => {
      const permissions = createPermissionsUsingModulePermissions(modulePermissions);
      for (const { module_id, action_ids } of permissions) {
        const {
          data: {
            permission: { id: permission_id }
          }
        } = await services.createOne({
          module_id,
          role_id: values.role.id
        });
        for (const action_id of action_ids) {
          await actionService.read({ id: action_id });
          await permission_actionService.createOne({
            permission_id,
            action_id
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Permissions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['Actions', 'getAll'] });
      queryClient.invalidateQueries({ queryKey: ['Roles', 'getAll'] });
      setModulePermission({});
    }
  });

  const handleSubmit = (values: FormState) => {
    createPermission(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <Fields
          modulePermissions={modulePermissions}
          setModulePermissions={setModulePermission}
          form={form}
        />
        <Button
          type="submit"
          className="w-min mt-2"
          isLoading={createPermissionLoading}
        >
          Create Permission
        </Button>
      </form>
    </Form>
  );
};

export default Create;
