import { BaseServiceNew } from '@trg_package/base-service';
import { ActionSchema } from '../schemas';
import * as dashboardSchemas from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ActionInsert, ActionSelect } from '../types';
import { RoleService } from './role.service';
import { PermissionActionService } from './permissionAction.service';
import { PermissionService } from './permission.service';
import { NotFoundError } from '@trg_package/errors';

export class ActionService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof ActionSchema
> {
  private RoleService: RoleService;
  private PermissionService: PermissionService;
  private PermissionActionService: PermissionActionService;
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, ActionSchema, db.query.ActionSchema);
    this.RoleService = new RoleService(db);
    this.PermissionService = new PermissionService(db);
    this.PermissionActionService = new PermissionActionService(db);
  }

  public async createOne(data: ActionInsert): Promise<ActionSelect> {
    const action = await super.createOne(data);

    await this.extendSuperuserActions(action.id);

    return action;
  }

  private async extendSuperuserActions(action_id: string) {
    let name = 'SUPERUSER';

    try {
      const { id: role_id } = await this.RoleService.findOne({
        name
      });
      const permissions = await this.PermissionService.findMany({ role_id });

      let promises = permissions.map(
        async ({ id: permission_id }) =>
          await this.PermissionActionService.createOne({
            permission_id,
            action_id
          })
      );
      await Promise.all(promises);
    } catch (error) {
      if (error instanceof NotFoundError) {
        console.log('Superuser Role not found');
      } else {
        throw error;
      }
    }
  }
}