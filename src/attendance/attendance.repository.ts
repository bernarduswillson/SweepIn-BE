import { db } from "../utils/db.server";

// Find attendance by userId, startDate, endDate, page, and perPage then sort by date 
const findAllAttendance = async (
  userId: string | undefined, 
  startDate: string | undefined,
  endDate: string | undefined,
  page: number, 
  perPage: number) => {
  const ret = await db.attendance.findMany({
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

const findOneAttendance = async (attendanceId: string) => {
  const ret = await db.attendance.findUnique({
    where: {
      id: attendanceId
    }
  })

  return ret;
}

export { findAllAttendance, findOneAttendance };
