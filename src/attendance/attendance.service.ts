import { findAllAttendance, findOneAttendance } from "./attendance.repository";

/**
 * Filter attendances
 * 
 * @description Filter attendances by userId, startDate, endDate then slice it into pages
 * @returns Attendances
 */
const filterAttendances = async (
  userId: string | undefined, 
  startDate: string | undefined,
  endDate: string | undefined,
  page: string, 
  perPage: string) => {
  const attendance = await findAllAttendance(
    userId,
    startDate,
    endDate,
    parseInt(page),
    parseInt(perPage)
  );

  return attendance;
};

const getOneAttendance = async (attendanceId: string) => {
  const attendance = await findOneAttendance(attendanceId);
  return attendance
}

export { filterAttendances, getOneAttendance };
