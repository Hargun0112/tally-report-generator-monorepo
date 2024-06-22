import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Switch,
  Label
} from '@/components/ui';
import services from '@/services';
import { Module } from '@/models';
import Fields from './Fields';

type State = Pick<Module, 'name' | 'isPrivate' | 'icon'>;

const initialState: State = {
  name: '',
  isPrivate: false,
  icon: ''
};

const CreateModule: React.FC = () => {
  const [moduleDetails, setModuleDetails] = React.useState<State>(initialState);

  const queryClient = useQueryClient();
  const { mutateAsync: createModule, isPending: loadingCreateModule } =
    useMutation({
      mutationFn: () => services.module.createOne(moduleDetails),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['modules', 'getAll'] });
      },
      onSettled: () => {
        setModuleDetails(initialState);
      }
    });

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Create Module
        </CardTitle>
        <CardDescription>
          Create Modules for storing your company data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createModule();
          }}
          className="flex flex-col gap-4"
        >
          <Fields
            moduleDetails={moduleDetails}
            setModuleDetails={setModuleDetails}
          />
          <Button
            type="submit"
            className="w-min mt-2"
            isLoading={loadingCreateModule}
          >
            Create Module
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateModule;
