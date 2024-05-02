import { UnauthorizedError } from '../class/Error'

import {
  getUsers,
  getUserByEmail,
  getUserByName,
  countFilteredUsers,
  updateUserById,
  generateUser,
  deleteUserById,
  getUserById
} from './auth.repository'
import { InvalidAttributeError } from '../class/Error'
import { Role, Location, UserStatus } from '@prisma/client'
/**
 * Get all users
 *
 * @description Get all users from the database
 * @returns All users
 */

const findUsers = async (
  name: string | undefined,
  role: string | undefined,
  location: string | undefined,
  status: string | undefined,
  page: string,
  perPage: string
) => {
  // Verify the role and location match the enum
  if (role && !(role in Role)) {
    throw new InvalidAttributeError('Invalid role')
  }

  if (location && !(location in Location)) {
    throw new InvalidAttributeError('Invalid location')
  }

  if (status && !(status in UserStatus)) {
    throw new InvalidAttributeError('Invalid status')
  }

  const users = await getUsers(
    name,
    role,
    location,
    status,
    parseInt(page),
    parseInt(perPage)
  )

  if (!users || users.length === 0) {
    throw new Error('Users not found')
  }

  const filtered = await countFilteredUsers(name, role, location, status)

  const total = await countFilteredUsers(
    undefined,
    undefined,
    undefined,
    undefined
  )

  return { users, filtered, total }
}

const findOneUser = async (userId: number) => {
  const user = await getUserById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

const updateUser = async (
  userId: number,
  email: string,
  name: string,
  role: string,
  location: string,
  status: string
) => {
  // Verify the role, location, and status match the enum
  if (!(role in Role)) {
    throw new InvalidAttributeError('Invalid role')
  }

  if (!(location in Location)) {
    throw new InvalidAttributeError('Invalid location')
  }

  if (!(status in UserStatus)) {
    throw new InvalidAttributeError('Invalid status')
  }

  const userExists = await getUserById(userId)

  if (!userExists) {
    throw new Error('User not found')
  }

  const emailExists = await getUserByEmail(email)

  if (emailExists && emailExists.id !== userId) {
    throw new Error('Email already exists')
  }

  const nameExists = await getUserByName(name)

  if (nameExists && nameExists.id !== userId) {
    throw new Error('Name already exists')
  }

  const updatedUser = await updateUserById(
    userId,
    email,
    name,
    role as Role,
    location as Location,
    status as UserStatus
  )

  return updatedUser
}

/**
 * Verify user by email
 *
 * @description Verify if user has access to the app
 * @returns User's credentials
 */
const verifyUserByEmail = async (email: string) => {
  const user = await getUserByEmail(email)

  // Check if email is registered
  if (!user) {
    throw new UnauthorizedError('Email is not registered')
  }

  return user
}

/**
 * Create user
 *
 * @description create a new user using email, name, role, and location
 * @returns User's data
 */
const createUser = async (
  email: string,
  name: string,
  role: string,
  location: string
) => {
  // Verify the role and location match the enum
  if (!(role in Role)) {
    throw new InvalidAttributeError('Invalid role')
  }

  if (!(location in Location)) {
    throw new InvalidAttributeError('Invalid location')
  }

  const userExists = await getUserByEmail(email)

  if (userExists) {
    throw new Error('User already exists')
  }

  const user = await generateUser(
    email,
    name,
    role as Role,
    location as Location
  )

  if (!user) {
    throw new Error('Error creating user')
  }

  return user
}

/**
 * Delete user
 *
 * @description delete a user by id
 * @returns User's data
 */
const removeUser = async (userId: number) => {
  const userExists = await getUserById(userId)

  if (!userExists) {
    throw new Error('User not found')
  }

  return await deleteUserById(userId)
}

export {
  findUsers,
  findOneUser,
  updateUser,
  verifyUserByEmail,
  createUser,
  removeUser
}
