import { Status } from '.prisma/client';
import { uploadFile } from '../utils/firestore';

import { findAllReports, createReport } from './report.repository';

/**
 * Filter reports
 * 
 * @description Filter attendances by userId, status, startDate, endDate then slice it into pages
 * @returns Report[]
 */
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

/**
 * Submit report
 * 
 * @description Create new report
 * @returns ReportId
 */
const submitReport = async (
  userId: string,
  images: Express.Multer.File[],
  description: string | undefined
) => {
  // TODO: Validate userId
  
  let documentation: string[] = []

  if (Array.isArray(images)) {
    for (const image of images) {
      const url = await uploadFile(image)
      documentation.push(url)
    }
  } else {
    const url = await uploadFile(images)
    documentation.push(url)
  }

  const reportId = await createReport(
    userId,
    documentation,
    description
  );

  return reportId.id;
}

export { filterReports, submitReport };