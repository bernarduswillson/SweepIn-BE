import express from "express";
import multer from "multer"
import type { Request, Response } from "express";
import { responseError } from "../class/Error";

import { submitLog } from "./log.service";

const route = express.Router();
const upload = multer();

/**
 * @method POST /log/startlog
 * @param {string} date
 * @param {string} image
 * @param {string} latitude
 * @param {string} longitude
 * @returns logId
 * 
 * @example http://{{base_url}}/report?user_id=:userId&status=:status&start_date=:startDate&end_date=:endDate&page=:page&per_page=:perPage
 */
route.post('/startlog', upload.any(), async (req: Request, res: Response) => {
  try {
    const { date, image, latitude, longitude } = req.body;

    const logId = await submitLog(
      date as string,
      image as string,
      latitude as number,
      longitude as number
    );

    return res.status(200).json({
      message: "Submit log successful",
      data: {
        logId
      }
    })
  } catch (error) {
    responseError(error, res);
  }
})

export default route;