/* eslint-disable no-nested-ternary */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import {
  Button, Form, Skeleton
} from '@trg_package/vite/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { services } from '@/services/Reports';
import Fields from './Fields';
import { FormState, SelectFormSchema, SelectState } from './interface';

const Update: React.FC<Pick<SelectState, 'id'>> = ({ id }) => {
  const queryClient = useQueryClient();
  const { data: reportData, isFetching: loadingReport } = useQuery({
    queryFn: () => services.read({ id }),
    select: (data) => SelectFormSchema.parse(data.data.reports[0]),
    queryKey: ['Reports', id, 'getOne']
  });

  const form = useForm<FormState>({
    resolver: zodResolver(SelectFormSchema.omit({ baseEntity: true })),
    values: reportData
  });

  const { mutateAsync: updateReport, isPending: updatingReport } = useMutation({
    mutationFn: (reportUpdate: FormState) => services.updateOne({ id }, reportUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Reports', 'getAll'] });
    }
  });

  const handleSubmit = async (values: FormState) => {
    const { data: { report } } = await updateReport(values);
    form.resetField('name', { defaultValue: report.name });
    form.resetField('description', { defaultValue: report.description });
    form.resetField('baseEntity', { defaultValue: report.baseEntity });
  };

  return (
    <Form {...form}>
      <form className="h-full flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <Skeleton isLoading={loadingReport}>
          <Fields
            form={form}
            disabledFields={{
              baseEntity: true
            }}
          />
          <Button
            isLoading={updatingReport}
            type="submit"
            className="mt-auto"
          >
            Update
          </Button>
        </Skeleton>
      </form>
    </Form>
  );
};

export default Update;
