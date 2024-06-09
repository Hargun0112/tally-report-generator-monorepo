import { eq, ne } from 'drizzle-orm';
import { db } from '../models';
import {
  RoleSchema,
  UserInsert,
  UserRoleSchema,
  UserRoleSelect,
  UserSchema,
  UserSelect
} from '../models/schema';
import { CustomError } from '../errors';

class UserService {
  public static async createOne(data: UserInsert): Promise<UserSelect> {
    try {
      const [user] = await db.insert(UserSchema).values(data).returning();
      console.log({ user });
      if (!user) {
        throw new CustomError(
          'Database error: User returned as undefined',
          500
        );
      }
      return user;
    } catch (err) {
      console.error('Could not create a new User!');
      throw err;
    }
  }

  public static async findOne(
    data: Record<'email', string>
  ): Promise<UserSelect | undefined> {
    const user = await db.query.UserSchema.findFirst({
      where: eq(UserSchema.email, data.email)
    });

    return user;
  }

  public static async getAll(reqUserId: string): Promise<UserSelect[]> {
    return db.query.UserSchema.findMany({
      where: ne(UserSchema.id, reqUserId),
      with: {
        userToRole: {
          columns: {
            role_id: false,
            user_id: false,
            assignedAt: false
          },
          with: {
            role: {
              columns: {
                name: true,
                id: true
              }
            }
          }
        }
      }
    });
  }

  public static extractUserRoles = async (userId: string) => {
    return db.query.UserSchema.findFirst({
      where: eq(UserSchema.id, userId),
      with: {
        userToRole: {
          columns: {
            role_id: false,
            user_id: false,
            assignedAt: false
          },
          with: {
            role: {
              columns: {
                name: true,
                id: true
              }
            }
          }
        }
      }
    });
  };

  public static async assignRole(
    users: string[],
    roleId: string
  ): Promise<UserRoleSelect['user_id'][]> {
    const userIds = users.map(async (userId) => {
      const [userRoleRelation] = await db
        .insert(UserRoleSchema)
        .values({ user_id: userId, role_id: roleId })
        .returning();

      if (!userRoleRelation) {
        throw new CustomError(
          'Database error: UserRoleRelation returned as undefined',
          500
        );
      }

      return userRoleRelation.user_id;
    });

    return Promise.all(userIds).then((res) => res);
  }
}

export default UserService;
