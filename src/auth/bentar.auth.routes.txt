import express from "express"
import type { Request, Response } from "express"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

import { getUser, createUser } from "./auth.service"

dotenv.config()

export const authRoutes = express.Router()

// Register
authRoutes.post("/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const result = createUser(email, name, hashedPassword)

  return res.json({
    status: "success",
    data: result
  })
})

// Login
authRoutes.post("/login", async (req: Request, res: Response) => {
  const { email } = req.body
  const user = await getUser(email)

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" })
  }

  return res.json({
    status: "success",
    data: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  })
})
