import { Status } from '.prisma/client'
import fs from 'fs'
import qrcode from 'qrcode'
import sharp from 'sharp'
import { createCanvas } from 'canvas'

import {
  findAllReports,
  createReport,
  createReportImage,
  findOneReport,
  updateStatus
} from './report.repository'
import { InvalidAttributeError, NotFoundError } from '../class/Error'
import { getUserById } from '../auth/auth.repository'

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
    throw new NotFoundError('Reports not found')
  }
  if (
    role !== 'ADMIN' &&
    role !== 'CLEANER' &&
    role !== 'SECURITY' &&
    role !== undefined
  ) {
    throw new InvalidAttributeError('Invalid role')
  }
  if (
    location !== 'GANESHA' &&
    location !== 'JATINANGOR' &&
    location !== 'CIREBON' &&
    location !== 'JAKARTA' &&
    location !== undefined
  ) {
    throw new InvalidAttributeError('Invalid location')
  }

  return reports
}

const getReportDetails = async (reportId: string) => {
  const report = await findOneReport(parseInt(reportId))
  if (!report) {
    throw new NotFoundError('Report not found')
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
    throw new NotFoundError('User not found')
  }

  const report = await createReport(parseInt(userId), description)

  if (!report) {
    throw new Error('Failed to create report')
  }
  const _ = await generateAndOverlayImages(
    'http://www.sweepin.itb.ac.id/laporan/138',
    images,
    'Example text'
  )

  for (const image of images) {
    await createReportImage(report.id, image.path)
  }

  return report
}

const generateAndOverlayImages = async (
  qrText: string,
  images: Express.Multer.File[],
  text: string
) => {
    // const qrText: string = 'https://www.sweepin.itb.ac.id/report/69420'
    const text1: string = 'Lorem Ipsum sir Dolor'
    const text2: string = 'Example Text'
    const date: string = '19 April 2024'
    const time: string = '23:59'
    const langLong: string = `123.45 432.31`
    const id: string = 'id : 69420'
    const web: string = 'www.sweepin.itb.ac.id'
    const base = fs.readFileSync('./storage/basewatermark.png')
    const logo = fs.readFileSync('./storage/sweepin-logo.png')

    const qrCode = await (qrcode.toBuffer as any)(qrText, {
        width: 315,
        height: 315
    })

    const baseBuffer = await sharp(base)
        .composite ([{ input: qrCode, top: 5, left: 5 }])
        .toBuffer()

    const baseBuffer2 = await sharp(baseBuffer)
        .composite ([{input: logo, top: 82, left: 586}])
        .toBuffer()
    

    const canvas = createCanvas(470, 93)
    const context = canvas.getContext('2d')

    context.clearRect(0,0,470,93)

    context.font = '20px Arial'
    context.fillStyle = '#FFFFFF'
    context.textAlign = 'start'
    context.fillText(id, 10, 30)
    context.fillText(web, 10, 55)

    const baseBuffer3 = await sharp(baseBuffer2)
        .composite([{ input: Buffer.from(canvas.toDataURL().split(',')[1], 'base64'), top: 217, left: 320 }])
        .toBuffer()
    
    const canvas2 = createCanvas(249, 211)
    const context2 = canvas2.getContext('2d')

    context2.clearRect(0,0,249,211)

    context2.font = '20px Arial'
    context2.fillStyle = '#FFFFFF'
    context2.textAlign = 'start'
    context2.fillText(date, 10, 30)
    context2.fillText(time, 10, 55)
    context2.fillText(langLong, 10, 80)
    context2.fillText(text1, 10, 105)
    context2.fillText(text2, 10, 130)

    const baseBuffer4 = await sharp(baseBuffer3)
        .composite([{ input: Buffer.from(canvas2.toDataURL().split(',')[1], 'base64'), top: 5, left: 320 }])
        .toBuffer()

  const processedImages = await Promise.all(
    images.map(async (image) => {
      let imageBuffer = fs.readFileSync(image.path)
      
      const imgData = await sharp(imageBuffer).metadata()
      let imgWidth = imgData.width!
      let imgHeight = imgData.height!

      if (imgWidth != 2000) {
        imgWidth = 2000
        imgHeight = 2667

        imageBuffer = await sharp(imageBuffer)
          .resize(imgWidth, imgHeight)
          .toBuffer()
      }
      const watermarkedImage = await sharp(imageBuffer)
        .composite([{ input: baseBuffer4, gravity: 'southwest' }])
        .toBuffer()
      
      const filename = `./storage/reports/${image.filename.split('.')[0]}.${image.filename.split('.')[1]}`
      fs.unlinkSync(image.path)


      fs.writeFileSync(filename, watermarkedImage)
      return filename
    })
  )

  return processedImages
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
    throw new NotFoundError('Report not found')
  }

  return await updateStatus(parseInt(reportId), status)
}

export { filterReports, getReportDetails, submitReport, updateReportStatus }
