import { UnauthorizedError } from "../class/Error";

import { getUserByEmail } from "./auth.repository";

/**
 * Verify user by email
 * 
 * @description Verify if user has access to the app 
 * @param {string} email - user's gmail
 * @returns User's credentials
 */
const verifyUserByEmail = async (email: string) => {
  const user = await getUserByEmail(email);
  
  // Check if email is registered
  if (!user) {
    throw new UnauthorizedError("Email is not registered");
  }

  return user;
}

export { verifyUserByEmail };