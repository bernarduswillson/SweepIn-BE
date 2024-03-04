import express from "express"
import type { Request, Response } from "express"
import { getUserByName } from "../auth/auth.service"
import { getHistory, getHistoryById } from "./history.service"

export const historyRoutes = express.Router()

// GET: /history?date=DATE?name=NAME
historyRoutes.get("/history", async (req: Request, res: Response) => {
  try {
    const { date, name } = req.query
    const userId = await getUserByName(name as string)
    if (!userId) {
      return res.status(404).json({ message: "User not found" })
    }
    const history = await getHistory(date as string, userId.id)
    res.status(200).json({
      message: "success",
      data: history
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null
    })
  }
})

// GET: /history/:id
historyRoutes.get("/history/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const history = await getHistoryById(id)
    res.status(200).json({
      message: "success",
      data: history
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null
    })
  }
})
