import { Status } from ".prisma/client"
import { db } from "../utils/db"
import { Role, Location } from "@prisma/client"

// Find report by userId, status, startDate, endDate, page, and perPage then sort by date
const findAllReports = async (
  userId: number | undefined,
  user: string | undefined,
  role: string | undefined,
  location: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  status: Status | undefined,
  page: number,
  perPage: number
) => {
  const ret = await db.report.findMany({
    where: {
      user: {
        id: userId,
        name: user,
        role: role as Role,
        location: location as Location
      },
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

const updateStatus = async (reportId: number, status: Status) => {
  const ret = await db.report.update({
    where: {
      id: reportId
    },
    data: {
      status
    }
  })
  return ret
}

export { findAllReports, findOneReport, createReport, createReportImage, updateStatus }
