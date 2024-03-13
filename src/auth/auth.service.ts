import { UnauthorizedError } from "../class/Error"

import { Role, Location } from "@prisma/client"
import { getUserByEmail, generateUser } from "./auth.repository"

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
    throw new UnauthorizedError("Email is not registered")
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
  role: Role,
  location: Location
) => {
  const user = await generateUser(email, name, role, location)

  if (!user) {
    throw new Error("Error creating user")
  }

  return user
}

export { verifyUserByEmail, createUser }
