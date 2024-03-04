import express from "express"
import type { Request, Response } from "express"
import { getUserByName } from "../auth/auth.service"
import { getActivity, getLog, postLog } from "./attendance.service"
// import { getLog, postLog } from "./attendance.service"

export const attendanceRoutes = express.Router()

attendanceRoutes.get("/attendance", async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, name } = req.query
        const user = name ? await getUserByName(name as string) : undefined
        const userId = user ? user.id : undefined
        if (userId === undefined) throw new Error("User not found")
        res.status(200).json({
            message: "success",
            data: await getActivity(startDate as string, endDate as string, userId)
        })
    } catch (error : any) {
      res.status(500).json({
        message: "error",
        data: error.message
      })
    }
})

attendanceRoutes.get("/log/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const log = await getLog(id)
        res.status(200).json({
            message: "success",
            data: log
        })
    }
    catch (error: any) {
        res.status(500).json({
            message: "error",
            data : error.message
        })
    }
})

attendanceRoutes.post("/log/:userId", async (req : Request, res : Response) => {
    try {
        const { userId } = req.params
        const { date, latitude,longitude, documentation } = req.body
        res.status(200).json({
            message : "success",
            data: await  postLog(userId,date, latitude,longitude,documentation)
        })
    }
    catch (error: any) {
        res.status(500).json({
            message: "error",
            data : error.message
        })
    }
})