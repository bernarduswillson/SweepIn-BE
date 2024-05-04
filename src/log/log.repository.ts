import { db } from '../utils/db'

const createStartLog = async (
  date: string,
  latitude: number,
  longitude: number,
  attendanceStartId: number | undefined
) => {
  const ret = await db.log.create({
    data: {
      date,
      latitude,
      longitude,
      attendanceStartId
    }
  })

  return ret
}

const createEndLog = async (
  date: string,
  latitude: number,
  longitude: number,
  attendanceEndId: number | undefined
) => {
  const ret = await db.log.create({
    data: {
      date,
      latitude,
      longitude,
      attendanceEndId
    }
  })

  return ret
}

const updateLog = async (
  logId: number,
  date: string,
  latitude: number,
  longitude: number
) => {
  const ret = await db.log.update({
    where: {
      id: logId
    },
    data: {
      date,
      latitude,
      longitude
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

const removeLogImage = async (logId: number) => {
  const ret = await db.logImage.deleteMany({
    where: {
      logId
    }
  })

  return ret
}

const getTodayStartLog = async (userId: number) => {
  const today = new Date()
  const tomorrow = new Date(today)
  today.setHours(0, 0, 0, 0)
  tomorrow.setHours(23, 59, 59, 0)

  const ret = await db.log.findFirst({
    where: {
      attendanceStart: {
        userId
      },
      date: {
        gte: today,
        lt: tomorrow
      }
    }
  })
  return ret
}

const getTodayEndLog = async (userId: number) => {
  const today = new Date()
  const tomorrow = new Date(today)
  today.setHours(0, 0, 0, 0)
  tomorrow.setHours(23, 59, 59, 0)

  const ret = await db.log.findFirst({
    where: {
      attendanceEnd: {
        userId
      },
      date: {
        gte: today,
        lt: tomorrow
      }
    }
  })
  return ret
}
export {
  createStartLog,
  createEndLog,
  createLogImage,
  getTodayStartLog,
  getTodayEndLog,
  updateLog,
  removeLogImage
}
