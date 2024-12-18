import React from 'react';
import { Button, Form } from '@trg_package/vite/components';
import { useAuth } from '@trg_package/vite/providers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { InsertFormSchema, FormState } from './interface';
import Fields from './Fields';

const Create: React.FC = () => {
  const queryClient = useQueryClient();

  const form = useForm<FormState>({
    resolver: zodResolver(InsertFormSchema),
  });

  const {
    signUp: { mutation: signUp, isLoading }
  } = useAuth();

  const handleSubmit = async (_: FormState) => {
    const values = InsertFormSchema.parse(_);
    await signUp(values);
    queryClient.invalidateQueries({ queryKey: ['Users', 'getAll'] });
    form.reset();
  };

  return (
    <Form {...form}>
      <form className="h-full flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <Fields
          form={form}
          type='Create'
        />
        <Button isLoading={isLoading} type="submit" className="w-full mt-auto">
          Create
        </Button>
      </form>
    </Form>
  );
};

export default Create;
