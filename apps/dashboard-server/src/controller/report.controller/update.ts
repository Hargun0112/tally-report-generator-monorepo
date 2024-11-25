import { NextFunction, Request, Response } from 'express';
import {
  ReportSelect,
  ReportUserInsert,
  ScheduleInsert,
  ScheduleSelect,
  ReportUserSelect,
  ScheduleUserSelect,
  ScheduleUserInsert
} from '@trg_package/schemas-reporting/types';
import { getQueryConfig } from '@/utils/queryBuilder';

type ReportResponse<isArray extends boolean = false> = isArray extends true
  ? { reports: Partial<ReportSelect>[] }
  : { report: Partial<ReportSelect> };

export const updateOne = async (
  req: Request<Pick<ReportSelect, 'id'>, object, Partial<ReportSelect>>,
  res: Response<ReportResponse>,
  next: NextFunction
) => {
  try {
    let report = await req.services.report.updateOne(
      { id: req.params.id as any },
      req.body
    );

    const splitTables = req.body.tables?.flatMap((item) => item.split('_'));
    const tables = [...new Set(splitTables)];
    const tableQuery = await req.services.report.getTableQuery(report.baseEntity as any,tables);

    const reportQueryConfig = getQueryConfig(tableQuery,req.body);
    report = await req.services.report.updateOne(
      { id: req.params.id as any },
      { queryConfig: reportQueryConfig }
    );

    return res.json({ report });
  } catch (e) {
    return next(e);
  }
};

export const updateAccess = async (
  req : Request<Pick<ReportSelect,'id'>,object,{ users:Array<ReportUserInsert['userId']> }>,
  res : Response<{ reportUser : ReportUserSelect[] }>,
  next : NextFunction
) => {
  const { id: reportId } = req.params;

  const { users } = req.body;
  const data : ReportUserInsert[] = [];
  let reportUser : ReportUserSelect[] = [];

  users.forEach((element) => {
    data.push({
      reportId,
      userId: element
    });
  });
  try {
    await req.services.reportUser.deleteOne({ reportId });
  } finally {
    if (data.length > 0) reportUser = await req.services.reportUser.createMany(data);
    return res.json({ reportUser });
  }
};

export const updateSchedule = async (
  req : Request<Pick<ReportSelect,'id'>,object,{ schedule : ScheduleInsert,users : Array<ScheduleUserInsert['userId']> }>,
  res : Response<{ schedule : ScheduleSelect,users:ScheduleUserSelect[] }>,
  next : NextFunction
) => {
  const { id: reportId } = req.params;

  const { schedule,users } = req.body;

  let reportSchedule : ScheduleSelect;
  let scheduleUsers : ScheduleUserSelect[] = [];
  schedule.reportId = reportId;
  schedule.nextRun = new Date();
  try {
    await req.services.schedule.findOne({ reportId });
    reportSchedule = await req.services.schedule.updateOne({ reportId },schedule);
  } finally {
    reportSchedule = await req.services.schedule.createOne(schedule);
  }

  try {
    await req.services.scheduleUser.deleteOne({ scheduleId: reportSchedule.id });
  } finally {
    const data : ScheduleUserInsert[] = [];
    users?.forEach((element) => {
      data.push({
        userId: element,
        scheduleId: reportSchedule.id
      });
    });
    if (data.length > 0) scheduleUsers = await req.services.scheduleUser.createMany(data);
    return res.json({ schedule: reportSchedule,users: scheduleUsers });
  }
};
