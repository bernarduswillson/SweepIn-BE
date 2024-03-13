import express from "express"
import type { Request, Response } from "express"
import { InvalidAttributeError, responseError } from "../class/Error"

import { verifyUserByEmail, createUser } from "./auth.service"

const route = express.Router()

/**
 * @method POST /login
 * @param {string} email - user's gmail
 * @returns user's credentials
 *
 * @example http://{{base_url}}/login
 * */
route.post("/login", async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    const credentials = await verifyUserByEmail(email)

    return res.status(200).json({
      message: "Login successful",
      data: credentials
    })
  } catch (error) {
    responseError(error, res)
  }
})

/**
 * @method POST /register
 * @param {string} email - user's gmail
 * @param {string} name - user's name
 * @param {string} role - user's role
 * @param {string} location - user's location
 *
 * @returns user's data
 *
 * @example http://{{base_url}}/register
 */
route.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, name, role, location } = req.body

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

    const user = await createUser(email, name, role, location)

    return res.status(201).json({
      message: "User created",
      data: user
    })
  } catch (error: any) {
    responseError(error, res)
  }
})

export default route
