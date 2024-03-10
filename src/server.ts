import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import authController from "./auth/auth.controller";
import attendanceController from "./attendance/attendance.controller";
import reportController from './report/report.controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));
app.use(express.json());

app.use(authController);
app.use("/attendance", attendanceController);
app.use("/report", reportController);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running on port ${PORT}`);
});
