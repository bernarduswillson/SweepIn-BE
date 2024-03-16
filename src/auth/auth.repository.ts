import { db } from "../utils/db.server"
import { Role, Location } from "@prisma/client"

const getAllUsers = async () => {
  return await db.user.findMany()
}

const getUserByEmail = async (email: string) => {
  return await db.user.findFirst({
    where: {
      email
    }
  })
}

const generateUser = async (
  email: string,
  name: string,
  role: Role,
  location: Location
) => {
  return await db.user.create({
    data: {
      email,
      name,
      role,
      location
    }
  })
}

export { getAllUsers, getUserByEmail, generateUser }
