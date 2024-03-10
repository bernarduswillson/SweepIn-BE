import { db } from "../utils/db.server"

export const getUser = async (email: string) => {
  return await db.user.findUnique({
    where: {
      email
    }
  })
}