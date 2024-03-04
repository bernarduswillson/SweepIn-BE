import express from "express"
import type { Request, Response } from "express"
import { getUserByName } from "../auth/auth.service"
import { getHistory, getHistoryById } from "./history.service"

export const historyRoutes = express.Router()

// GET: /history?startdate=DATE&enddate=DATE&name=NAME
historyRoutes.get("/history", async (req: Request, res: Response) => {
  try {
    const { startdate, enddate, name } = req.query
    const user = name ? await getUserByName(name as string) : undefined
    const userId = user ? user.id : undefined
    if (userId === undefined) throw new Error("User not found")
    res.status(200).json({
      message: "success",
      data: await getHistory(startdate as string, enddate as string, userId)
    })
  } catch (error: any) {
    res.status(500).json({
      message: "error",
      data: error.message
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
  } catch (error: any) {
    res.status(500).json({
      message: "error",
      data: null
    })
  }
})
