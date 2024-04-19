import { Status } from ".prisma/client"
import fs from "fs"
import qrcode from "qrcode"
import sharp from "sharp"
// import textToImage from "text-to-image"
import { generate } from "text-to-image"
import { Readable } from "stream"
import { createCanvas } from "canvas"

import {
  findAllReports,
  createReport,
  createReportImage,
  findOneReport
} from "./report.repository"
import { NotFoundError } from "../class/Error"
import { getUserById } from "../auth/auth.repository"

/**
 * Filter reports
 *
 * @description Filter attendances by userId, status, startDate, endDate then slice it into pages
 * @returns Report[]
 */
const filterReports = async (
  userId: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  status: Status | undefined,
  page: string,
  perPage: string
) => {
  const reports = await findAllReports(
    userId ? parseInt(userId) : undefined,
    startDate,
    endDate,
    status,
    parseInt(page),
    parseInt(perPage)
  )

  if (!reports || reports.length === 0) {
    throw new NotFoundError("Reports not found")
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


    const processedImages = await generateAndOverlayImages("http://www.sweepin.itb.ac.id/laporan/138", images, "Example text");
    
    for (const image of images) {
      await createReportImage(report.id, image.path)
        return report;
    }
}

const generateAndOverlayImages = async (
  reportId: string,
  images: Express.Multer.File[],
  text: string
) => {
  try {
      // Generate QR code for the report ID
      const qrCodeData = await qrcode.toBuffer(reportId)
      const qrInfo = await sharp(qrCodeData).metadata()
      const qrWidth = qrInfo.width!
      const qrHeight = qrInfo.height!
      // const logoBuffer = fs.readFileSync('./storage/logo.jpg')
      
    


      // const size = 2000
      // const padding = 50
      // const qrCodeCanvas = createCanvas(size, size)
      // await qrcode.toCanvas(qrCodeCanvas, reportId)
      // const qrCodeData = qrCodeCanvas.toBuffer('image/jpeg')

      // const date = new Date().toString()
      const date = "19 April 2024"
      const langLong = "123.123, 123.123"
      const text2 = "Lorem ipsum peler amet"
      const textBuffer = await textToImage(date,langLong, text2, text, 600, 180)
      


      
      // Overlay QR code onto each image
      const processedImages = await Promise.all(
          images.map(async (image) => {
              const imageBuffer = fs.readFileSync(image.path)

              const imageInfo = await sharp(imageBuffer).metadata()
              const height = imageInfo.height!
              const width = imageInfo.width!

              
              // const height = imagee.length
              // const width = Math.round(height / 0.75)
              // const imageBuffer  = await sharp(imagee)
              //   .resize(width, null)
              //   .toBuffer()

              const overlayedImageBuffer = await sharp(imageBuffer)
                .composite([{ input: qrCodeData, top: height - 10 - qrHeight , left: width - 10 - qrWidth }])
                .toBuffer();
                

              // const logoInsert = await sharp(overlayedImageBuffer)
              //   .composite([{ input: logoBuffer, top: 10, left: 10 }])
              //   .toBuffer();

              const processedImageBuffer = await sharp(overlayedImageBuffer)
                .composite([{ input: textBuffer, gravity: "southwest"}])
                .toBuffer();

              const filename = `./storage/reports/${image.filename.split('.')[0]}.${image.filename.split('.')[1]}`;
              fs.unlinkSync(image.path)
              // fs.writeFileSync(filename, overlayedImageBuffer)
              fs.writeFileSync(filename, processedImageBuffer)
              return filename
          })
      );

      return processedImages;
  } catch (error) {
      console.log(error)
      throw new Error("Failed to overlay images")
  }
};

const textToImage = async (date: string, langLong:string, text2: string,text: string, width: number, height: number) => {
  const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // Background color
    context.clearRect(0, 0, width, height);

    // context.fillStyle = '#000000'
    // context.fillRect(0, 0, width, height)

    // Text settings
    context.fillStyle = '#FFFFFF'
    context.font = '28px Arial' // You can change the font and size here
    context.textAlign = 'start'
    context.textBaseline = 'alphabetic'

    // Split text into multiple lines if it's too long
    const maxLines = 4
    const lines: string[] = []
    lines.push(date)
    lines.push(langLong)
    lines.push(text2)
    lines.push(text)
    const lineHeight = (height-40) / maxLines;
    for (let i = 0; i < lines.length && i < maxLines; i++) {
        const line = lines[i];
        const y = height / 2 - height / 4 + lineHeight * i;
        context.fillText(line, 20, y, width * 0.9); // Center text horizontally
    }

    // Convert canvas to a buffer
    return canvas.toBuffer();
  // const canvas = createCanvas(width, height);
  // const context = canvas.getContext('2d');

  //   // Background color
  //   // context.fillStyle = '#ffffff';
  //   context.clearRect(0, 0, width, height);

  //   // Text settings
  //   context.fillStyle = '#FFFFFF';
  //   context.font = '15px Arial'; // You can change the font and size here
  //   context.textAlign = 'center';
  //   context.textBaseline = 'middle';

  //   // Split text into multiple lines if it's too long
  //   const maxLineWidth = 0.9 * width; // 90% of canvas width
  //   let words = text.split(' ');
  //   let line = '';
  //   let y = height / 2 - 30; // Start from center vertically
  //   for (let n = 0; n < words.length; n++) {
  //       let testLine = line + words[n] + ' ';
  //       let metrics = context.measureText(testLine);
  //       let testWidth = metrics.width;
  //       if (testWidth > maxLineWidth && n > 0) {
  //           context.fillText(line, width / 2, y);
  //           line = words[n] + ' ';
  //           y += 30; // Move to next line
  //       } else {
  //           line = testLine;
  //       }
  //   }
  //   context.fillText(line, width / 2, y);

  //   // Convert canvas to a buffer
  //   return canvas.toBuffer();
}

export { filterReports, getReportDetails, submitReport }
