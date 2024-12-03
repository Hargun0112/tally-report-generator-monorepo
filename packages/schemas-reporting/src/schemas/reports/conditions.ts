import z from 'zod';
import { DetailedColumnSelect } from '../../types';
import { DetailedColumnInsertSchema } from '../../types/Column';

export const ConditionOperations = {
  LIKE: {
    params: { value: 'string' },
    for: ['string']
  },
  ILIKE: {
    params: { value: 'string' },
    for: ['string']
  },
  BETWEEN: {
    params: {
      from: 'string',
      to: 'string',
    },
    for: ['number', 'date']
  },
  '<': {
    params: { value: 'string' },
    for: ['number', 'date']
  },
  '<=': {
    params: { value: 'string' },
    for: ['number', 'date']
  },
  '>': {
    params: { value: 'string' },
    for: ['number', 'date']
  },
  '>=': {
    params: { value: 'string' },
    for: ['number', 'date']
  },
  '=': {
    params: { value: 'string' },
    for: ['string', 'number', 'date']
  },
  IN: {
    params: { value: ['string'] },
    for: ['string', 'date']
  },
  '!=': {
    params: { value: 'string' },
    for: ['string', 'number', 'date']
  },
  'IS NULL': {
    params: null,
    for: ['string', 'number', 'date']
  },
  'IS NOT NULL': {
    params: null,
    for: ['string', 'number', 'date']
  },
};

export type ConditionOperators = keyof typeof ConditionOperations;

const getParamSchema = (paramType: any): z.ZodType => {
  if (paramType === 'string') {
    return z.string().min(1);
  } if (Array.isArray(paramType)) {
    return z.array(getParamSchema(paramType[0]));
  }
  return z.string().min(1);
};

const createParamsSchema = (params: any) => {
  if (params === null) {
    return z.undefined();
  }

  const schemaObj: Record<string, z.ZodType> = {};
  Object.entries(params).forEach(([key, type]) => {
    schemaObj[key] = getParamSchema(type);
  });
  return z.object(schemaObj).strict();
};

const createConditionSchema = () => {
  const baseFields = {
    join: z.enum(['AND','OR','AND NOT','OR NOT']).or(z.undefined()),
    column: DetailedColumnInsertSchema
  };

  const operatorSchemas = Object.entries(ConditionOperations).map(([operator, config]) => z.object({
    ...baseFields,
    operator: z.literal(operator),
    params: createParamsSchema(config.params)
  }));

  const ReportConditionInsertSchema = z.discriminatedUnion('operator', operatorSchemas as [any,...any[]]);

  return ReportConditionInsertSchema;
};

export const ReportConditionInsertSchema = createConditionSchema();

export type ConditionOperation<T extends ConditionOperators> = {
  operator: T | undefined;
  params: typeof ConditionOperations[T]['params'] | undefined;
};

export type ReportConditionInsert = {
  [K in ConditionOperators]: ConditionOperation<K>
}[ConditionOperators] & {
  column : DetailedColumnSelect,
  join : 'AND' | 'OR' | 'AND NOT' | 'OR NOT' | undefined,
  conditionType : 'where' | undefined
};

export type ReportConditionSelect = {
  [K in ConditionOperators]: ConditionOperation<K>
}[ConditionOperators] & {
  column : DetailedColumnSelect,
  join : 'AND' | 'OR' | 'AND NOT' | 'OR NOT' | undefined
  conditionType : 'where' | undefined
};
