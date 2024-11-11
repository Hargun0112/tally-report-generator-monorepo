import {
  GeneratedReportColumns,
  GeneratedReportData,
  GeneratedReportFilters,
  ReportInsert,
  ReportSelect,
  RuntimeFilters
} from '@trg_package/schemas-reporting/types';
import createAxiosClient from '@trg_package/vite/client';
import { AxiosPromise } from 'axios';
import { CrudServices } from '.';

const reportsAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/reports',
    withCredentials: true
  }
);

export const services: CrudServices<
'report',
ReportSelect,
ReportInsert
> = {
  read: async (query) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return reportsAxios.get(`/read?${queryString}`);
  },
  createOne: async (data) => reportsAxios.post('/create', data),
  updateOne: async ({ id }, data) => reportsAxios.patch(`/update/${id}`, data),
  deleteOne: async ({ id }) => reportsAxios.delete(`/delete/${id}`),
};

export const getReportColumns = async (reportId: string): AxiosPromise<{
  columns: Array<GeneratedReportColumns>
}> => reportsAxios.get(`/read/reportColumns/${reportId}`);

export const getReportData = async (
  reportId: string,
  {
    pageSize,
    pageIndex,
  }:{
    pageSize: number,
    pageIndex: number,
  },
  filters?: RuntimeFilters
): AxiosPromise<{
  data: Array<GeneratedReportData>,
  totalCount: number
}> => reportsAxios.get(`/read/reportData/${reportId}?pageSize=${pageSize}&pageIndex=${pageIndex}${filters ? `&filters=${JSON.stringify(filters)}` : ''}`);

export const getReportFilters = async (reportId: string): AxiosPromise<{
  filters : Array<GeneratedReportFilters>
}> => reportsAxios.get(`/read/reportFilters/${reportId}`);
