import { Status } from ".prisma/client";
import { db } from "../utils/db.server";

// Find report by userId, status, startDate, endDate, page, and perPage then sort by date 
const findAllReports = async (
  userId: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  status: Status | undefined,
  page: number,
  perPage: number
) => {
  const ret = await db.report.findMany({
    where: {
      userId,
      date: {
        gte: startDate ? new Date(startDate).toISOString() : undefined,
        lte: endDate ? new Date(endDate).toISOString() : undefined
      },
      status
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: {
      date: 'desc'
    }
  });
  return ret;
};

// Find one unique report by id
const findOneReport = async (reportId: string) => {
  const ret = await db.report.findUnique({
    where: {
      id: reportId
    }
  });
  return ret;
}

// Create new report
const createReport = async (
  userId: string,
  images: string[],
  description: string | undefined
) => {
  const ret = await db.report.create({
    data: {
      userId,
      images,
      description
    }
  })
  return ret;
};

export { findAllReports, findOneReport, createReport };