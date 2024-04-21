import { Status } from ".prisma/client"
import fs from "fs"
import qrcode from "qrcode"
import sharp from "sharp"
import { createCanvas } from "canvas"

import {
  findAllReports,
  createReport,
  createReportImage,
  findOneReport,
  updateStatus
} from "./report.repository"
import { InvalidAttributeError,NotFoundError } from "../class/Error"
import { getUserById } from "../auth/auth.repository"


/**
 * Filter reports
 *
 * @description Filter attendances by userId, status, startDate, endDate then slice it into pages
 * @returns Report[]
 */
const filterReports = async (
  userId: string | undefined,
  user: string | undefined,
  role: string | undefined,
  location: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  status: Status | undefined,
  page: string,
  perPage: string
) => {
  const reports = await findAllReports(
    userId ? parseInt(userId) : undefined,
    user,
    role,
    location,
    startDate,
    endDate,
    status,
    parseInt(page),
    parseInt(perPage)
  )

  if (!reports || reports.length === 0) {
    throw new NotFoundError("Reports not found")
  }
  if (role !== "ADMIN" && role !== "CLEANER" && role !== "SECURITY" && role !== undefined) {
    throw new InvalidAttributeError("Invalid role")
  }
  if (
    location !== "GANESHA" &&
    location !== "JATINANGOR" &&
    location !== "CIREBON" &&
    location !== "JAKARTA" &&
    location !== undefined
  ) {
    throw new InvalidAttributeError("Invalid location")
  }

  return reports
}

const getReportDetails = async (reportId: string) => {
  const report = await findOneReport(parseInt(reportId))
  if (!report) {
    throw new NotFoundError("Report not found")
  }
  const imagePaths = report.images.map((image) => image.url)
  const images = imagePaths.map((path) => fs.readFileSync(path))

  return {
    ...report,
    images
  }
}

/**
 * Submit report
 *
 * @description Create new report
 * @returns ReportId
 */
const submitReport = async (
  userId: string,
  images: Express.Multer.File[],
  description: string | undefined
) => {
  const userExists = await getUserById(parseInt(userId))

  if (!userExists) {
    throw new NotFoundError("User not found")
  }

  const report = await createReport(parseInt(userId), description)

  if (!report) {
    throw new Error("Failed to create report")
  }
    const processedImages = await generateAndOverlayImages("http://www.sweepin.itb.ac.id/laporan/138", images, "Example text")
    
    for (const image of images) {
      await createReportImage(report.id, image.path)
      return report
    }
}

const generateAndOverlayImages = async (
  qrText: string,
  images: Express.Multer.File[],
  text: string
) => {
      const qrCodeData = await qrcode.toBuffer(qrText)
      const qrInfo = await sharp(qrCodeData).metadata()
      const qrWidth = qrInfo.width!
      const qrHeight = qrInfo.height!

      const date = "19 April 2024"
      const langLong = "123.123, 123.123"
      const text2 = "Lorem ipsum amet"
      const textBuffer = await textToImage(date,langLong, text2, text, 600, 180)
      
      
      // Overlay QR code onto each image
      const processedImages = await Promise.all(
          images.map(async (image) => {
              const imageBuffer = fs.readFileSync(image.path)

              const imageInfo = await sharp(imageBuffer).metadata()
              const height = imageInfo.height!
              const width = imageInfo.width!

              const overlayedImageBuffer = await sharp(imageBuffer)
                .composite([{ input: qrCodeData, top: height - 10 - qrHeight , left: width - 10 - qrWidth }])
                .toBuffer()

              const processedImageBuffer = await sharp(overlayedImageBuffer)
                .composite([{ input: textBuffer, gravity: "southwest"}])
                .toBuffer()

              const filename = `./storage/reports/${image.filename.split('.')[0]}.${image.filename.split('.')[1]}`
              fs.unlinkSync(image.path)

              fs.writeFileSync(filename, processedImageBuffer)
              return filename
          })
      )

      return processedImages
}

const textToImage = async (date: string, langLong:string, text2: string,text: string, width: number, height: number) => {
  const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')


    context.clearRect(0, 0, width, height)


    context.fillStyle = '#FFFFFF'
    context.font = '28px Arial' 
    context.textAlign = 'start'
    context.textBaseline = 'alphabetic'

    const maxLines = 4
    const lines: string[] = []
    lines.push(date)
    lines.push(langLong)
    lines.push(text2)
    lines.push(text)
    const lineHeight = (height-40) / maxLines
    for (let i = 0; i < lines.length && i < maxLines; i++) {
        const line = lines[i]
        const y = height / 2 - height / 4 + lineHeight * i
        context.fillText(line, 20, y, width * 0.9)
    }

    return canvas.toBuffer()
}

/**
 * Update report status
 *
 * @description Update report status by id
 * @returns Report
 */
const updateReportStatus = async (reportId: string, status: Status) => {
  const report = await findOneReport(parseInt(reportId))

  if (!report) {
    throw new NotFoundError("Report not found")
  }

  return await updateStatus(parseInt(reportId), status)
}

export { filterReports, getReportDetails, submitReport, updateReportStatus }
