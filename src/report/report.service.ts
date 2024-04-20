import { Status } from ".prisma/client"
import fs from "fs"

import {
  findAllReports,
  createReport,
  createReportImage,
  findOneReport,
  updateStatus
} from "./report.repository"
import { InvalidAttributeError,NotFoundError } from "../class/Error"
import { getUserById } from "../auth/auth.repository"


/**
 * Filter reports
 *
 * @description Filter attendances by userId, status, startDate, endDate then slice it into pages
 * @returns Report[]
 */
const filterReports = async (
  userId: string | undefined,
  user: string | undefined,
  role: string | undefined,
  location: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  status: Status | undefined,
  page: string,
  perPage: string
) => {
  const reports = await findAllReports(
    userId ? parseInt(userId) : undefined,
    user,
    role,
    location,
    startDate,
    endDate,
    status,
    parseInt(page),
    parseInt(perPage)
  )

  if (!reports || reports.length === 0) {
    throw new NotFoundError("Reports not found")
  }
  if (role !== "ADMIN" && role !== "CLEANER" && role !== "SECURITY" && role !== undefined) {
    throw new InvalidAttributeError("Invalid role")
  }
  if (
    location !== "GANESHA" &&
    location !== "JATINANGOR" &&
    location !== "CIREBON" &&
    location !== "JAKARTA" &&
    location !== undefined
  ) {
    throw new InvalidAttributeError("Invalid location")
  }

  return reports
}

const getReportDetails = async (reportId: string) => {
  const report = await findOneReport(parseInt(reportId))
  if (!report) {
    throw new NotFoundError("Report not found")
  }
  const imagePaths = report.images.map((image) => image.url)
  const images = imagePaths.map((path) => fs.readFileSync(path))

  return {
    ...report,
    images
  }
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

  const report = await createReport(parseInt(userId), description)

  if (!report) {
    throw new Error("Failed to create report")
  }
    
    for (const image of images) {
      await createReportImage(report.id, image.path)
        return report;
    }
}

/**
 * Update report status
 *
 * @description Update report status by id
 * @returns Report
 */
const updateReportStatus = async (reportId: string, status: Status) => {
  const report = await findOneReport(parseInt(reportId))

  if (!report) {
    throw new NotFoundError("Report not found")
  }

  return await updateStatus(parseInt(reportId), status)
}

export { filterReports, getReportDetails, submitReport, updateReportStatus }
