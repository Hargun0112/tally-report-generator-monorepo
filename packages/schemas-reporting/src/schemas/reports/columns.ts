import z from 'zod';
import { DetailedColumnSelect } from '../../types';
import { DetailedColumnInsertSchema } from '../../types/Column';

export type ColumnOperators = keyof typeof ColumnOperations;
export const ColumnOperations = {
  COUNT: {
    params: { value: null },
    for: ['string', 'number', 'date']
  },
  MAX: {
    params: { value: null },
    for: ['string', 'number', 'date']
  },
  MIN: {
    params: { value: null },
    for: ['string', 'number', 'date']
  },
  SUM: {
    params: { value: null },
    for: ['number']
  },
  AVG: {
    params: { value: null },
    for: ['number']
  }
};

const ColumnOpertors = [...Object.keys(ColumnOperations).map((key) => key)] as const;

export const ReportColumnInsertSchema = z.object({
  column: DetailedColumnInsertSchema,
  heading: z.string(),
  operation: z.enum(ColumnOpertors as [string,...string[]]).or(z.undefined())
});

export type ReportColumnInsert = {
  column: DetailedColumnSelect,
  heading: string,
  operation: ColumnOperators | undefined;
};

export type ReportColumnSelect = {
  column: DetailedColumnSelect,
  heading: string,
  operation: ColumnOperators | undefined;
};

export type ReportColumnConfig = {
  alias : string,
  heading : string
};

export type GeneratedReportColumns = ReportColumnConfig;
