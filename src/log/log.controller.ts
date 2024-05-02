import express from 'express'
import multer from 'multer'
import type { Request, Response } from 'express'
import { responseError } from '../class/Error'

import { startLog, endLog } from './log.service'
import { storage } from '../utils/storage'

const route = express.Router()
const upload = multer({ storage: storage('attendances') })

route.post('/start', upload.any(), async (req: Request, res: Response) => {
  try {
    const { userId, date, latitude, longitude } = req.body
    const { files } = req

    const log = await startLog(
      userId as string,
      date as string,
      files as Express.Multer.File[],
      latitude as string,
      longitude as string
    )

    return res.status(200).json({
      message: 'Submit start log successful',
      data: log
    })
  } catch (error) {
    responseError(error, res)
  }
})

route.post('/end', upload.any(), async (req: Request, res: Response) => {
  try {
    const { attendanceId, date, latitude, longitude } = req.body
    const { files } = req

    const log = await endLog(
      attendanceId as string,
      date as string,
      files as Express.Multer.File[],
      latitude as string,
      longitude as string
    )

    return res.status(200).json({
      message: 'Submit end log successful',
      data: log
    })
  } catch (error) {
    responseError(error, res)
  }
})

export default route
