import { generateAttendance } from '../attendance/attendance.service'
import { createLog, createLogImage } from './log.repository'
import { findOneAttendance } from '../attendance/attendance.repository'
import qrcode from 'qrcode'
import sharp from 'sharp'
import { createCanvas } from 'canvas'
import fs from 'fs'
import { getUserById } from '../auth/auth.repository'
import { NotFoundError } from '../class/Error'

/**
 * Submit log
 *
 * @description Create log, if corresponding attendance does not exist, then create new attendance. else, bind attendanceId to the created log
 * @returns attendanceId, logId
 */
const submitLog = async (
  attendanceId: string,
  userId: string,
  date: string,
  image: Express.Multer.File[],
  latitude: string,
  longitude: string
) => {
  const userExists = await getUserById(parseInt(userId))

  if (!userExists) {
    throw new NotFoundError('User not found')
  }

  const _ = await generateAndOverlayImage(
    'http://www.sweepin.itb.ac.id/log/138',
    image,
    'Example text'
  )

  return attendanceId
    ? await submitEndLog(attendanceId, date, image, latitude, longitude)
    : await submitStartLog(userId, date, image, latitude, longitude)
}

const submitStartLog = async (
  userId: string,
  date: string,
  images: Express.Multer.File[],
  latitude: string,
  longitude: string
) => {
  const attendanceId = await generateAttendance(parseInt(userId))

  const { id } = await createLog(
    date,
    parseFloat(latitude),
    parseFloat(longitude),
    attendanceId,
    undefined
  )

  for (const image of images) {
    await createLogImage(id, image.path)
  }

  return { attendanceId, id }
}

const submitEndLog = async (
  attendanceId: string,
  date: string,
  images: Express.Multer.File[],
  latitude: string,
  longitude: string
) => {
  const attendanceExists = await findOneAttendance(parseInt(attendanceId))

  if (!attendanceExists) {
    throw new Error('Attendance does not exist')
  }

  if (attendanceExists.endLog.length > 0) {
    throw new Error('Attendance already ended')
  }

  const { id } = await createLog(
    date,
    parseFloat(latitude),
    parseFloat(longitude),
    undefined,
    parseInt(attendanceId)
  )

  for (const image of images) {
    await createLogImage(id, image.path)
  }

  return { attendanceId: parseInt(attendanceId), id }
}

const generateAndOverlayImage = async (
  qrText: string,
  images: Express.Multer.File[],
  text: string
) => {
  const qrCodeData = await qrcode.toBuffer(qrText)
  const qrInfo = await sharp(qrCodeData).metadata()
  const qrWidth = qrInfo.width!
  const qrHeight = qrInfo.height!

  const date = '19 April 2024'
  const langLong = '123.123, 123.123'
  const text2 = 'Lorem ipsum amet'
  const textBuffer = await textToImage(date, langLong, text2, text, 600, 180)

  const imageBuffer = fs.readFileSync(images[0].path)

  const imageInfo = await sharp(imageBuffer).metadata()
  const height = imageInfo.height!
  const width = imageInfo.width!

  const overlayedImageBuffer = await sharp(imageBuffer)
    .composite([
      {
        input: qrCodeData,
        top: height - qrHeight - 10,
        left: width - qrWidth - 10
      },
      {
        input: textBuffer,
        top: height - 180,
        left: 0
      }
    ])
    .toBuffer()

  const processedImageBuffer = await sharp(overlayedImageBuffer)
    .composite([{ input: textBuffer, gravity: 'southwest' }])
    .toBuffer()

  const filename = `./storage/attendances/${images[0].filename.split('.')[0]}.${images[0].filename.split('.')[1]}`
  fs.unlinkSync(images[0].path)

  fs.writeFileSync(filename, processedImageBuffer)
  return filename
}

const textToImage = async (
  date: string,
  langLong: string,
  text2: string,
  text: string,
  width: number,
  height: number
) => {
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
  const lineHeight = (height - 40) / maxLines
  for (let i = 0; i < lines.length && i < maxLines; i++) {
    const line = lines[i]
    const y = height / 2 - height / 4 + lineHeight * i
    context.fillText(line, 20, y, width * 0.9)
  }

  return canvas.toBuffer()
}

export { submitLog }
