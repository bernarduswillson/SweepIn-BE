import { db } from '../utils/db'

const createLog = async (
  date: string,
  latitude: number,
  longitude: number,
  attendanceStartId: number | undefined,
  attendanceEndId: number | undefined
) => {
  const ret = await db.log.create({
    data: {
      date,
      latitude,
      longitude,
      attendanceStartId,
      attendanceEndId
    }
  })

  return ret
}

const createLogImage = async (logId: number, url: string) => {
  const ret = await db.logImage.create({
    data: {
      logId,
      url
    }
  })

  return ret
}

export { createLog, createLogImage }
