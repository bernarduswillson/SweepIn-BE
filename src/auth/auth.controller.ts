import express from "express"
import type { Request, Response } from "express"
import { responseError } from "../class/Error"

import {
  findAllUsers,
  verifyUserByEmail,
  createUser,
  removeUser
} from "./auth.service"

const route = express.Router()

/**
 * @method GET /user
 * @returns all users
 */
route.get("/user", async (req: Request, res: Response) => {
  try {
    const users = await findAllUsers()

    return res.status(200).json({
      message: "Users fetched",
      data: users
    })
  } catch (error) {
    responseError(error, res)
  }
})

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

    const user = await createUser(email, name, role, location)

    return res.status(201).json({
      message: "User created",
      data: user
    })
  } catch (error: any) {
    responseError(error, res)
  }
})

/**
 * @method DELETE /user/:userId
 * @param {string} userId - user's id
 *
 * @returns user's data
 *
 * @example http://{{base_url}}/user/:userId
 */
route.delete("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId

    const user = await removeUser(userId)

    return res.status(200).json({
      message: "User deleted",
      data: user
    })
  } catch (error: any) {
    responseError(error, res)
  }
})

export default route
