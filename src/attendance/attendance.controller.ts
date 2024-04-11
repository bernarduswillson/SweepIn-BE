import express from "express"
import fs from "fs"
import type { Request, Response } from "express"
import { responseError } from "../class/Error"

import { filterAttendances, getAttendanceDetails } from "./attendance.service"
import { start } from "repl"

const route = express.Router()

/**
 * @method GET /attendance
 * @param {string} user_id
 * @param {string} start_date
 * @param {string} end_date
 * @param {string} page - Current page
 * @param {string} per_page - The number of data in a page
 * @returns attendances
 *
 * @example http://{{base_url}}/attendance?user_id=:userId&start_date=:startDate&end_date=:endDate&page=:page&per_page=:perPage
 */
route.get("/", async (req: Request, res: Response) => {
  try {
    const { user_id, start_date, end_date, page, per_page } = req.query
    const attendances = await filterAttendances(
      user_id as string,
      start_date as string,
      end_date as string,
      page as string,
      per_page as string
    )

    res.status(200).json({
      message: "Get all attendance successful",
      data: attendances
    })
  } catch (error) {
    responseError(error, res)
  }
})

/**
 * @method GET /attendance/:attendanceId
 * @param {string} attendanceId
 * @returns attendance
 *
 * @example http://{{base_url}}/attendance/:attendanceId
 */
route.get("/:attendanceId", async (req: Request, res: Response) => {
  try {
    const attendanceId = parseInt(req.params.attendanceId)

    const attendance = await getAttendanceDetails(attendanceId)

    const startLogImagePaths = attendance.startLog[0].images.map(
      (image) => image.url
    )

    const startLogImages = startLogImagePaths.map((path) =>
      fs.readFileSync(path)
    )

    if (attendance.endLog.length === 0) {
      return res.status(200).json({
        message: "Get attendance details successful",
        data: {
          id: attendance.id,
          date: attendance.date,
          userId: attendance.userId,
          startLog: {
            id: attendance.startLog[0].id,
            date: attendance.startLog[0].date,
            latitude: attendance.startLog[0].latitude,
            longitude: attendance.startLog[0].longitude,
            images: startLogImages
          },
          endLog: []
        }
      })
    }
    
    const endLogImagePaths = attendance.endLog[0].images.map(
      (image) => image.url
    )

    const endLogImages = endLogImagePaths.map((path) => fs.readFileSync(path))

    return res.status(200).json({
      message: "Get attendance details successful",
      data: {
        id: attendance.id,
        date: attendance.date,
        userId: attendance.userId,
        startLog: {
          id: attendance.startLog[0].id,
          date: attendance.startLog[0].date,
          latitude: attendance.startLog[0].latitude,
          longitude: attendance.startLog[0].longitude,
          images: startLogImages
        },
        endLog: {
          id: attendance.endLog[0].id,
          date: attendance.endLog[0].date,
          latitude: attendance.endLog[0].latitude,
          longitude: attendance.endLog[0].longitude,
          images: endLogImages
        }
      }
    })
  } catch (error) {
    responseError(error, res)
  }
})

export default route
