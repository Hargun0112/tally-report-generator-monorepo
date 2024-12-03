import { NextFunction, Response, Request } from 'express';
import { Redis } from 'ioredis';
import { DetailedUser as AuthDetailedUser, TenantSelect } from '@trg_package/schemas-auth/types';
import { DetailedUser as DashDetailedUser, UserSelect } from '@trg_package/schemas-dashboard/types';
import { BadRequestError, UnauthenticatedError } from '@trg_package/errors';
import {
  UserService,
  RoleService,
  ModuleService,
  ActionService,
  PermissionService,
  PermissionActionService,
  UserTallyCompanyService,
  ApiKeyService
} from '@trg_package/schemas-dashboard/services';
import {
  TableService,
  ColumnService,
  ReportService,
  ReportUserService,
  ScheduleService,
  ScheduleUserService
} from '@trg_package/schemas-reporting/services';
import { CompanyService } from '@trg_package/schemas-tally/services';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { Sql } from 'postgres';
import { createClient, createUrl } from '@/models';
import * as dashboardSchemas from '@/models/schemas';
import config from '@/config';
import { decrypt } from '@/utils/crypto';

const { REDIS_PORT, REDIS_HOST } = config;

interface CachedUser {
  user: AuthDetailedUser & DashDetailedUser;
}

export interface DashboardDatabase {
  client: PostgresJsDatabase<typeof dashboardSchemas>
  connection: Sql<{}>
}

export interface DashboardServices {
  user: UserService;
  role: RoleService;
  module: ModuleService;
  action: ActionService;
  permission: PermissionService;
  permissionAction: PermissionActionService;
  userTallyCompany: UserTallyCompanyService;
  apiKey: ApiKeyService;
  company: CompanyService;
  table: TableService;
  column: ColumnService;
  report: ReportService;
  reportUser : ReportUserService,
  schedule : ScheduleService
  scheduleUser : ScheduleUserService
}

export class Initialization {
  private static redis: Redis;

  public static initialize = () => {
    Initialization.redis = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
  };

  public static async initDatabase(req: Request, res: Response, next: NextFunction) {
    const { user } = req;
    let tenant: TenantSelect;

    if (!user) {
      const apiKey = req.headers['x-api-key'] as string;

      if (apiKey) {
        req.apiKeyUserId = undefined;
        req.apiKeyTenant = undefined;

        try {
          const { tenant: encrytedTenant, user: { id } } = decrypt<{
            user: Pick<UserSelect, 'id'>;
            tenant: typeof tenant;
          }>(apiKey);

          tenant = encrytedTenant;
          req.apiKeyUserId = id;
          req.apiKeyTenant = tenant;
        } catch (error) {
          throw new BadRequestError('Invalid API key');
        }
      } else {
        throw new UnauthenticatedError('No Cookie or API key found!');
      }
    } else {
      tenant = user.tenant;
    }

    const {
      id, db_name, db_username, db_password
    } = tenant;

    if (!id || !db_name || !db_username || !db_password) {
      throw new BadRequestError('Tenant database error, missing credentials');
    }

    const DASHBOARD_PG_URL = createUrl({
      db_username,
      db_password,
      db_name
    });

    const { client, connection } = createClient(
      `TENANT:${id}`,
      DASHBOARD_PG_URL,
      dashboardSchemas
    );

    req.database = {
      client,
      connection
    };

    return next();
  }

  public static async initServices(req: Request, res: Response, next: NextFunction) {
    const { database } = req;

    const services = {
      user: new UserService(database.client),
      company: new CompanyService(database.client as any),
      module: new ModuleService(database.client),
      action: new ActionService(database.client),
      role: new RoleService(database.client),
      permission: new PermissionService(database.client),
      permissionAction: new PermissionActionService(database.client),
      userTallyCompany: new UserTallyCompanyService(database.client),
      apiKey: new ApiKeyService(database.client),
      table: new TableService(database.client),
      column: new ColumnService(database.client),
      report: new ReportService(database.client),
      reportUser: new ReportUserService(database.client),
      schedule: new ScheduleService(database.client),
      scheduleUser: new ScheduleUserService(database.client)
    };

    req.services = services;

    return next();
  }

  public static async attachApiKeyUserId(req: Request, res: Response, next: NextFunction) {
    const { apiKeyUserId, apiKeyTenant } = req;

    if (!apiKeyUserId || !apiKeyTenant) return next();

    const user = await req.services.user.findOne({
      id: apiKeyUserId
    });

    if (user.role?.permission) {
      user.role.permission = user.role.permission.filter(({ module }) => module.name === 'COMPANIES');
    }

    req.user = {
      ...user,
      email: '',
      password: '',
      teams: [],
      tenant: apiKeyTenant
    };

    req.apiKeyTenant = undefined;
    req.apiKeyUserId = undefined;

    return next();
  }

  private static async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const cached = await Initialization.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache retrieval failed:', error);
      return null;
    }
  }

  private static async setCache<T>(
    key: string,
    data: T,
    ttl: number | undefined
  ): Promise<void> {
    try {
      await Initialization.redis.setex(
        key,
        ttl ? Math.round((ttl - Date.now()) / 1000) : 60 * 60,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Cache setting failed:', error);
    }
  }

  public static async clearCache(options: {
    cookie?: string;
    tenantId?: string;
    type?: 'user' | 'database' | 'services' | 'all'
  }): Promise<void> {
    const { cookie, tenantId, type = 'all' } = options;

    if (type === 'all') {
      if (cookie) await Initialization.redis.del(`user:${cookie}`);
      if (tenantId) {
        await Promise.all([
          Initialization.redis.del(`pgdashboard:${tenantId}`),
          Initialization.redis.del(`services:${tenantId}`)
        ]);
      }
      return;
    }

    if (type === 'user' && cookie) {
      await Initialization.redis.del(`user:${cookie}`);
    } else if (tenantId) {
      await Initialization.redis.del(`${type}:${tenantId}`);
    }
  }
}
