import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import bcrypt from 'bcrypt';
import { UserSchema } from '@/schemas';
import * as authSchemas from '@/schemas';
import {
  DetailedUser, UserInsert, UserSelect
} from '@/types';

export class UserService extends BaseServiceNew<
  typeof authSchemas,
  typeof UserSchema
> {
  constructor(db: PostgresJsDatabase<typeof authSchemas>) {
    super(db, UserSchema, db.query.UserSchema);
  }

  public async findOne(
    data: Partial<UserSelect>,
  ): Promise<DetailedUser> {
    const user = await super.findOne(data,{
      with: {
        teams: {
          with: {
            tenant: true
          }
        }
      }
    }) as Omit<DetailedUser, 'tenant'>;

    const currentTenant = user.teams[0]?.tenant;

    if (!currentTenant) throw new Error('Tenant not found!');

    return {
      ...user,
      tenant: currentTenant
    };
  }

  public async createOne(data: UserInsert): Promise<UserSelect> {
    const password = await this.hashPassword(data.password);
    const user = await super.createOne({
      ...data,
      password
    });
    return user;
  }

  public async updateOne(
    filterData: Partial<UserSelect>,
    data: Partial<UserInsert>
  ): Promise<UserSelect> {
    const update = data;
    if (data.password) {
      const password = await this.hashPassword(data.password);
      update.password = password;
    }
    const user = await super.updateOne(filterData, data);
    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  public async comparePassword(
    password: UserSelect['password'],
    hash: string
  ): Promise<boolean> {
    const doesPasswordMatch = await bcrypt.compare(password, hash);
    return doesPasswordMatch;
  }
}
