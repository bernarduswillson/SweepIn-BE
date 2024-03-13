import { UnauthorizedError } from "../class/Error"

import { getUserByEmail, generateUser } from "./auth.repository"
import { InvalidAttributeError } from "../class/Error"

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
  role: string,
  location: string
) => {
  // Verify the role and location match the enum
  if (role !== "ADMIN" && role !== "CLEANER" && role !== "SECURITY") {
    throw new InvalidAttributeError("Invalid role")
  }

  if (
    location !== "GANESHA" &&
    location !== "JATINANGOR" &&
    location !== "CIREBON" &&
    location !== "JAKARTA"
  ) {
    throw new InvalidAttributeError("Invalid location")
  }

  const user = await generateUser(email, name, role, location)

  if (!user) {
    throw new Error("Error creating user")
  }

  return user
}

export { verifyUserByEmail, createUser }
