import { db } from '../utils/db'
import { Role, Location, UserStatus } from '@prisma/client'

const getUsers = async (
  name: string | undefined,
  role: string | undefined,
  location: string | undefined,
  status: string | undefined,
  page: number,
  perPage: number
) => {
  return await db.user.findMany({
    where: {
      name: {
        contains: name
      },
      role: role as Role,
      location: location as Location,
      status: status as UserStatus
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

const getUserById = async (id: number) => {
  return await db.user.findFirst({
    where: {
      id
    }
  })
}

const getUserByName = async (name: string) => {
  return await db.user.findFirst({
    where: {
      name
    }
  })
}

const countFilteredUsers = async (
  name: string | undefined,
  role: string | undefined,
  location: string | undefined,
  status: string | undefined
) => {
  return await db.user.count({
    where: {
      name: {
        contains: name
      },
      role: role as Role,
      location: location as Location,
      status: status as UserStatus
    }
  })
}

const updateUserById = async (
  userId: number,
  email: string,
  name: string,
  role: Role,
  location: Location,
  status: UserStatus
) => {
  return await db.user.update({
    where: {
      id: userId
    },
    data: {
      email,
      name,
      role,
      location,
      status
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

const deleteUserById = async (userId: number) => {
  return await db.user.delete({
    where: {
      id: userId
    }
  })
}

export {
  getUsers,
  getUserByEmail,
  getUserById,
  getUserByName,
  countFilteredUsers,
  updateUserById,
  generateUser,
  deleteUserById
}
