import { generateAttendance } from "../attendance/attendance.service"
import { createLog, createLogImage } from "./log.repository"
import { findOneAttendance } from "../attendance/attendance.repository"

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
  longitude: string
) => {
  return attendanceId
    ? await submitEndLog(attendanceId, date, image, latitude, longitude)
    : await submitStartLog(userId, date, image, latitude, longitude)
}

const submitStartLog = async (
  userId: string,
  date: string,
  images: Express.Multer.File[],
  latitude: string,
  longitude: string
) => {
  const attendanceId = await generateAttendance(parseInt(userId))

  const { id } = await createLog(
    date,
    parseFloat(latitude),
    parseFloat(longitude),
    attendanceId,
    undefined
  )

  for (const image of images) {
    await createLogImage(id, image.path)
  }

  return { attendanceId, id }
}

const submitEndLog = async (
  attendanceId: string,
  date: string,
  images: Express.Multer.File[],
  latitude: string,
  longitude: string
) => {
  const attendanceExists = await findOneAttendance(parseInt(attendanceId))

  if (!attendanceExists) {
    throw new Error("Attendance does not exist")
  }

  if (attendanceExists.endLog.length > 0) {
    throw new Error("Attendance already ended")
  }

  const { id } = await createLog(
    date,
    parseFloat(latitude),
    parseFloat(longitude),
    undefined,
    parseInt(attendanceId)
  )

  for (const image of images) {
    await createLogImage(id, image.path)
  }

  return { attendanceId: parseInt(attendanceId), id }
}

export { submitLog }
