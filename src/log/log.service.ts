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
    context.fillStyle = '#00000'
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
    context2.fillStyle = '#00000'
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
      
      const filename = `./storage/attendances/${image.filename.split('.')[0]}.${image.filename.split('.')[1]}`
      fs.unlinkSync(image.path)


      fs.writeFileSync(filename, watermarkedImage)
      return filename
    })
  )

  return processedImages
}

export { submitLog }
