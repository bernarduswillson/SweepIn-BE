import { db } from "../utils/db.server"
import { History } from "@prisma/client"

export const getHistory = async (
  startdate: string | undefined,
  enddate: string | undefined,
  userId: string | undefined
): Promise<History[]> => {
  return await db.history.findMany({
    where: {
      date: {
        gte: startdate ? new Date(startdate).toISOString() : undefined,
        lte: enddate ? new Date(enddate).toISOString() : undefined
      },
      userId
    }
  })
}

export const getHistoryById = async (id: string): Promise<History | null> => {
  return await db.history.findFirst({
    where: {
      id
    }
  })
}

export const postHistory = async (
  userId: string,
  description: string,
  documentation: string[]
): Promise<History> => {
  return await db.history.create({
    data: {
      description,
      documentation,
      userId
    }
  })
}
