import express from "express"
import type { Request, Response } from "express"
import multer from "multer"
import { getUserByName } from "../auth/auth.service"
import {
  getActivity,
  createActivity,
  getLog,
  createStartLog,
  createEndLog
} from "./attendance.service"
import { uploadFile } from "../utils/firestore"

const upload = multer()

export const attendanceRoutes = express.Router()

// GET /activity?startDate=DATE&endDate=DATE&name=STRING
attendanceRoutes.get("/activity", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, name } = req.query
    const user = name ? await getUserByName(name as string) : undefined
    const userId = user ? user.id : undefined
    if (userId === undefined) throw new Error("User not found")
    res.status(200).json({
      message: "success",
      data: await getActivity(startDate as string, endDate as string, userId)
    })
  } catch (error: any) {
    res.status(500).json({
      message: "error",
      data: error.message
    })
  }
})

// GET /activity/user/:userId
attendanceRoutes.get(
  "/activity/user/:userId",
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params
      const { startDate, endDate } = req.query
      res.status(200).json({
        message: "success",
        data: await getActivity(startDate as string, endDate as string, userId)
      })
    } catch (error: any) {
      res.status(500).json({
        message: "error",
        data: error.message
      })
    }
  }
)

// POST: /activity/:userId
attendanceRoutes.post(
  "/activity/:userId",
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params
      res.status(200).json({
        message: "success",
        data: await createActivity(userId)
      })
    } catch (error: any) {
      res.status(500).json({
        message: "error",
        data: error.message
      })
    }
  }
)

// GET: /log/:id
attendanceRoutes.get("/log/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const log = await getLog(id)
    res.status(200).json({
      message: "success",
      data: log
    })
  } catch (error: any) {
    res.status(500).json({
      message: "error",
      data: error.message
    })
  }
})

// POST: /activity/start/:activityId
attendanceRoutes.post(
  "/activity/start/:activityId",
  upload.any(),
  async (req: Request, res: Response) => {
    try {
      const { activityId } = req.params
      const { latitude, longitude } = req.body
      const files: File[] = req.files as unknown as File[]
      if (!files) throw new Error("No file uploaded")
      const file = files[0]

      res.status(200).json({
        message: "success",
        data: await createStartLog(
          activityId,
          parseFloat(latitude),
          parseFloat(longitude),
          await uploadFile(file)
        )
      })
    } catch (error: any) {
      res.status(500).json({
        message: "error",
        data: error.message
      })
    }
  }
)

// POST: /activity/end/:activityId
attendanceRoutes.post(
  "/activity/end/:activityId",
  upload.any(),
  async (req: Request, res: Response) => {
    try {
      const { activityId } = req.params
      const { latitude, longitude } = req.body
      const files: File[] = req.files as unknown as File[]
      if (!files) throw new Error("No file uploaded")
      const file = files[0]

      res.status(200).json({
        message: "success",
        data: await createEndLog(
          activityId,
          parseFloat(latitude),
          parseFloat(longitude),
          await uploadFile(file)
        )
      })
    } catch (error: any) {
      res.status(500).json({
        message: "error",
        data: error.message
      })
    }
  }
)
