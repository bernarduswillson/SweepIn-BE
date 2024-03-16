import { db } from "../utils/db.server"
import { Role, Location } from "@prisma/client"

const getUsers = async (
  name: string | undefined,
  role: string | undefined,
  location: string | undefined,
  page: number,
  perPage: number
) => {
  return await db.user.findMany({
    where: {
      name: {
        contains: name
      },
      role: role as Role,
      location: location as Location
    },
    skip: (page - 1) * perPage,
    take: perPage
  })
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

export { getUsers, getUserByEmail, generateUser }
