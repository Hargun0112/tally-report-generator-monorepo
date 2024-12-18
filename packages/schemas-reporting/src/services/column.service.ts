import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { BadRequestError, CustomError } from '@trg_package/errors';
import { sql } from 'drizzle-orm';
import * as reportingSchemas from '../schemas';
import { ColumnSchema } from '../schemas';
import { DetailedColumnSelect, TableSelect } from '../types';

export class ColumnService extends BaseServiceNew
  <
    typeof reportingSchemas,
    typeof ColumnSchema
  > {
  constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
    super(db, ColumnSchema,db.query.ColumnSchema);
  }

  public async getAllColumns(tableId : TableSelect['id']) : Promise<DetailedColumnSelect[]> {
    try {
      const columns : DetailedColumnSelect[] = await this.dbClient.execute(sql`
       WITH RECURSIVE cte(column_id,name, referenceTable, tableId, tablealias, prefix, tablename, type,tabledisplayname) AS (
          SELECT
          c.id as column_id,
          c.name,
          c."referenceTable",
          c."tableId",
          tb.name::TEXT as tablealias,
          ''::TEXT as prefix,
          tb.name as tablename,
          c.type as type,
          ''::text as tabledisplayname
          FROM  public."columns" c
          INNER JOIN  public."tables" tb on c."tableId" = tb."id" 
          WHERE c."tableId" = ${tableId}
          AND c.type NOT IN ('id')  

          UNION ALL
                    
          SELECT 
          pc.id as column_id,
          pc.name, 
          pc."referenceTable",
          pc."tableId",
          concat(cte.prefix,cte.name) as tablealias,
          concat(cte.name,'_') as prefix,
          tb.name as tablename,
          pc.type as type,
          tb."displayName"::text as tabledisplayname
          FROM public."columns" pc 
          INNER JOIN cte ON pc."tableId"::TEXT = cte.referencetable
          INNER JOIN  public."tables" tb on pc."tableId" = tb."id"
          WHERE cte.tableid != pc."tableId" 
          AND pc.type != 'id'
        )
        SELECT cte."column_id" as id,cte."name",cte."type",cte."tablename" as table,
        lower(cte."tablealias") as tablealias,
        CONCAT(LOWER(cte."tablealias"),'_',LOWER(cte."name")) as alias,
        CASE
          WHEN cte.tabledisplayname = '' 
          THEN upper(left(cte.name, 1)) || right(cte.name, -1)
          ELSE CONCAT(cte."tabledisplayname",' . ',upper(left(cte.name, 1)) || right(cte.name, -1))
        END as "displayName",
        CASE
          WHEN cte.tabledisplayname = '' 
          THEN upper(left(cte.name, 1)) || right(cte.name, -1)
          ELSE CONCAT(cte."tabledisplayname",' . ',upper(left(cte.name, 1)) || right(cte.name, -1))
        END as "heading"
        FROM cte WHERE type not in ('foreignKey');
      `);
      return columns;
    } catch (error) {
      console.log(error);
      throw new CustomError('Error while fetching all columns',400);
    }
  }

  public async updateForeignKeys() {
    try {
      await this.dbClient.execute(sql`
                UPDATE public."columns" AS c1
                SET 
                "referenceTable" = t2."id",
                "referenceColumn" = c2."id"
                FROM 
                public."columns" AS c2  
                INNER JOIN public."tables" as t2
                on c2."tableId" = t2.id
                WHERE c2.name = c1."referenceColumn"
                and t2.name = c1."referenceTable"
            `);
    } catch (error) {
      console.error(error);
      throw new BadRequestError('There was an error while updating seeded column table');
    }
  }
}
