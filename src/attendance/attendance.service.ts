import { db } from "../utils/db.server"
import { Log, Activity } from "@prisma/client"

export const getActivity = async (
  startDate: string | undefined,
  endDate: string | undefined,
  userId: string | undefined
): Promise<Activity[]> => {
  return await db.activity.findMany({
    where: {
      startLog: {
        date: {
          gte: startDate ? new Date(startDate).toISOString() : undefined,
          lte: endDate ? new Date(endDate).toISOString() : undefined
        }
      },
      userId
    }
  })
}

export const createActivity = async (userId: string): Promise<Activity> => {
  return await db.activity.create({
    data: {
      userId
    }
  })
}

export const getLog = async (id: string): Promise<Log | null> => {
  return await db.log.findFirst({
    where: {
      id
    }
  })
}

export const createStartLog = async (
  activityId: string,
  latitude: number,
  longitude: number,
  documentation: string
): Promise<Activity> => {
  const transaction = await db.$transaction(async (prisma) => {
    const startLog = await prisma.log.create({
      data: {
        latitude,
        longitude,
        documentation
      }
    })

    const activity = await prisma.activity.update({
      where: {
        id: activityId
      },
      data: {
        startLogId: startLog.id
      }
    })

    return activity
  })
  return transaction
}

export const createEndLog = async (
  activityId: string,
  latitude: number,
  longitude: number,
  documentation: string
): Promise<Activity> => {
  const transaction = await db.$transaction(async (prisma) => {
    const endLog = await prisma.log.create({
      data: {
        latitude,
        longitude,
        documentation
      }
    })

    const activity = await prisma.activity.update({
      where: {
        id: activityId
      },
      data: {
        endLogId: endLog.id
      }
    })

    return activity
  })
  return transaction
}
