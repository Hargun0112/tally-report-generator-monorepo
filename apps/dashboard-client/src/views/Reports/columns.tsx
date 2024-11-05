import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { FormState } from './interface';
import Action from '@/components/composite/dashboard/Action';
import SortingButton from '@/components/composite/SortingButton';

export const columns: ColumnDef<FormState>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortingButton column={column} label="Module Name" />,
    cell: ({ row }) => {
      const report = row.original;
      return (
        <Link to={`/reports/${report.id}`}>
          <span className="flex gap-4 items-center">
            {report.name}
          </span>
        </Link>
      );
    }
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <SortingButton column={column} label="Module Name" />
  },
  {
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => {
      const report = row.original;
      return (
          <Action
            module={{
              id: report.id,
              name: report.name,
              type: 'Reports'
            }}
          />
      );
    }
  }
];
