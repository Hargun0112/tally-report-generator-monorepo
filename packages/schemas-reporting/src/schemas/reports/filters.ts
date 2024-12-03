import z from 'zod';
import { DetailedColumnSelect } from '../../types';
import { DetailedColumnInsertSchema } from '../../types/Column';

export const FilterOperations = {
  select: {
    params: {
      value: ['string']
    },
    for: ['string']
  },
  search: {
    params: {
      value: 'string'
    },
    for: ['string']
  },
  between: {
    params: {
      from: 'string',
      to: 'string'
    },
    for: ['number','date']
  }
};

export type FilterTypes = keyof typeof FilterOperations;

export const ReportFilterInsertSchema = z.object({
  column: DetailedColumnInsertSchema,
  filterType: z.enum(['between','search','select'])
});

export type ReportFilterInsert = {
  column: DetailedColumnSelect,
  filterType : FilterTypes | undefined,
  conditionType : 'having' | undefined,
  columnName : string | undefined

};

export type ReportFilterSelect = {
  column : DetailedColumnSelect,
  filterType : FilterTypes | undefined,
  conditionType : 'having' | undefined,
  columnName : string | undefined
};

export type ReportFilterConfig = {
  [K : DetailedColumnSelect['alias']] : {
    filterType : FilterTypes | undefined,
    dataSource : string | null,
    heading : DetailedColumnSelect['heading']
    queryCondition : string,
    conditionType : 'where' | 'having'
  }
};

export type GeneratedReportFilters = {
  data : Array<{ label : string,value : string }> | null
  label : string,
  fieldName : string
  filterType : FilterTypes | undefined;
};

export type RuntimeFilters = {
  [K : string] : typeof FilterOperations[FilterTypes]['params']
};

export const FilterValueSchema = z.union([
  z.object({ value: z.union([z.string(), z.array(z.string())]) }),
  z.object({ from: z.string(), to: z.string() }).partial()
]);
