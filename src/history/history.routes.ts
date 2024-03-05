import express from "express"
import type { Request, Response } from "express"
import multer from "multer"
import { getUserByName } from "../auth/auth.service"
import { getHistory, getHistoryById, postHistory } from "./history.service"
import { uploadFile } from "../utils/firestore"

const upload = multer()

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
    res.status(200).json({
      message: "success",
      data: await getHistoryById(id)
    })
  } catch (error: any) {
    res.status(500).json({
      message: "error",
      data: null
    })
  }
})

// GET: /history/user/:userId
historyRoutes.get(
  "/history/user/:userId",
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params
      const { startDate, endDate } = req.query
      res.status(200).json({
        message: "success",
        data: await getHistory(startDate as string, endDate as string, userId)
      })
    } catch (error: any) {
      res.status(500).json({
        message: "error",
        data: error.message
      })
    }
  }
)

// POST: /history/:userId
historyRoutes.post(
  "/history/:userId",
  upload.any(),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params
      const { description } = req.body
      const { files } = req

      let documentation: string[] = []

      if (Array.isArray(files)) {
        for (const file of files) {
          const url = await uploadFile(file)
          documentation.push(url)
        }
      } else {
        const url = await uploadFile(files)
        documentation.push(url)
      }

      res.status(200).json({
        message: "success",
        data: await postHistory(userId, description, documentation)
      })
    } catch (error: any) {
      res.status(500).json({
        message: "error",
        data: error.message
      })
    }
  }
)
