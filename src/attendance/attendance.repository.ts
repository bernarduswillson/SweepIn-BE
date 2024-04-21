import { UnauthorizedError } from '../class/Error'
import { db } from '../utils/db'
import { Role, Location } from '@prisma/client'

// Find attendance by userId, startDate, endDate, page, and perPage then sort by date
const findAllAttendance = async (
  userId: number | undefined,
  user: string | undefined,
  role: string | undefined,
  location: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  page: number,
  perPage: number
) => {
  const ret = await db.attendance.findMany({
    select: {
      id: true,
      user: {
        select: {
          id: true,
          name: true
        }
      },
      date: true,
      startLog: {
        select: {
          id: true
        }
      },
      endLog: {
        select: {
          id: true
        }
      }
    },
    where: {
      user: {
        id: userId,
        name: user ? user.toLowerCase() : undefined,
        role: role as Role,
        location: location as Location
      },

      date: {
        gte: startDate ? new Date(startDate).toISOString() : undefined,
        lte: endDate ? new Date(endDate).toISOString() : undefined
      }
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: {
      date: 'desc'
    }
  })

  return ret
}

// Find unique attendance by id
const findOneAttendance = async (attendanceId: number) => {
  const ret = await db.attendance.findUnique({
    where: {
      id: attendanceId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      },
      startLog: {
        select: {
          id: true,
          date: true,
          latitude: true,
          longitude: true,
          images: {
            select: {
              url: true
            }
          }
        }
      },
      endLog: {
        select: {
          id: true,
          date: true,
          latitude: true,
          longitude: true,
          images: {
            select: {
              url: true
            }
          }
        }
      }
    }
  })
  return ret
}

// Create attendance
const createAttendance = async (userId: number) => {
  const ret = await db.attendance.create({
    data: {
      userId
    }
  })
  return ret
}

export { findAllAttendance, findOneAttendance, createAttendance }
