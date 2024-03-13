import express from "express"
import type { Request, Response } from "express"
import { responseError } from "../class/Error"

import { verifyUserByEmail } from "./auth.service"

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

export default route
