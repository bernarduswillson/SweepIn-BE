import { db } from "../utils/db.server"
import { History } from "@prisma/client"

export const getHistory = async (
  date: string,
  userId: string
): Promise<History[]> => {
  return await db.history.findMany({
    where: {
      userId,
      date
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
