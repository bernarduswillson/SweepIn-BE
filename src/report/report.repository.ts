import { Status } from ".prisma/client"
import { db } from "../utils/db"

// Find report by userId, status, startDate, endDate, page, and perPage then sort by date
const findAllReports = async (
  userId: number | undefined,
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
    include: {
      images: {
        select: {
          id: true
        }
      }
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: {
      date: "desc"
    }
  })
  const imagesCount = await db.reportImage.groupBy({
    by: ["reportId"],
    _count: {
      id: true
    }
  })
  return ret.map((report) => {
    const images = imagesCount.find((image) => image.reportId === report.id)
    return {
      ...report,
      images: images?._count?.id
    }
  })
}

// Find one unique report by id
const findOneReport = async (reportId: number) => {
  const ret = await db.report.findUnique({
    where: {
      id: reportId
    },
    select: {
      id: true,
      date: true,
      status: true,
      description: true,
      user: {
        select: {
          id: true,
          name: true
        }
      },
      images: {
        select: {
          url: true
        }
      }
    }
  })
  return ret
}

// Create new report
const createReport = async (
  userId: number,
  description: string | undefined
) => {
  const ret = await db.report.create({
    data: {
      userId,
      description
    }
  })
  return ret
}

const createReportImage = async (reportId: number, url: string) => {
  const ret = await db.reportImage.create({
    data: {
      reportId,
      url
    }
  })
  return ret
}

export { findAllReports, findOneReport, createReport, createReportImage }
