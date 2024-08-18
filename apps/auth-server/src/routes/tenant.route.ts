import { z } from 'zod';
import { Router } from 'express';
import {
  readOne,
  readAll,
  deleteOne,
  updateOne,
  createOne
} from '../controller/tenant.controller';
import { validateSchema } from '@trg_package/middlewares';
import {
  TenantInsertSchema,
  UserInsertSchema
} from '@trg_package/auth-schemas/types';

const tenantRouter = Router();

tenantRouter.get('/read', readAll);

tenantRouter.post(
  '/create',
  validateSchema({
    body: z.object({
      tenant: TenantInsertSchema.pick({
        name: true
      }),
      user: UserInsertSchema.pick({
        first_name: true,
        last_name: true,
        email: true,
        password: true
      })
    })
  }),
  createOne
);

tenantRouter.get(
  '/read/:id',
  validateSchema({
    params: TenantInsertSchema.pick({
      id: true
    })
  }),
  readOne
);

tenantRouter.patch(
  '/update/:id',
  validateSchema({
    body: TenantInsertSchema.extend({
      name: TenantInsertSchema.shape.name.optional(),
      status: TenantInsertSchema.shape.status.optional(),
      isReadonly: TenantInsertSchema.shape.isReadonly.optional(),
      deletedAt: TenantInsertSchema.shape.deletedAt.optional(),
      approvedAt: TenantInsertSchema.shape.approvedAt.optional()
    }).pick({
      name: true,
      status: true,
      isReadonly: true,
      deletedAt: true,
      approvedAt: true
    }),
    params: TenantInsertSchema.pick({
      id: true
    })
  }),
  updateOne
);

tenantRouter.delete(
  '/delete/:id',
  validateSchema({
    params: TenantInsertSchema.pick({
      id: true
    })
  }),
  deleteOne
);

export default tenantRouter;
