import { Status } from ".prisma/client"

import {
  findAllReports,
  createReport,
  createReportImage,
  findOneReport
} from "./report.repository"
import { NotFoundError } from "../class/Error"
import { getUserById } from "../auth/auth.repository"

/**
 * Filter reports
 *
 * @description Filter attendances by userId, status, startDate, endDate then slice it into pages
 * @returns Report[]
 */
const filterReports = async (
  userId: string,
  startDate: string | undefined,
  endDate: string | undefined,
  status: Status | undefined,
  page: string,
  perPage: string
) => {
  const reports = await findAllReports(
    parseInt(userId),
    startDate,
    endDate,
    status,
    parseInt(page),
    parseInt(perPage)
  )

  if (!reports || reports.length === 0) {
    throw new NotFoundError("Reports not found")
  }

  return reports
}

const getReportDetails = async (reportId: string) => {
  const report = await findOneReport(parseInt(reportId))
  if (!report) {
    throw new NotFoundError("Report not found")
  }
  return report
}

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
  const userExists = await getUserById(parseInt(userId))

  if (!userExists) {
    throw new NotFoundError("User not found")
  }

  const reportId = await createReport(parseInt(userId), description)

  if (!reportId) {
    throw new Error("Failed to create report")
  }

  for (const image of images) {
    await createReportImage(reportId.id, image.path)
  }

  return reportId.id
}

export { filterReports, getReportDetails, submitReport }
