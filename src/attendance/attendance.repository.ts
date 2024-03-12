import { UnauthorizedError } from "../class/Error";
import { db } from "../utils/db.server";

// Find attendance by userId, startDate, endDate, page, and perPage then sort by date 
const findAllAttendance = async (
  userId: string | undefined, 
  startDate: string | undefined,
  endDate: string | undefined,
  page: number, 
  perPage: number) => {
  const ret = await db.attendance.findMany({
    select: {
      id: true,
      userId: true,
      date: true,
      startLog: true,
      endLog: true
    },
    where: {
      userId,
      date: {
        gte: startDate ? new Date(startDate).toISOString() : undefined,
        lte: endDate ? new Date(endDate).toISOString() : undefined
      },
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: {
      date: 'desc'
    }
  });

  return ret;
};

// Find unique attendance by id  
const findOneAttendance = async (attendanceId: string) => {
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
      startLog: true,
      endLog: true
    }
  });

  return ret;
}

// Create attendance
const createAttendance = async (userId: string, date: string) => {
  const ret = await db.attendance.create({
    data: {
      userId,
      date
    }
  })
  return ret;
}

export { findAllAttendance, findOneAttendance, createAttendance };
