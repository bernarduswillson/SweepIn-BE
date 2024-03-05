import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { authRoutes } from "./auth/auth.routes"
import { historyRoutes } from "./history/history.routes"
import { attendanceRoutes } from "./attendance/attendance.routes"
import { uploadRouter } from "./utils/firestore"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.static("static"))
app.use(express.json())

app.use(authRoutes)
app.use("/api", historyRoutes)
app.use("/api", attendanceRoutes)

app.use("/upload", uploadRouter)

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running on port ${PORT}`)
})
