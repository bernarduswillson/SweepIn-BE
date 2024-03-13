import { db } from "../utils/db.server"

const getUserByEmail = async (email: string) => {
  return await db.user.findFirst({
    where: {
      email
    }
  })
}

export { getUserByEmail }
