import { findFilteredAttendance, findOneAttendance } from "./attendance.repository";

// Get attendance by userId, startDate, endDate, page, and perPage
const getFilteredAttendance = async (
  userId: string | undefined, 
  startDate: string | undefined,
  endDate: string | undefined,
  page: string, 
  perPage: string) => {
  const attendance = await findFilteredAttendance(
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

export { getFilteredAttendance, getOneAttendance };
