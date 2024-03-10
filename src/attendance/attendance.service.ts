import { findFilteredAttendance } from "./attendance.repository";

const getFilteredAttendance = async (
  userId: string | undefined, 
  startDate: string | undefined,
  endDate: string | undefined,
  page: string, 
  perPage: string) => {
  const about = await findFilteredAttendance(
    userId,
    startDate,
    endDate,
    parseInt(page),
    parseInt(perPage)
  );

  return about;
};

export { getFilteredAttendance };
