import { uploadFile } from "../utils/firestore";
import { generateAttendance } from "../attendance/attendance.service";
import { createLog } from "./log.repository";

/**
 * Submit log
 * 
 * @description Create log, if corresponding attendance does not exist, then create new attendance. else, bind attendanceId to the created log
 * @returns attendanceId, logId 
 */
const submitLog = async (
  attendanceId: string,
  userId: string,
  date: string,
  image: Express.Multer.File[],
  latitude: string,
  longitude: string,
) => {
  const imageUrl = await uploadFile(image[0])
  return (
    attendanceId ? await submitEndLog(attendanceId, date, imageUrl, latitude, longitude) : await submitStartLog(userId, date, imageUrl, latitude, longitude)
  )
};

const submitStartLog = async (
  userId: string, 
  date: string, 
  image: string,
  latitude: string,
  longitude: string) => {
    const attendanceId = await generateAttendance(userId, date);
    const { id } = await createLog(date, image, parseFloat(latitude), parseFloat(longitude), attendanceId, undefined);
    return { attendanceId, id };
  }

const submitEndLog = async (
  attendanceId: string, 
  date: string, 
  image: string,
  latitude: string,
  longitude: string) => {
    // TODO: Check if attendance exists
    const { id } = await createLog(date, image, parseFloat(latitude), parseFloat(longitude), undefined, attendanceId);
    return { attendanceId, id }
  }

export { submitLog };