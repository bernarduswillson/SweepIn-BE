import express from "express"
import multer from "multer"
import type { Request, Response } from "express"
import { responseError } from "../class/Error"

import { submitLog } from "./log.service"
import { storage } from "../utils/storage"

const route = express.Router()
const upload = multer({storage: storage("attendances")})

/**
 * @method POST /log
 * @param {string} date
 * @param {string} image
 * @param {string} latitude
 * @param {string} longitude
 * @returns logId
 *
 * @example http://{{base_url}}/report?user_id=:userId&status=:status&start_date=:startDate&end_date=:endDate&page=:page&per_page=:perPage
 */
route.post("/", upload.any(), async (req: Request, res: Response) => {
  try {
    const { userId, attendanceId, date, latitude, longitude } = req.body
    const { files } = req

    const createdId = await submitLog(
      attendanceId as string,
      userId as string,
      date as string,
      files as Express.Multer.File[],
      latitude as string,
      longitude as string
    )

    return res.status(200).json({
      message: "Submit log successful",
      data: {
        attendanceId: createdId.attendanceId,
        logId: createdId.id
      }
    })
  } catch (error) {
    responseError(error, res)
  }
})

export default route
