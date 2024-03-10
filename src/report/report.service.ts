import { Status } from '.prisma/client';
import { findAllReports } from './report.repository';

const filterReports = async (
  userId: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  status: Status | undefined,
  page: string,
  perPage: string
) => {
  const reports = await findAllReports(
    userId,
    startDate,
    endDate,
    status,
    parseInt(page),
    parseInt(perPage),
  )

  return reports;
};

export { filterReports };