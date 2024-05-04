import fs from 'fs'
import { InvalidAttributeError, NotFoundError } from '../class/Error'
import {
  createAttendance,
  findAllAttendance,
  findOneAttendance,
  countAttendance,
  countAttendanceEachDate
} from './attendance.repository'

/**
 * Filter attendances
 *
 * @description Filter attendances by userId, startDate, endDate then slice it into pages
 * @returns Attendance[]
 */
const filterAttendances = async (
  userId: string | undefined,
  user: string | undefined,
  role: string | undefined,
  location: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  page: string,
  perPage: string
) => {
  if (
    role !== 'ADMIN' &&
    role !== 'CLEANER' &&
    role !== 'SECURITY' &&
    role !== undefined
  ) {
    throw new InvalidAttributeError('Invalid role')
  }
  if (
    location !== 'GANESHA' &&
    location !== 'JATINANGOR' &&
    location !== 'CIREBON' &&
    location !== 'JAKARTA' &&
    location !== undefined
  ) {
    throw new InvalidAttributeError('Invalid location')
  }

  const attendance = await findAllAttendance(
    userId ? parseInt(userId) : undefined,
    user,
    role,
    location,
    startDate,
    endDate,
    parseInt(page),
    parseInt(perPage)
  )

  if (!attendance || attendance.length === 0) {
    throw new NotFoundError('Attendance not found')
  }

  const filtered = await countAttendance(
    userId ? parseInt(userId) : undefined,
    user,
    role,
    location,
    startDate,
    endDate
  )

  const total = await countAttendance(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  )

  return { attendance, filtered, total }
}

/**
 * Get attendance details
 *
 * @description Find attendance details by id
 * @returns Attendance
 */
const getAttendanceDetails = async (attendanceId: number) => {
  const attendance = await findOneAttendance(attendanceId)
  if (!attendance) {
    throw new NotFoundError('Attendance not found')
  }

  const startLogImagePaths = attendance.startLog[0].images.map(
    (image) => image.url
  )

  const startLogImages = startLogImagePaths.map((path) => fs.readFileSync(path))

  if (attendance.endLog.length === 0) {
    return {
      id: attendance.id,
      date: attendance.date,
      user: attendance.user,
      startLog: {
        id: attendance.startLog[0].id,
        date: attendance.startLog[0].date,
        latitude: attendance.startLog[0].latitude,
        longitude: attendance.startLog[0].longitude,
        images: startLogImages
      },
      endLog: null
    }
  }

  const endLogImagePaths = attendance.endLog[0].images.map((image) => image.url)

  const endLogImages = endLogImagePaths.map((path) => fs.readFileSync(path))

  return {
    id: attendance.id,
    date: attendance.date,
    user: attendance.user,
    startLog: {
      id: attendance.startLog[0].id,
      date: attendance.startLog[0].date,
      latitude: attendance.startLog[0].latitude,
      longitude: attendance.startLog[0].longitude,
      images: startLogImages
    },
    endLog: {
      id: attendance.endLog[0].id,
      date: attendance.endLog[0].date,
      latitude: attendance.endLog[0].latitude,
      longitude: attendance.endLog[0].longitude,
      images: endLogImages
    }
  }
}

/**
 * Generate attendance
 *
 * @description Create new attendance
 * @returns AttendanceId
 */
const generateAttendance = async (userId: number) => {
  const attendance = await createAttendance(userId)
  if (!attendance) {
    throw new Error('Failed to create attendance')
  }
  return attendance.id
}

/**
 * Count start and end log attendance
 *
 * @description Count all attendance by role and location for the last 7 days from today
 * @returns CountStartLog, CountEndLog
 */
const countAllAttendance = async (
  role: string | undefined,
  location: string | undefined,
) => {
  if (
    role !== 'ADMIN' &&
    role !== 'CLEANER' &&
    role !== 'SECURITY' &&
    role !== undefined
  ) {
    throw new InvalidAttributeError('Invalid role')
  }
  if (
    location !== 'GANESHA' &&
    location !== 'JATINANGOR' &&
    location !== 'CIREBON' &&
    location !== 'JAKARTA' &&
    location !== undefined
  ) {
    throw new InvalidAttributeError('Invalid location')
  }

  const startDate = new Date()
  startDate.setHours(0, 0, 0)
  const endDate = new Date(startDate)
  endDate.setHours(23, 59, 59)

  const countStartLog: { [key: string]: number } = {}
  const countEndLog: { [key: string]: number } = {}

  for (let i = 0; i < 7; i++) {
    countStartLog[startDate.toDateString()] = await countAttendanceEachDate(
      startDate.toISOString(),
      endDate.toISOString(),
      role,
      location,
      'start'
    )

    countEndLog[startDate.toDateString()] = await countAttendanceEachDate(
      startDate.toISOString(),
      endDate.toISOString(),
      role,
      location,
      'end'
    )

    startDate.setDate(startDate.getDate() - 1)
    endDate.setDate(endDate.getDate() - 1)
  }

  return { countStartLog, countEndLog }
}


export { filterAttendances, getAttendanceDetails, generateAttendance, countAllAttendance }
