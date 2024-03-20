import express from "express"
import cors from "cors"
import bodyParser from "body-parser"

import authController from "../auth/auth.controller"
import attendanceController from "../attendance/attendance.controller"
import reportController from "../report/report.controller"
import logController from "../log/log.controller"
import swaggerRoutes from "./swagger"

export const createServer = () => {
  const app = express()
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(express.static("static"))
  app.use(express.json())

  app.use(authController)
  app.use("/attendance", attendanceController)
  app.use("/report", reportController)
  app.use("/log", logController)
  app.use("/docs", swaggerRoutes)
  return app
}
